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
var TicketsSchemaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsSchemaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let TicketsSchemaService = TicketsSchemaService_1 = class TicketsSchemaService {
    dataSource;
    logger = new common_1.Logger(TicketsSchemaService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        try {
            await this.dataSource.query(`ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "TenHanhKhach" varchar(255)`);
            await this.dataSource.query(`ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "CCCD" varchar(20)`);
            await this.dataSource.query(`ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "SoDienThoai" varchar(20)`);
            await this.dataSource.query(`ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "Email" varchar(255)`);
            await this.dataSource.query(`ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "MaPhieuDat" varchar(50)`);
        }
        catch (e) {
            this.logger.warn(`Không thể tự động đồng bộ cột cho bảng VE. Nếu bạn đang dùng DB cũ, hãy tự ALTER TABLE. Lý do: ${e?.message ?? e}`);
        }
    }
};
exports.TicketsSchemaService = TicketsSchemaService;
exports.TicketsSchemaService = TicketsSchemaService = TicketsSchemaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TicketsSchemaService);
//# sourceMappingURL=tickets.schema.service.js.map