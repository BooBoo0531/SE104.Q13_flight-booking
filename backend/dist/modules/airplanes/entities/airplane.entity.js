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
exports.Airplane = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("../../flights/entities/flight.entity");
const seat_entity_1 = require("../../seats/entities/seat.entity");
let Airplane = class Airplane {
    id;
    name;
    code;
    totalSeats;
    economySeats;
    businessSeats;
    flights;
    seats;
};
exports.Airplane = Airplane;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaMayBay' }),
    __metadata("design:type", Number)
], Airplane.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TenMayBay' }),
    __metadata("design:type", String)
], Airplane.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoHieu' }),
    __metadata("design:type", String)
], Airplane.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TongSoGhe' }),
    __metadata("design:type", Number)
], Airplane.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GhePhoThong' }),
    __metadata("design:type", Number)
], Airplane.prototype, "economySeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GheThuongGia' }),
    __metadata("design:type", Number)
], Airplane.prototype, "businessSeats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_entity_1.Flight, (flight) => flight.plane),
    __metadata("design:type", Array)
], Airplane.prototype, "flights", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seat_entity_1.Seat, (seat) => seat.airplane),
    __metadata("design:type", Array)
], Airplane.prototype, "seats", void 0);
exports.Airplane = Airplane = __decorate([
    (0, typeorm_1.Entity)({ name: 'MAYBAY' })
], Airplane);
//# sourceMappingURL=airplane.entity.js.map