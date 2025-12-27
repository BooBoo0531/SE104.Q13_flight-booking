import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Flight } from '../flights/entities/flight.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
  ) {}

  private toUI(t: Ticket) {
    return {
      ticketId: t.ticketId,
      flightId: t.flight?.flightCode,
      seat: t.seat,
      seatClass: t.seatClass,
      price: t.price,
      name: t.passengerName,
      idCard: t.idCard ?? '',
      phone: t.phone ?? '',
      email: t.email ?? '',
    };
  }

  private async findFlightByFlightId(flightId: string): Promise<Flight> {
    // ưu tiên tìm theo flightCode (vd: FL0069)
    const byCode = await this.flightRepo.findOne({ where: { flightCode: flightId } });
    if (byCode) return byCode;

    // fallback: nếu truyền id số
    const num = Number(flightId);
    if (!Number.isNaN(num)) {
      const byId = await this.flightRepo.findOne({ where: { id: num } });
      if (byId) return byId;
    }
    throw new BadRequestException('Không tìm thấy chuyến bay');
  }

  private async generateUniqueTicketId(): Promise<string> {
    for (let i = 0; i < 30; i++) {
      const candidate = `TK${Math.floor(1000 + Math.random() * 9000)}`;
      const exists = await this.ticketRepo.findOne({ where: { ticketId: candidate } });
      if (!exists) return candidate;
    }
    throw new BadRequestException('Không thể sinh mã vé duy nhất');
  }

  async findAll() {
    const tickets = await this.ticketRepo.find({
      relations: ['flight'],
      order: { id: 'DESC' },
    });
    return tickets.map((t) => this.toUI(t));
  }

  async findOneByTicketId(ticketId: string) {
    const t = await this.ticketRepo.findOne({ where: { ticketId }, relations: ['flight'] });
    if (!t) throw new BadRequestException('Không tìm thấy vé');
    return this.toUI(t);
  }

  async create(dto: CreateTicketDto) {
    const flight = await this.findFlightByFlightId(dto.flightId);
    if (flight.availableSeats <= 0) {
      throw new BadRequestException('Chuyến bay đã hết chỗ');
    }

    const seatTaken = await this.ticketRepo.findOne({
      where: { flight: { id: flight.id } as any, seat: dto.seat },
      relations: ['flight'],
    });
    if (seatTaken) throw new BadRequestException('Ghế đã được đặt');

    const ticketId = dto.ticketId?.trim() || (await this.generateUniqueTicketId());
    const idExists = await this.ticketRepo.findOne({ where: { ticketId } });
    if (idExists) throw new BadRequestException('Mã vé đã tồn tại');

    const ticket = this.ticketRepo.create({
      ticketId,
      seat: dto.seat,
      seatClass: dto.seatClass,
      price: dto.price,
      passengerName: dto.name,
      idCard: dto.idCard,
      phone: dto.phone,
      email: dto.email,
      flight: { id: flight.id } as any,
      booking: null,
    });

    const saved = await this.ticketRepo.save(ticket);

    // cập nhật số ghế trống
    flight.availableSeats = Math.max(0, flight.availableSeats - 1);
    await this.flightRepo.save(flight);

    // nạp relation flight để trả đúng flightCode
    const withFlight = await this.ticketRepo.findOne({
      where: { id: saved.id },
      relations: ['flight'],
    });
    return this.toUI(withFlight!);
  }

  async update(ticketId: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId },
      relations: ['flight'],
    });
    if (!ticket) throw new BadRequestException('Không tìm thấy vé');

    if (dto.flightId && dto.flightId !== ticket.flight?.flightCode) {
      throw new BadRequestException('Không hỗ trợ đổi chuyến bay của vé');
    }

    if (dto.seat && dto.seat !== ticket.seat) {
      const seatTaken = await this.ticketRepo.findOne({
        where: { flight: { id: ticket.flight.id } as any, seat: dto.seat },
        relations: ['flight'],
      });
      if (seatTaken && seatTaken.ticketId !== ticket.ticketId) {
        throw new BadRequestException('Ghế đã được đặt');
      }
      ticket.seat = dto.seat;
    }

    if (dto.seatClass !== undefined) ticket.seatClass = dto.seatClass;
    if (dto.price !== undefined) ticket.price = dto.price;
    if (dto.name !== undefined) ticket.passengerName = dto.name;
    if (dto.idCard !== undefined) ticket.idCard = dto.idCard;
    if (dto.phone !== undefined) ticket.phone = dto.phone;
    if (dto.email !== undefined) ticket.email = dto.email;

    const saved = await this.ticketRepo.save(ticket);
    return this.toUI(saved);
  }

  async remove(ticketId: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId },
      relations: ['flight'],
    });
    if (!ticket) throw new BadRequestException('Không tìm thấy vé');

    const flight = ticket.flight;
    await this.ticketRepo.remove(ticket);

    if (flight) {
      flight.availableSeats = Math.min(flight.totalSeats, (flight.availableSeats ?? 0) + 1);
      await this.flightRepo.save(flight);
    }
    return { message: 'Xóa vé thành công' };
  }
}
