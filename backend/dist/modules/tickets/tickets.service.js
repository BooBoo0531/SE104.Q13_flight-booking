"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("./entities/ticket.entity");
const flight_entity_1 = require("../flights/entities/flight.entity");
let TicketsService = class TicketsService {
    ticketRepo;
    flightRepo;
    constructor(ticketRepo, flightRepo) {
        this.ticketRepo = ticketRepo;
        this.flightRepo = flightRepo;
    }
    toUI(t) {
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
    async findFlightByFlightId(flightId) {
        const byCode = await this.flightRepo.findOne({ where: { flightCode: flightId } });
        if (byCode)
            return byCode;
        const num = Number(flightId);
        if (!Number.isNaN(num)) {
            const byId = await this.flightRepo.findOne({ where: { id: num } });
            if (byId)
                return byId;
        }
        throw new common_1.BadRequestException('Không tìm thấy chuyến bay');
    }
    async generateUniqueTicketId() {
        for (let i = 0; i < 30; i++) {
            const candidate = `TK${Math.floor(1000 + Math.random() * 9000)}`;
            const exists = await this.ticketRepo.findOne({ where: { ticketId: candidate } });
            if (!exists)
                return candidate;
        }
        throw new common_1.BadRequestException('Không thể sinh mã vé duy nhất');
    }
    async findAll() {
        const tickets = await this.ticketRepo.find({
            relations: ['flight'],
            order: { id: 'DESC' },
        });
        return tickets.map((t) => this.toUI(t));
    }
    async findOneByTicketId(ticketId) {
        const t = await this.ticketRepo.findOne({ where: { ticketId }, relations: ['flight'] });
        if (!t)
            throw new common_1.BadRequestException('Không tìm thấy vé');
        return this.toUI(t);
    }
    async create(dto) {
        const flight = await this.findFlightByFlightId(dto.flightId);
        if (flight.availableSeats <= 0) {
            throw new common_1.BadRequestException('Chuyến bay đã hết chỗ');
        }
        const seatTaken = await this.ticketRepo.findOne({
            where: { flight: { id: flight.id }, seat: dto.seat },
            relations: ['flight'],
        });
        if (seatTaken)
            throw new common_1.BadRequestException('Ghế đã được đặt');
        const ticketId = dto.ticketId?.trim() || (await this.generateUniqueTicketId());
        const idExists = await this.ticketRepo.findOne({ where: { ticketId } });
        if (idExists)
            throw new common_1.BadRequestException('Mã vé đã tồn tại');
        const ticket = this.ticketRepo.create({
            ticketId,
            seat: dto.seat,
            seatClass: dto.seatClass,
            price: dto.price,
            passengerName: dto.name,
            idCard: dto.idCard,
            phone: dto.phone,
            email: dto.email,
            flight: { id: flight.id },
            booking: null,
        });
        const saved = await this.ticketRepo.save(ticket);
        flight.availableSeats = Math.max(0, flight.availableSeats - 1);
        await this.flightRepo.save(flight);
        const withFlight = await this.ticketRepo.findOne({
            where: { id: saved.id },
            relations: ['flight'],
        });
        return this.toUI(withFlight);
    }
    async update(ticketId, dto) {
        const ticket = await this.ticketRepo.findOne({
            where: { ticketId },
            relations: ['flight'],
        });
        if (!ticket)
            throw new common_1.BadRequestException('Không tìm thấy vé');
        if (dto.flightId && dto.flightId !== ticket.flight?.flightCode) {
            throw new common_1.BadRequestException('Không hỗ trợ đổi chuyến bay của vé');
        }
        if (dto.seat && dto.seat !== ticket.seat) {
            const seatTaken = await this.ticketRepo.findOne({
                where: { flight: { id: ticket.flight.id }, seat: dto.seat },
                relations: ['flight'],
            });
            if (seatTaken && seatTaken.ticketId !== ticket.ticketId) {
                throw new common_1.BadRequestException('Ghế đã được đặt');
            }
            ticket.seat = dto.seat;
        }
        if (dto.seatClass !== undefined)
            ticket.seatClass = dto.seatClass;
        if (dto.price !== undefined)
            ticket.price = dto.price;
        if (dto.name !== undefined)
            ticket.passengerName = dto.name;
        if (dto.idCard !== undefined)
            ticket.idCard = dto.idCard;
        if (dto.phone !== undefined)
            ticket.phone = dto.phone;
        if (dto.email !== undefined)
            ticket.email = dto.email;
        const saved = await this.ticketRepo.save(ticket);
        return this.toUI(saved);
    }
    async remove(ticketId) {
        const ticket = await this.ticketRepo.findOne({
            where: { ticketId },
            relations: ['flight'],
        });
        if (!ticket)
            throw new common_1.BadRequestException('Không tìm thấy vé');
        const flight = ticket.flight;
        await this.ticketRepo.remove(ticket);
        if (flight) {
            flight.availableSeats = Math.min(flight.totalSeats, (flight.availableSeats ?? 0) + 1);
            await this.flightRepo.save(flight);
        }
        return { message: 'Xóa vé thành công' };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map