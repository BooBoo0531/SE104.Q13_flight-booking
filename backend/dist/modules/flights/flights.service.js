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
exports.FlightsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_entity_1 = require("./entities/flight.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
let FlightsService = class FlightsService {
    flightRepo;
    settingRepo;
    constructor(flightRepo, settingRepo) {
        this.flightRepo = flightRepo;
        this.settingRepo = settingRepo;
    }
    async create(dto) {
        const settings = await this.settingRepo.findOne({ where: { id: 1 } });
        const minFlightTime = settings ? settings.minFlightTime : 30;
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (endTime.getTime() <= startTime.getTime()) {
            throw new common_1.BadRequestException('Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!');
        }
        const duration = (endTime.getTime() - startTime.getTime()) / 60000;
        if (duration < minFlightTime) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu phải là ${minFlightTime} phút.`);
        }
        const newFlight = this.flightRepo.create({
            ...dto,
            duration,
            availableSeats: dto.totalSeats,
            plane: dto.planeId ? { id: dto.planeId } : undefined,
            fromAirport: dto.fromAirportId ? { id: dto.fromAirportId } : undefined,
            toAirport: dto.toAirportId ? { id: dto.toAirportId } : undefined,
        });
        return await this.flightRepo.save(newFlight);
    }
    async findAll() {
        return await this.flightRepo.find({
            relations: ['plane', 'fromAirport', 'toAirport'],
            order: { startTime: 'ASC' },
        });
    }
    async findOne(id) {
        return await this.flightRepo.findOne({
            where: { id },
            relations: ['plane', 'fromAirport', 'toAirport', 'tickets'],
        });
    }
    async update(id, dto) {
        const flight = await this.flightRepo.findOne({ where: { id } });
        if (!flight)
            throw new common_1.BadRequestException('Không tìm thấy chuyến bay');
        if (dto.startTime && dto.endTime) {
            const startTime = new Date(dto.startTime);
            const endTime = new Date(dto.endTime);
            if (endTime.getTime() <= startTime.getTime()) {
                throw new common_1.BadRequestException('Thời gian hạ cánh phải sau thời gian cất cánh!');
            }
            const duration = (endTime.getTime() - startTime.getTime()) / 60000;
            const settings = await this.settingRepo.findOne({ where: { id: 1 } });
            const minFlightTime = settings ? settings.minFlightTime : 30;
            if (duration < minFlightTime) {
                throw new common_1.BadRequestException(`Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu: ${minFlightTime} phút.`);
            }
            dto.duration = duration;
        }
        const ticketsSold = flight.totalSeats - flight.availableSeats;
        Object.assign(flight, {
            ...dto,
            plane: dto.planeId ? { id: dto.planeId } : flight.plane,
            fromAirport: dto.fromAirportId
                ? { id: dto.fromAirportId }
                : flight.fromAirport,
            toAirport: dto.toAirportId
                ? { id: dto.toAirportId }
                : flight.toAirport,
        });
        if (dto.totalSeats !== undefined) {
            flight.availableSeats = dto.totalSeats - ticketsSold;
        }
        return await this.flightRepo.save(flight);
    }
    async remove(id) {
        const flight = await this.flightRepo.findOne({
            where: { id },
            relations: ['tickets'],
        });
        if (!flight)
            throw new common_1.BadRequestException('Không tìm thấy chuyến bay');
        if (flight.tickets && flight.tickets.length > 0) {
            throw new common_1.BadRequestException('Không thể xóa chuyến bay đã có vé được đặt');
        }
        await this.flightRepo.remove(flight);
        return { message: 'Xóa chuyến bay thành công' };
    }
};
exports.FlightsService = FlightsService;
exports.FlightsService = FlightsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FlightsService);
//# sourceMappingURL=flights.service.js.map