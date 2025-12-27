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
const intermediate_airport_entity_1 = require("../intermediate-airports/entities/intermediate-airport.entity");
let FlightsService = class FlightsService {
    flightRepo;
    settingRepo;
    intermediateRepo;
    constructor(flightRepo, settingRepo, intermediateRepo) {
        this.flightRepo = flightRepo;
        this.settingRepo = settingRepo;
        this.intermediateRepo = intermediateRepo;
    }
    async create(dto) {
        const input = dto;
        const settings = await this.settingRepo.findOne({ where: { id: 1 } });
        const minFlightTime = settings ? settings.minFlightTime : 30;
        const maxIntermediateAirports = settings ? settings.maxIntermediateAirports : 2;
        const minStopoverTime = settings ? settings.minStopoverTime : 10;
        const maxStopoverTime = settings ? settings.maxStopoverTime : 20;
        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        const now = new Date();
        const hoursUntilFlight = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilFlight < 0) {
            throw new common_1.BadRequestException('Không thể tạo chuyến bay với thời gian đã qua. Vui lòng chọn thời gian trong tương lai.');
        }
        if (hoursUntilFlight < 72) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Chỉ được tạo chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`);
        }
        if (endTime.getTime() <= startTime.getTime()) {
            throw new common_1.BadRequestException('Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!');
        }
        const duration = (endTime.getTime() - startTime.getTime()) / 60000;
        if (duration < minFlightTime) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu phải là ${minFlightTime} phút.`);
        }
        if (input.intermediateAirports && input.intermediateAirports.length > 0) {
            if (input.intermediateAirports.length > maxIntermediateAirports) {
                throw new common_1.BadRequestException(`Vi phạm quy định: Số sân bay trung gian tối đa là ${maxIntermediateAirports}`);
            }
            for (const inter of input.intermediateAirports) {
                if (inter.duration < minStopoverTime || inter.duration > maxStopoverTime) {
                    throw new common_1.BadRequestException(`Vi phạm quy định: Thời gian dừng tại sân bay trung gian phải từ ${minStopoverTime} đến ${maxStopoverTime} phút`);
                }
            }
        }
        const newFlight = this.flightRepo.create({
            ...input,
            duration: duration,
            availableSeats: input.totalSeats,
            plane: input.planeId ? { id: input.planeId } : undefined,
            fromAirport: input.fromAirportId ? { id: input.fromAirportId } : undefined,
            toAirport: input.toAirportId ? { id: input.toAirportId } : undefined,
        });
        const savedFlight = await this.flightRepo.save(newFlight);
        if (input.intermediateAirports && input.intermediateAirports.length > 0) {
            for (const inter of input.intermediateAirports) {
                await this.intermediateRepo.save({
                    flight: savedFlight,
                    airport: { id: inter.airportId },
                    duration: inter.duration,
                    note: inter.note || '',
                });
            }
        }
        return savedFlight;
    }
    async findAll() {
        return await this.flightRepo.find({
            relations: ['plane', 'fromAirport', 'toAirport', 'intermediates', 'intermediates.airport'],
            order: {
                startTime: 'ASC',
            },
        });
    }
    async findOne(id) {
        return await this.flightRepo.findOne({
            where: { id },
            relations: ['plane', 'fromAirport', 'toAirport', 'tickets', 'intermediates', 'intermediates.airport'],
        });
    }
    async update(id, dto) {
        const input = dto;
        const flight = await this.flightRepo.findOne({ where: { id } });
        if (!flight) {
            throw new common_1.BadRequestException('Không tìm thấy chuyến bay');
        }
        const now = new Date();
        const startTime = input.startTime ? new Date(input.startTime) : flight.startTime;
        const hoursUntilFlight = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilFlight < 0) {
            throw new common_1.BadRequestException('Không thể cập nhật chuyến bay đã cất cánh hoặc đã hoàn thành.');
        }
        if (hoursUntilFlight < 72) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Chỉ được cập nhật chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`);
        }
        if (input.startTime && input.endTime) {
            const newStartTime = new Date(input.startTime);
            const endTime = new Date(input.endTime);
            if (endTime.getTime() <= newStartTime.getTime()) {
                throw new common_1.BadRequestException('Thời gian hạ cánh phải sau thời gian cất cánh!');
            }
            const duration = (endTime.getTime() - startTime.getTime()) / 60000;
            const settings = await this.settingRepo.findOne({ where: { id: 1 } });
            const minFlightTime = settings ? settings.minFlightTime : 30;
            if (duration < minFlightTime) {
                throw new common_1.BadRequestException(`Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu: ${minFlightTime} phút.`);
            }
            input.duration = duration;
        }
        const ticketsSold = flight.totalSeats - flight.availableSeats;
        Object.assign(flight, {
            ...input,
            plane: input.planeId ? { id: input.planeId } : flight.plane,
            fromAirport: input.fromAirportId ? { id: input.fromAirportId } : flight.fromAirport,
            toAirport: input.toAirportId ? { id: input.toAirportId } : flight.toAirport,
        });
        if (input.totalSeats !== undefined) {
            flight.availableSeats = input.totalSeats - ticketsSold;
        }
        const savedFlight = await this.flightRepo.save(flight);
        if (input.intermediateAirports !== undefined) {
            await this.intermediateRepo.delete({ flight: { id: savedFlight.id } });
            if (input.intermediateAirports.length > 0) {
                const settings = await this.settingRepo.findOne({ where: { id: 1 } });
                const maxIntermediateAirports = settings ? settings.maxIntermediateAirports : 2;
                const minStopoverTime = settings ? settings.minStopoverTime : 10;
                const maxStopoverTime = settings ? settings.maxStopoverTime : 20;
                if (input.intermediateAirports.length > maxIntermediateAirports) {
                    throw new common_1.BadRequestException(`Vi phạm quy định: Số sân bay trung gian tối đa là ${maxIntermediateAirports}`);
                }
                for (const inter of input.intermediateAirports) {
                    if (inter.duration < minStopoverTime || inter.duration > maxStopoverTime) {
                        throw new common_1.BadRequestException(`Vi phạm quy định: Thời gian dừng tại sân bay trung gian phải từ ${minStopoverTime} đến ${maxStopoverTime} phút`);
                    }
                    await this.intermediateRepo.save({
                        flight: savedFlight,
                        airport: { id: inter.airportId },
                        duration: inter.duration,
                        note: inter.note || '',
                    });
                }
            }
        }
        return savedFlight;
    }
    async remove(id) {
        const flight = await this.flightRepo.findOne({
            where: { id },
            relations: ['tickets']
        });
        if (!flight) {
            throw new common_1.BadRequestException('Không tìm thấy chuyến bay');
        }
        const now = new Date();
        const hoursUntilFlight = (flight.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilFlight < 0) {
            throw new common_1.BadRequestException('Không thể hủy chuyến bay đã cất cánh hoặc đã hoàn thành.');
        }
        if (hoursUntilFlight < 72) {
            throw new common_1.BadRequestException(`Vi phạm quy định: Chỉ được hủy chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`);
        }
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
    __param(0, (0, typeorm_2.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_2.InjectRepository)(setting_entity_1.Setting)),
    __param(2, (0, typeorm_2.InjectRepository)(intermediate_airport_entity_1.IntermediateAirport)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FlightsService);
//# sourceMappingURL=flights.service.js.map