import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';
import { FlightTicketClass } from '../flight-ticket-classes/entities/flight-ticket-class.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Flight } from '../flights/entities/flight.entity';
import { Airplane } from '../airplanes/entities/airplane.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Injectable()
export class TicketClassesService {
  constructor(
    @InjectRepository(TicketClass)
    private readonly repo: Repository<TicketClass>,
    @InjectRepository(FlightTicketClass)
    private readonly flightTicketClassRepo: Repository<FlightTicketClass>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
    @InjectRepository(Airplane)
    private readonly airplaneRepo: Repository<Airplane>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  private toUI(entity: TicketClass) {
    return {
      id: entity.id,
      name: entity.name,
      percentage: Math.round((entity.priceRatio ?? 1) * 100),
    };
  }

  private normalizeRatio(dto: { percentage?: number; priceRatio?: number }) {
    if (dto.priceRatio !== undefined) return dto.priceRatio;
    if (dto.percentage !== undefined) return dto.percentage / 100;
    return undefined;
  }

  async findAll() {
    const rows = await this.repo.find({ order: { id: 'ASC' } });
    return rows.map((r) => this.toUI(r));
  }

  async create(dto: CreateTicketClassDto) {
    const ratio = this.normalizeRatio(dto);
    if (ratio === undefined) {
      throw new BadRequestException('Thiếu tỷ lệ giá (percentage/priceRatio)');
    }
    const row = this.repo.create({ name: dto.name, priceRatio: ratio });
    const saved = await this.repo.save(row);
    return this.toUI(saved);
  }

  async update(id: number, dto: UpdateTicketClassDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new BadRequestException('Không tìm thấy hạng vé');

    if (dto.name !== undefined) row.name = dto.name;
    const ratio = this.normalizeRatio(dto);
    if (ratio !== undefined) row.priceRatio = ratio;
    const saved = await this.repo.save(row);
    return this.toUI(saved);
  }

  async remove(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new BadRequestException('Không tìm thấy hạng vé');

    // 1. Kiểm tra có ghế (Seat) nào đang sử dụng hạng vé này không
    const seatsUsingClass = await this.seatRepo.count({
      where: { class: { id } }
    });

    console.log(`[DEBUG] Found ${seatsUsingClass} seats using ticketClassId=${id}`);

    if (seatsUsingClass > 0) {
      throw new BadRequestException(
        `Không thể xóa hạng vé "${row.name}" vì đang có ${seatsUsingClass} ghế đang sử dụng hạng vé này. ` +
        `Vui lòng xóa hoặc chuyển các ghế này sang hạng vé khác trước.`
      );
    }

    // 2. Kiểm tra có máy bay nào đang sử dụng hạng vé trong seatConfigs không
    const airplanes = await this.airplaneRepo.find();
    const airplanesUsingClass = airplanes.filter(
      airplane => airplane.seatConfigs?.some(
        config => config.ticketClassId === id && (config.seatCount || 0) > 0
      )
    );

    console.log(`[DEBUG] Found ${airplanesUsingClass.length} airplanes using ticketClassId=${id} in seatConfigs (with seatCount > 0)`);

    if (airplanesUsingClass.length > 0) {
      const airplaneNames = airplanesUsingClass.map(a => a.name).join(', ');
      throw new BadRequestException(
        `Không thể xóa hạng vé "${row.name}" vì đang được sử dụng trong cấu hình ghế của ${airplanesUsingClass.length} máy bay (${airplaneNames}). ` +
        `Vui lòng cập nhật cấu hình máy bay trước.`
      );
    }

    // 3. Kiểm tra có vé nào trong chuyến bay đang hoạt động sử dụng hạng vé này không
    const activeTicketsCount = await this.ticketRepo
      .createQueryBuilder('ticket')
      .innerJoin('ticket.flight', 'flight')
      .where('ticket.seatClass = :className', { className: row.name })
      .andWhere('flight.status NOT IN (:...statuses)', { 
        statuses: ['completed', 'cancelled'] 
      })
      .getCount();

    console.log(`[DEBUG] Found ${activeTicketsCount} tickets with seatClass="${row.name}" in active flights`);

    if (activeTicketsCount > 0) {
      // Lấy danh sách mã chuyến bay để hiển thị trong message
      const activeFlightsWithTickets = await this.ticketRepo
        .createQueryBuilder('ticket')
        .innerJoin('ticket.flight', 'flight')
        .select('DISTINCT flight.flightCode', 'flightCode')
        .where('ticket.seatClass = :className', { className: row.name })
        .andWhere('flight.status NOT IN (:...statuses)', { 
          statuses: ['completed', 'cancelled'] 
        })
        .limit(5)
        .getRawMany();

      const flightCodes = activeFlightsWithTickets.map(f => f.flightCode).join(', ');
      const moreText = activeFlightsWithTickets.length >= 5 ? ', ...' : '';
      
      throw new BadRequestException(
        `Không thể xóa hạng vé "${row.name}" vì đang có ${activeTicketsCount} vé đã được mua trong các chuyến bay đang hoạt động (${flightCodes}${moreText}). ` +
        `Chỉ có thể xóa khi tất cả các chuyến bay sử dụng hạng vé này có trạng thái 'Hoàn thành' hoặc 'Đã hủy'.`
      );
    }

    // 4. Kiểm tra có FlightTicketClass nào với chuyến bay đang hoạt động không
    const flightTicketClasses = await this.flightTicketClassRepo.find({
      relations: ['flight', 'ticketClass'],
      where: { ticketClass: { id } }
    });
    
    console.log(`[DEBUG] Found ${flightTicketClasses.length} FlightTicketClass records for ticketClassId=${id}`);

    if (flightTicketClasses.length > 0) {
      const activeFlights = flightTicketClasses.filter(
        (ftc) => ftc.flight && ftc.flight.status !== 'completed' && ftc.flight.status !== 'cancelled'
      );

      console.log(`[DEBUG] Active flights: ${activeFlights.length}`, 
        activeFlights.map(ftc => ({ 
          code: ftc.flight?.flightCode, 
          status: ftc.flight?.status 
        }))
      );

      if (activeFlights.length > 0) {
        const flightCodes = activeFlights
          .map(ftc => ftc.flight?.flightCode)
          .filter(Boolean)
          .join(', ');
        throw new BadRequestException(
          `Không thể xóa hạng vé "${row.name}" vì đang có ${activeFlights.length} chuyến bay đang sử dụng (${flightCodes}). ` +
          `Chỉ có thể xóa khi tất cả các chuyến bay sử dụng hạng vé này có trạng thái 'Hoàn thành' hoặc 'Đã hủy'.`
        );
      }
    }

    // 5. Xóa tất cả FlightTicketClass liên quan (cho các chuyến bay đã hoàn thành/hủy)
    if (flightTicketClasses.length > 0) {
      await this.flightTicketClassRepo.remove(flightTicketClasses);
    }

    // 6. Xóa hạng vé
    await this.repo.remove(row);
    return { message: 'Xóa hạng vé thành công' };
  }
}