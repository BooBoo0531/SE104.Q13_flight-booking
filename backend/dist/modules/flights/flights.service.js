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
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
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
        const input = dto;
        const settings = await this.settingRepo.findOne({ where: { id: 1 } });
        const minFlightTime = settings ? settings.minFlightTime : 30;
        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        if (endTime.getTime() <= startTime.getTime()) {
            throw new common_1.BadRequestException('Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!');
        }
        const duration = (endTime.getTime() - startTime.getTime()) / 60000;
        if (duration < minFlightTime) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu phải là ${minFlightTime} phút.`);
        }
        const newFlight = this.flightRepo.create({
            ...input,
            duration: duration,
            availableSeats: input.totalSeats,
            plane: input.planeId ? { id: input.planeId } : undefined,
            fromAirport: input.fromAirportId ? { id: input.fromAirportId } : undefined,
            toAirport: input.toAirportId ? { id: input.toAirportId } : undefined,
        });
        return await this.flightRepo.save(newFlight);
    }
    async findAll() {
        return await this.flightRepo.find({
            relations: ['plane', 'fromAirport', 'toAirport'],
            order: {
                startTime: 'ASC',
            },
        });
    }
    async findOne(id) {
        return await this.flightRepo.findOne({
            where: { id },
            relations: ['plane', 'fromAirport', 'toAirport', 'tickets'],
        });
    }
};
exports.FlightsService = FlightsService;
exports.FlightsService = FlightsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_2.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], FlightsService);
//# sourceMappingURL=flights.service.js.map