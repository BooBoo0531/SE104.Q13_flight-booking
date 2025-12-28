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
const ticket_class_entity_1 = require("../ticket-classes/entities/ticket-class.entity");
const settings_service_1 = require("../settings/settings.service");
let TicketsService = class TicketsService {
    ticketRepo;
    flightRepo;
    ticketClassRepo;
    settingsService;
    constructor(ticketRepo, flightRepo, ticketClassRepo, settingsService) {
        this.ticketRepo = ticketRepo;
        this.flightRepo = flightRepo;
        this.ticketClassRepo = ticketClassRepo;
        this.settingsService = settingsService;
    }
    generateTicketId() {
        return `TKBK${Date.now()}`;
    }
    normalizeKey(raw) {
        return (raw || '')
            .toString().trim().toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
    }
    async buildSeatClassRatioMap() {
        const rows = await this.ticketClassRepo.find();
        const map = new Map();
        for (const r of rows) {
            const key = this.normalizeKey(r.name);
            const valRaw = r.percentage ?? r.priceRatio;
            let pct = 100;
            if (typeof valRaw === 'number')
                pct = valRaw;
            else if (typeof valRaw === 'string')
                pct = Number(valRaw);
            const multiplier = (Number.isFinite(pct) && pct > 0)
                ? (pct > 10 ? pct / 100 : pct)
                : 1;
            map.set(key, multiplier);
            if (key.includes('pho thong') || key.includes('economy'))
                map.set('economy', multiplier);
            if (key.includes('thuong gia') || key.includes('business'))
                map.set('business', multiplier);
        }
        return map;
    }
    async computePriceFromSeatClass(flight, seatClass, fallbackPrice) {
        const base = Number(flight?.price ?? 0);
        if (!Number.isFinite(base) || base <= 0)
            return Number(fallbackPrice ?? 0) || 0;
        const ratioMap = await this.buildSeatClassRatioMap();
        const key = this.normalizeKey(seatClass);
        let ratio = ratioMap.get(key);
        if (!ratio) {
            if (key.includes('thuong gia') || key.includes('business'))
                ratio = ratioMap.get('business');
            else
                ratio = ratioMap.get('economy');
        }
        const finalRatio = ratio ?? 1;
        return Math.round(base * finalRatio);
    }
    async assertBookingAllowed(flight) {
        const rules = await this.settingsService.getRulesForUI();
        const latestBookingDays = Number(rules?.latestBookingTime ?? 0);
        if (!Number.isFinite(latestBookingDays) || latestBookingDays <= 0)
            return;
        const start = new Date(flight.startTime);
        const now = new Date();
        const diffMs = start.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays < latestBookingDays) {
            throw new common_1.BadRequestException(`Chỉ được đặt vé trước giờ bay tối thiểu ${latestBookingDays} ngày.`);
        }
    }
    toUI(ticket, computedPrice) {
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
            bookingId: ticket.booking ? ticket.booking.bookingCode ?? ticket.booking.id : null,
        };
    }
    async isSeatBooked(flightCode, seatCode) {
        const count = await this.ticketRepo.count({
            where: { flight: { flightCode: flightCode }, seat: seatCode }
        });
        return count > 0;
    }
    validateSeatExistence(seatCode, plane) {
        const match = seatCode.match(/^([BE])(\d+)$/);
        if (!match)
            throw new common_1.BadRequestException(`Mã ghế không hợp lệ (VD: B1, E10). Nhận được: ${seatCode}`);
        const type = match[1];
        const num = parseInt(match[2], 10);
        if (type === 'B') {
            if (num > plane.businessSeats) {
                throw new common_1.NotFoundException(`Máy bay chỉ có ${plane.businessSeats} ghế thương gia (bạn chọn ${seatCode}).`);
            }
        }
        else if (type === 'E') {
            if (num > plane.economySeats) {
                throw new common_1.NotFoundException(`Máy bay chỉ có ${plane.economySeats} ghế phổ thông (bạn chọn ${seatCode}).`);
            }
        }
    }
    async create(dto) {
        const flight = await this.flightRepo.findOne({
            where: { flightCode: dto.flightId },
            relations: { plane: true }
        });
        if (!flight)
            throw new common_1.NotFoundException('Không tìm thấy chuyến bay');
        await this.assertBookingAllowed(flight);
        const isBooked = await this.isSeatBooked(dto.flightId, dto.seat);
        if (isBooked)
            throw new common_1.BadRequestException(`Ghế ${dto.seat} đã được đặt.`);
        this.validateSeatExistence(dto.seat, flight.plane);
        const computedPrice = await this.computePriceFromSeatClass(flight, dto.seatClass, dto.price);
        const ticket = this.ticketRepo.create({
            ticketId: this.generateTicketId(),
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
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.BadRequestException('Lỗi khởi tạo mã vé, vui lòng thử lại.');
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
                if (key.includes('thuong gia') || key.includes('business'))
                    ratio = ratioMap.get('business');
                else
                    ratio = ratioMap.get('economy');
            }
            const finalRatio = ratio ?? 1;
            const computedPrice = Number.isFinite(base) && base > 0 ? Math.round(base * finalRatio) : t.price;
            return this.toUI(t, computedPrice);
        });
    }
    async findOneByTicketId(ticketId) {
        const ticket = await this.ticketRepo.findOne({
            where: { ticketId },
            relations: { flight: true, booking: true },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Không tìm thấy vé');
        const ratioMap = await this.buildSeatClassRatioMap();
        const base = Number(ticket.flight?.price ?? 0);
        const key = this.normalizeKey(ticket.seatClass);
        let ratio = ratioMap.get(key) ?? 1;
        const computedPrice = Number.isFinite(base) && base > 0 ? Math.round(base * ratio) : ticket.price;
        return this.toUI(ticket, computedPrice);
    }
    async update(ticketId, dto) {
        const ticket = await this.ticketRepo.findOne({
            where: { ticketId },
            relations: { booking: true, flight: { plane: true } },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Không tìm thấy vé');
        if (dto.seat && dto.seat !== ticket.seat) {
            const isBooked = await this.isSeatBooked(ticket.flight.flightCode, dto.seat);
            if (isBooked)
                throw new common_1.BadRequestException(`Ghế ${dto.seat} đã có người đặt.`);
            this.validateSeatExistence(dto.seat, ticket.flight.plane);
            ticket.seat = dto.seat;
        }
        if (dto.seatClass)
            ticket.seatClass = dto.seatClass;
        if (dto.name)
            ticket.passengerName = dto.name;
        if (dto.idCard)
            ticket.idCard = dto.idCard;
        if (dto.phone)
            ticket.phone = dto.phone;
        if (dto.email)
            ticket.email = dto.email;
        const inputPrice = dto.price !== undefined ? dto.price : ticket.price;
        const computedPrice = await this.computePriceFromSeatClass(ticket.flight, ticket.seatClass, inputPrice);
        ticket.price = computedPrice;
        const saved = await this.ticketRepo.save(ticket);
        return this.toUI(saved, computedPrice);
    }
    async remove(ticketId) {
        const ticket = await this.ticketRepo.findOne({
            where: { ticketId },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Không tìm thấy vé');
        await this.ticketRepo.remove(ticket);
        return { message: 'Đã xóa vé thành công' };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_class_entity_1.TicketClass)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        settings_service_1.SettingsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map