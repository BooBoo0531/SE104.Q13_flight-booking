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
let TicketClassesService = class TicketClassesService {
    repo;
    constructor(repo) {
        this.repo = repo;
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
        await this.repo.remove(row);
        return { message: 'Xóa hạng vé thành công' };
    }
};
exports.TicketClassesService = TicketClassesService;
exports.TicketClassesService = TicketClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_class_entity_1.TicketClass)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TicketClassesService);
//# sourceMappingURL=ticket-classes.service.js.map