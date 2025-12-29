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
exports.AirplanesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const airplane_entity_1 = require("./entities/airplane.entity");
let AirplanesService = class AirplanesService {
    airplanesRepository;
    constructor(airplanesRepository) {
        this.airplanesRepository = airplanesRepository;
    }
    create(createAirplaneDto) {
        const { seatConfigs = [], ...rest } = createAirplaneDto;
        const normalizedSeatConfigs = this.normalizeSeatConfigs(seatConfigs, rest);
        const totalSeats = this.computeTotalSeats(normalizedSeatConfigs, rest);
        const { economySeats, businessSeats } = this.deriveLegacySeats(normalizedSeatConfigs, rest);
        const newPlane = this.airplanesRepository.create({
            ...rest,
            seatConfigs: normalizedSeatConfigs,
            totalSeats,
            economySeats,
            businessSeats,
        });
        return this.airplanesRepository.save(newPlane);
    }
    findAll() {
        return this.airplanesRepository.find({ order: { id: 'DESC' } }).then(planes => {
            return planes.map(plane => {
                if (!plane.seatConfigs || plane.seatConfigs.length === 0) {
                    plane.seatConfigs = [
                        { ticketClassId: 0, name: 'Phổ thông', prefix: 'E', seatCount: plane.economySeats },
                        { ticketClassId: 1, name: 'Thương gia', prefix: 'B', seatCount: plane.businessSeats },
                    ];
                }
                return plane;
            });
        });
    }
    async remove(id) {
        await this.airplanesRepository.delete(id);
        return { deleted: true };
    }
    async update(id, updateAirplaneDto) {
        const { seatConfigs = [], ...rest } = updateAirplaneDto;
        const normalizedSeatConfigs = this.normalizeSeatConfigs(seatConfigs, rest);
        const totalSeats = this.computeTotalSeats(normalizedSeatConfigs, rest);
        const { economySeats, businessSeats } = this.deriveLegacySeats(normalizedSeatConfigs, rest);
        await this.airplanesRepository.update(id, {
            ...rest,
            seatConfigs: normalizedSeatConfigs,
            totalSeats,
            economySeats,
            businessSeats,
        });
        return this.airplanesRepository.findOneBy({ id });
    }
    normalizeSeatConfigs(raw = [], fallback) {
        if (!Array.isArray(raw) || raw.length === 0) {
            return [
                { ticketClassId: 0, name: 'Phổ thông', prefix: 'E', seatCount: Number(fallback?.economySeats ?? 0) },
                { ticketClassId: 1, name: 'Thương gia', prefix: 'B', seatCount: Number(fallback?.businessSeats ?? 0) },
            ];
        }
        const seen = new Set();
        return raw.map((item, idx) => {
            const name = (item?.name ?? '').toString().trim() || `Hang ${idx + 1}`;
            const prefix = this.buildPrefix(item?.prefix, name, seen);
            const seatCount = Number(item?.seatCount ?? 0) || 0;
            const ticketClassId = Number(item?.ticketClassId ?? idx);
            seen.add(prefix);
            return { ticketClassId, name, prefix, seatCount };
        });
    }
    buildPrefix(prefix, name, seen) {
        let p = (prefix ?? '').toString().trim().toUpperCase();
        if (!p) {
            const normalized = name
                .normalize('NFD')
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toUpperCase();
            p = normalized.charAt(0) || 'X';
        }
        if (seen.has(p)) {
            let i = 2;
            let candidate = `${p}${i}`;
            while (seen.has(candidate)) {
                i += 1;
                candidate = `${p}${i}`;
            }
            p = candidate;
        }
        return p;
    }
    computeTotalSeats(seatConfigs, fallback) {
        const total = seatConfigs.reduce((sum, c) => sum + (Number(c.seatCount) || 0), 0);
        if (total > 0)
            return total;
        return Number(fallback?.economySeats ?? 0) + Number(fallback?.businessSeats ?? 0);
    }
    deriveLegacySeats(seatConfigs, fallback) {
        const economy = seatConfigs.find((c) => c.prefix === 'E') || seatConfigs.find((c) => /PHO\s*THONG|ECONOMY/i.test(c.name || ''));
        const business = seatConfigs.find((c) => c.prefix === 'B') || seatConfigs.find((c) => /THUONG\s*GIA|BUSINESS/i.test(c.name || ''));
        return {
            economySeats: economy ? Number(economy.seatCount) || 0 : Number(fallback?.economySeats ?? 0),
            businessSeats: business ? Number(business.seatCount) || 0 : Number(fallback?.businessSeats ?? 0),
        };
    }
};
exports.AirplanesService = AirplanesService;
exports.AirplanesService = AirplanesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(airplane_entity_1.Airplane)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AirplanesService);
//# sourceMappingURL=airplanes.service.js.map