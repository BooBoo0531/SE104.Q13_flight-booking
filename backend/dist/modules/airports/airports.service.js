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
exports.AirportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const airport_entity_1 = require("./entities/airport.entity");
<<<<<<< HEAD
const flight_entity_1 = require("../flights/entities/flight.entity");
let AirportsService = class AirportsService {
    airportsRepository;
    flightsRepository;
    constructor(airportsRepository, flightsRepository) {
        this.airportsRepository = airportsRepository;
        this.flightsRepository = flightsRepository;
    }
    findAll() {
        return this.airportsRepository.find({ order: { id: 'ASC' } });
    }
    findOne(id) {
        return this.airportsRepository.findOne({ where: { id } });
    }
    slugUpper(input) {
        return (input || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z]/g, '')
            .toUpperCase();
    }
    async generateUniqueCode(name, city) {
        const baseRaw = this.slugUpper(city) || this.slugUpper(name) || 'AP';
        let base = baseRaw.slice(0, 3) || 'AP';
        while (base.length < 3)
            base = (base + 'X').slice(0, 3);
        let code = base;
        let i = 1;
        while (await this.airportsRepository.findOne({ where: { code } })) {
            code = `${base}${i}`;
            i += 1;
            if (i > 99)
                break;
        }
        return code;
    }
    async create(dto) {
        const code = dto.code?.trim() || (await this.generateUniqueCode(dto.name, dto.city));
        const exists = await this.airportsRepository.findOne({ where: { code } });
        if (exists)
            throw new common_1.BadRequestException('Mã sân bay đã tồn tại');
        const airport = this.airportsRepository.create({
            name: dto.name,
            city: dto.city,
            country: dto.country,
            code,
        });
        return this.airportsRepository.save(airport);
    }
    async update(id, dto) {
        const airport = await this.airportsRepository.findOne({ where: { id } });
        if (!airport)
            throw new common_1.BadRequestException('Không tìm thấy sân bay');
        if (dto.code && dto.code !== airport.code) {
            const exists = await this.airportsRepository.findOne({ where: { code: dto.code } });
            if (exists)
                throw new common_1.BadRequestException('Mã sân bay đã tồn tại');
        }
        Object.assign(airport, dto);
        return this.airportsRepository.save(airport);
    }
    async remove(id) {
        const airport = await this.airportsRepository.findOne({ where: { id } });
        if (!airport)
            throw new common_1.BadRequestException('Không tìm thấy sân bay');
        const usedCount = await this.flightsRepository.count({
            where: [{ fromAirport: { id } }, { toAirport: { id } }],
        });
        if (usedCount > 0) {
            throw new common_1.BadRequestException('Không thể xóa sân bay đang được dùng trong chuyến bay');
        }
        await this.airportsRepository.remove(airport);
        return { message: 'Xóa sân bay thành công' };
=======
let AirportsService = class AirportsService {
    airportsRepository;
    constructor(airportsRepository) {
        this.airportsRepository = airportsRepository;
    }
    findAll() {
        return this.airportsRepository.find({
            order: { id: 'ASC' },
        });
    }
    findOne(id) {
        return this.airportsRepository.findOne({
            where: { id },
        });
>>>>>>> origin/main
    }
};
exports.AirportsService = AirportsService;
exports.AirportsService = AirportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(airport_entity_1.Airport)),
<<<<<<< HEAD
    __param(1, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
=======
    __metadata("design:paramtypes", [typeorm_2.Repository])
>>>>>>> origin/main
], AirportsService);
//# sourceMappingURL=airports.service.js.map