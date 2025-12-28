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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("./entities/setting.entity");
let SettingsService = class SettingsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async ensureRow() {
        const rows = await this.repo.find({ order: { id: 'ASC' }, take: 1 });
        if (rows.length > 0)
            return rows[0];
        const newRow = this.repo.create({
            minFlightTime: 30,
            maxIntermediateAirports: 2,
            minStopoverTime: 10,
            maxStopoverTime: 20,
            latestBookingTime: 12,
            latestCancellationTime: 1,
        });
        return this.repo.save(newRow);
    }
    async getRulesForUI() {
        const s = await this.ensureRow();
        return {
            minFlightTime: s.minFlightTime,
            maxStopovers: s.maxIntermediateAirports,
            minStopTime: s.minStopoverTime,
            maxStopTime: s.maxStopoverTime,
            latestBookingTime: s.latestBookingTime,
            latestCancelTime: s.latestCancellationTime,
        };
    }
    async updateRulesFromUI(dto) {
        const s = await this.ensureRow();
        if (dto.minFlightTime !== undefined)
            s.minFlightTime = dto.minFlightTime;
        if (dto.maxStopovers !== undefined)
            s.maxIntermediateAirports = dto.maxStopovers;
        const newMinStop = dto.minStopTime !== undefined ? dto.minStopTime : s.minStopoverTime;
        const newMaxStop = dto.maxStopTime !== undefined ? dto.maxStopTime : s.maxStopoverTime;
        if (newMinStop > newMaxStop) {
            throw new common_1.BadRequestException('Thời gian dừng tối thiểu không được lớn hơn thời gian dừng tối đa!');
        }
        s.minStopoverTime = newMinStop;
        s.maxStopoverTime = newMaxStop;
        if (dto.latestBookingTime !== undefined)
            s.latestBookingTime = dto.latestBookingTime;
        if (dto.latestCancelTime !== undefined)
            s.latestCancellationTime = dto.latestCancelTime;
        await this.repo.save(s);
        return this.getRulesForUI();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map