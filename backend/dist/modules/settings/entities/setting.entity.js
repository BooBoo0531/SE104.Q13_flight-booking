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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const typeorm_1 = require("typeorm");
let Setting = class Setting {
    id;
    minFlightTime;
    maxIntermediateAirports;
    minStopoverTime;
    maxStopoverTime;
    latestBookingTime;
    latestCancellationTime;
};
exports.Setting = Setting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Setting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGBayToiThieu', default: 30 }),
    __metadata("design:type", Number)
], Setting.prototype, "minFlightTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoSanBayTGToiDa', default: 2 }),
    __metadata("design:type", Number)
], Setting.prototype, "maxIntermediateAirports", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGDungToiThieu', default: 10 }),
    __metadata("design:type", Number)
], Setting.prototype, "minStopoverTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGDungToiDa', default: 20 }),
    __metadata("design:type", Number)
], Setting.prototype, "maxStopoverTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGChamNhatDatVe', default: 12 }),
    __metadata("design:type", Number)
], Setting.prototype, "latestBookingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGHuyDatVe', default: 1 }),
    __metadata("design:type", Number)
], Setting.prototype, "latestCancellationTime", void 0);
exports.Setting = Setting = __decorate([
    (0, typeorm_1.Entity)({ name: 'THAMSO' })
], Setting);
//# sourceMappingURL=setting.entity.js.map