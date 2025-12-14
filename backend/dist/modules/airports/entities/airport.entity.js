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
exports.Airport = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("../../flights/entities/flight.entity");
let Airport = class Airport {
    id;
    name;
    code;
    city;
    country;
    departingFlights;
    arrivingFlights;
};
exports.Airport = Airport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaSanBay' }),
    __metadata("design:type", Number)
], Airport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TenSanBay' }),
    __metadata("design:type", String)
], Airport.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MaCode', unique: true }),
    __metadata("design:type", String)
], Airport.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TenThanhPho' }),
    __metadata("design:type", String)
], Airport.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'QuocGia' }),
    __metadata("design:type", String)
], Airport.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_entity_1.Flight, (flight) => flight.fromAirport),
    __metadata("design:type", Array)
], Airport.prototype, "departingFlights", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_entity_1.Flight, (flight) => flight.toAirport),
    __metadata("design:type", Array)
], Airport.prototype, "arrivingFlights", void 0);
exports.Airport = Airport = __decorate([
    (0, typeorm_1.Entity)({ name: 'SANBAY' })
], Airport);
//# sourceMappingURL=airport.entity.js.map