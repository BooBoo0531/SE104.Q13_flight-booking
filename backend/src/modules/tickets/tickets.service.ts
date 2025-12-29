import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Flight } from '../flights/entities/flight.entity';
import { TicketClass } from '../ticket-classes/entities/ticket-class.entity';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Flight) private readonly flightRepo: Repository<Flight>,
    @InjectRepository(TicketClass) private readonly ticketClassRepo: Repository<TicketClass>,
    private readonly settingsService: SettingsService,
  ) {}

  // --- HÀM MỚI: Tạo mã vé format TKBK + Timestamp (VD: TKBK173540...) ---
  private generateTicketId(): string {
    return `TKBK${Date.now()}`;
  }

  // Chuẩn hóa chuỗi để so sánh (xóa dấu, lowercase)
  private normalizeKey(raw: string): string {
    return (raw || '')
      .toString().trim().toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
  }

  // Lấy tỉ lệ giá vé từ DB (Thương gia vs Phổ thông)
  private async buildSeatClassRatioMap(): Promise<Map<string, number>> {
    const rows = await this.ticketClassRepo.find();
    const map = new Map<string, number>();

    for (const r of rows) {
      const key = this.normalizeKey(r.name);
      const valRaw = (r as any).percentage ?? (r as any).priceRatio;
      let pct = 100;
      
      if (typeof valRaw === 'number') pct = valRaw;
      else if (typeof valRaw === 'string') pct = Number(valRaw);

      const multiplier = (Number.isFinite(pct) && pct > 0) 
        ? (pct > 10 ? pct / 100 : pct) 
        : 1;

      map.set(key, multiplier);
      if (key.includes('pho thong') || key.includes('economy')) map.set('economy', multiplier);
      if (key.includes('thuong gia') || key.includes('business')) map.set('business', multiplier);
    }
    return map;
  }

  // Tính giá vé dựa trên tỉ lệ
  private async computePriceFromSeatClass(
    flight: Flight,
    seatClass: string,
    fallbackPrice?: number,
  ): Promise<number> {
    const base = Number(flight?.price ?? 0);
    if (!Number.isFinite(base) || base <= 0) return Number(fallbackPrice ?? 0) || 0;

    const ratioMap = await this.buildSeatClassRatioMap();
    const key = this.normalizeKey(seatClass);
    
    let ratio = ratioMap.get(key);
    if (!ratio) {
        if (key.includes('thuong gia') || key.includes('business')) ratio = ratioMap.get('business');
        else ratio = ratioMap.get('economy');
    }

    const finalRatio = ratio ?? 1;
    return Math.round(base * finalRatio);
  }

  // Kiểm tra quy định thời gian đặt vé (Settings)
  private async assertBookingAllowed(flight: Flight) {
    const rules = await this.settingsService.getRulesForUI();
    const latestBookingDays = Number(rules?.latestBookingTime ?? 0);
    if (!Number.isFinite(latestBookingDays) || latestBookingDays <= 0) return;

    const start = new Date(flight.startTime);
    const now = new Date();
    const diffMs = start.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < latestBookingDays) {
      throw new BadRequestException(`Chỉ được đặt vé trước giờ bay tối thiểu ${latestBookingDays} ngày.`);
    }
  }

  // Map dữ liệu ra Frontend
  private toUI(ticket: Ticket, computedPrice?: number) {
    return {
      ticketId: ticket.ticketId,
      seat: ticket.seat,
      seatClass: ticket.seatClass,
      price: typeof computedPrice === 'number' ? computedPrice : ticket.price,
      name: ticket.passengerName,
      idCard: ticket.idCard,
      phone: ticket.phone,
      email: ticket.email,
      flightId: ticket.flight?.flightCode ?? null,
      bookingId: ticket.booking ? (ticket.booking as any).bookingCode ?? ticket.booking.id : null,
    };
  }

  // Kiểm tra ghế đã có ai đặt chưa (trong bảng Ticket)
  private async isSeatBooked(flightCode: string, seatCode: string): Promise<boolean> {
    const count = await this.ticketRepo.count({
        where: { flight: { flightCode: flightCode }, seat: seatCode }
    });
    return count > 0;
  }

  // --- Kiểm tra ghế có tồn tại không dựa trên seatConfigs ---
  private validateSeatExistence(seatCode: string, plane: any) {
    // Định dạng: PREFIX + số, ví dụ B1, E10, P3...
    const match = seatCode.match(/^([A-Z]{1,3})(\d+)$/i);
    if (!match) throw new BadRequestException(`Mã ghế không hợp lệ (VD: B1, E10). Nhận được: ${seatCode}`);

    const prefix = match[1].toUpperCase();
    const num = parseInt(match[2], 10);

    const seatConfigs: any[] = Array.isArray(plane?.seatConfigs) ? plane.seatConfigs : [];

    if (seatConfigs.length > 0) {
      const cfg = seatConfigs.find((c) => (c.prefix || '').toUpperCase() === prefix);
      if (!cfg) {
        throw new NotFoundException(`Máy bay không có cấu hình ghế với tiền tố ${prefix}.`);
      }
      const maxSeat = Number(cfg.seatCount) || 0;
      if (num < 1 || num > maxSeat) {
        throw new NotFoundException(`Máy bay chỉ có ${maxSeat} ghế cho hạng ${cfg.name || prefix} (bạn chọn ${seatCode}).`);
      }
      return;
    }

    // Fallback cũ: chỉ B/E
    if (prefix === 'B') {
      if (num > plane.businessSeats) {
        throw new NotFoundException(`Máy bay chỉ có ${plane.businessSeats} ghế thương gia (bạn chọn ${seatCode}).`);
      }
    } else if (prefix === 'E') {
      if (num > plane.economySeats) {
        throw new NotFoundException(`Máy bay chỉ có ${plane.economySeats} ghế phổ thông (bạn chọn ${seatCode}).`);
      }
    } else {
      throw new NotFoundException(`Máy bay không hỗ trợ hạng ghế với tiền tố ${prefix}.`);
    }
  }

  // ==================== MAIN FUNCTIONS ====================

  async create(dto: CreateTicketDto) {
    // 1. Tìm chuyến bay + thông tin máy bay
    const flight = await this.flightRepo.findOne({ 
        where: { flightCode: dto.flightId },
        relations: { plane: true } 
    });

    if (!flight) throw new NotFoundException('Không tìm thấy chuyến bay');

    // 2. Check rule giờ đặt
    await this.assertBookingAllowed(flight);

    // 3. Check trùng ghế (đã có ai đặt chưa)
    const isBooked = await this.isSeatBooked(dto.flightId, dto.seat);
    if (isBooked) throw new BadRequestException(`Ghế ${dto.seat} đã được đặt.`);

    // 4. FIX LỖI: Kiểm tra ghế có "hợp lệ" so với máy bay không
    this.validateSeatExistence(dto.seat, flight.plane);

    // 5. Tính giá
    const computedPrice = await this.computePriceFromSeatClass(flight, dto.seatClass, dto.price);

    // 6. Tạo vé (FIX LỖI NULL: Gọi generateTicketId)
    const ticket = this.ticketRepo.create({
      ticketId: this.generateTicketId(), // <--- TỰ SINH MÃ VÉ TẠI ĐÂY
      seat: dto.seat,
      seatClass: dto.seatClass,
      price: computedPrice,
      passengerName: dto.name,
      idCard: dto.idCard,
      phone: dto.phone,
      email: dto.email,
      flight: flight,
    });

    try {
      const saved = await this.ticketRepo.save(ticket);
      return this.toUI(saved, computedPrice);
    } catch (error) {
       // Xử lý lỗi duplicate nếu vô tình random trùng (hiếm gặp với Date.now())
       if (error.code === '23505') {
         throw new BadRequestException('Lỗi khởi tạo mã vé, vui lòng thử lại.');
       }
       throw error;
    }
  }

  async findAll() {
    const tickets = await this.ticketRepo.find({
      relations: { flight: true, booking: true },
      order: { id: 'DESC' }, 
    });
    const ratioMap = await this.buildSeatClassRatioMap();

    return tickets.map((t) => {
      const base = Number(t.flight?.price ?? 0);
      const key = this.normalizeKey(t.seatClass);
      let ratio = ratioMap.get(key);
      if (!ratio) {
        if (key.includes('thuong gia') || key.includes('business')) ratio = ratioMap.get('business');
        else ratio = ratioMap.get('economy');
      }
      const finalRatio = ratio ?? 1;
      const computedPrice = Number.isFinite(base) && base > 0 ? Math.round(base * finalRatio) : t.price;
      return this.toUI(t, computedPrice);
    });
  }

  async findOneByTicketId(ticketId: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId },
      relations: { flight: true, booking: true },
    });
    if (!ticket) throw new NotFoundException('Không tìm thấy vé');

    const ratioMap = await this.buildSeatClassRatioMap();
    const base = Number(ticket.flight?.price ?? 0);
    const key = this.normalizeKey(ticket.seatClass);
    let ratio = ratioMap.get(key) ?? 1;
    const computedPrice = Number.isFinite(base) && base > 0 ? Math.round(base * ratio) : ticket.price;

    return this.toUI(ticket, computedPrice);
  }

  async update(ticketId: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId },
      relations: { booking: true, flight: { plane: true } }, 
    });
    if (!ticket) throw new NotFoundException('Không tìm thấy vé');

    if (dto.seat && dto.seat !== ticket.seat) {
      // 1. Check trùng ghế mới
      const isBooked = await this.isSeatBooked(ticket.flight.flightCode, dto.seat);
      if (isBooked) throw new BadRequestException(`Ghế ${dto.seat} đã có người đặt.`);

      // 2. Check ghế mới có tồn tại trên máy bay không
      this.validateSeatExistence(dto.seat, ticket.flight.plane);

      ticket.seat = dto.seat;
    }

    if (dto.seatClass) ticket.seatClass = dto.seatClass;
    if (dto.name) ticket.passengerName = dto.name;
    if (dto.idCard) ticket.idCard = dto.idCard;
    if (dto.phone) ticket.phone = dto.phone;
    if (dto.email) ticket.email = dto.email;

    const inputPrice = dto.price !== undefined ? dto.price : ticket.price;
    const computedPrice = await this.computePriceFromSeatClass(ticket.flight, ticket.seatClass, inputPrice);
    ticket.price = computedPrice;

    const saved = await this.ticketRepo.save(ticket);
    return this.toUI(saved, computedPrice);
  }

  async remove(ticketId: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId },
    });
    if (!ticket) throw new NotFoundException('Không tìm thấy vé');
    await this.ticketRepo.remove(ticket);
    return { message: 'Đã xóa vé thành công' };
  }
}