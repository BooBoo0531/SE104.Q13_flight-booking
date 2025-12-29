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
exports.TicketClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_class_entity_1 = require("./entities/ticket-class.entity");
const flight_ticket_class_entity_1 = require("../flight-ticket-classes/entities/flight-ticket-class.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
const flight_entity_1 = require("../flights/entities/flight.entity");
const airplane_entity_1 = require("../airplanes/entities/airplane.entity");
let TicketClassesService = class TicketClassesService {
    repo;
    flightTicketClassRepo;
    seatRepo;
    flightRepo;
    airplaneRepo;
    constructor(repo, flightTicketClassRepo, seatRepo, flightRepo, airplaneRepo) {
        this.repo = repo;
        this.flightTicketClassRepo = flightTicketClassRepo;
        this.seatRepo = seatRepo;
        this.flightRepo = flightRepo;
        this.airplaneRepo = airplaneRepo;
    }
    toUI(entity) {
        return {
            id: entity.id,
            name: entity.name,
            percentage: Math.round((entity.priceRatio ?? 1) * 100),
        };
    }
    normalizeRatio(dto) {
        if (dto.priceRatio !== undefined)
            return dto.priceRatio;
        if (dto.percentage !== undefined)
            return dto.percentage / 100;
        return undefined;
    }
    async findAll() {
        const rows = await this.repo.find({ order: { id: 'ASC' } });
        return rows.map((r) => this.toUI(r));
    }
    async create(dto) {
        const ratio = this.normalizeRatio(dto);
        if (ratio === undefined) {
            throw new common_1.BadRequestException('Thiếu tỷ lệ giá (percentage/priceRatio)');
        }
        const row = this.repo.create({ name: dto.name, priceRatio: ratio });
        const saved = await this.repo.save(row);
        return this.toUI(saved);
    }
    async update(id, dto) {
        const row = await this.repo.findOne({ where: { id } });
        if (!row)
            throw new common_1.BadRequestException('Không tìm thấy hạng vé');
        if (dto.name !== undefined)
            row.name = dto.name;
        const ratio = this.normalizeRatio(dto);
        if (ratio !== undefined)
            row.priceRatio = ratio;
        const saved = await this.repo.save(row);
        return this.toUI(saved);
    }
    async remove(id) {
        const row = await this.repo.findOne({ where: { id } });
        if (!row)
            throw new common_1.BadRequestException('Không tìm thấy hạng vé');
        const seatsUsingClass = await this.seatRepo.count({
            where: { class: { id } }
        });
        console.log(`[DEBUG] Found ${seatsUsingClass} seats using ticketClassId=${id}`);
        if (seatsUsingClass > 0) {
            throw new common_1.BadRequestException(`Không thể xóa hạng vé "${row.name}" vì đang có ${seatsUsingClass} ghế đang sử dụng hạng vé này. ` +
                `Vui lòng xóa hoặc chuyển các ghế này sang hạng vé khác trước.`);
        }
        const airplanes = await this.airplaneRepo.find();
        const airplanesUsingClass = airplanes.filter(airplane => airplane.seatConfigs?.some(config => config.ticketClassId === id && (config.seatCount || 0) > 0));
        console.log(`[DEBUG] Found ${airplanesUsingClass.length} airplanes using ticketClassId=${id} in seatConfigs (with seatCount > 0)`);
        if (airplanesUsingClass.length > 0) {
            const airplaneNames = airplanesUsingClass.map(a => a.name).join(', ');
            throw new common_1.BadRequestException(`Không thể xóa hạng vé "${row.name}" vì đang được sử dụng trong cấu hình ghế của ${airplanesUsingClass.length} máy bay (${airplaneNames}). ` +
                `Vui lòng cập nhật cấu hình máy bay trước.`);
        }
        const flightTicketClasses = await this.flightTicketClassRepo.find({
            relations: ['flight', 'ticketClass'],
            where: { ticketClass: { id } }
        });
        console.log(`[DEBUG] Found ${flightTicketClasses.length} FlightTicketClass records for ticketClassId=${id}`);
        if (flightTicketClasses.length > 0) {
            const activeFlights = flightTicketClasses.filter((ftc) => ftc.flight && ftc.flight.status !== 'completed' && ftc.flight.status !== 'cancelled');
            console.log(`[DEBUG] Active flights: ${activeFlights.length}`, activeFlights.map(ftc => ({
                code: ftc.flight?.flightCode,
                status: ftc.flight?.status
            })));
            if (activeFlights.length > 0) {
                const flightCodes = activeFlights
                    .map(ftc => ftc.flight?.flightCode)
                    .filter(Boolean)
                    .join(', ');
                throw new common_1.BadRequestException(`Không thể xóa hạng vé "${row.name}" vì đang có ${activeFlights.length} chuyến bay đang sử dụng (${flightCodes}). ` +
                    `Chỉ có thể xóa khi tất cả các chuyến bay sử dụng hạng vé này có trạng thái 'Hoàn thành' hoặc 'Đã hủy'.`);
            }
        }
        if (flightTicketClasses.length > 0) {
            await this.flightTicketClassRepo.remove(flightTicketClasses);
        }
        await this.repo.remove(row);
        return { message: 'Xóa hạng vé thành công' };
    }
};
exports.TicketClassesService = TicketClassesService;
exports.TicketClassesService = TicketClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_class_entity_1.TicketClass)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_ticket_class_entity_1.FlightTicketClass)),
    __param(2, (0, typeorm_1.InjectRepository)(seat_entity_1.Seat)),
    __param(3, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(4, (0, typeorm_1.InjectRepository)(airplane_entity_1.Airplane)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TicketClassesService);
//# sourceMappingURL=ticket-classes.service.js.map