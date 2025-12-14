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
exports.IntermediateAirport = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("../../flights/entities/flight.entity");
const airport_entity_1 = require("../../airports/entities/airport.entity");
let IntermediateAirport = class IntermediateAirport {
    id;
    flight;
    airport;
    duration;
    note;
};
exports.IntermediateAirport = IntermediateAirport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IntermediateAirport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, (flight) => flight.intermediates),
    (0, typeorm_1.JoinColumn)({ name: 'MaChuyenBay' }),
    __metadata("design:type", flight_entity_1.Flight)
], IntermediateAirport.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => airport_entity_1.Airport),
    (0, typeorm_1.JoinColumn)({ name: 'MaSanBayTG' }),
    __metadata("design:type", airport_entity_1.Airport)
], IntermediateAirport.prototype, "airport", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGDung' }),
    __metadata("design:type", Number)
], IntermediateAirport.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GhiChu', nullable: true }),
    __metadata("design:type", String)
], IntermediateAirport.prototype, "note", void 0);
exports.IntermediateAirport = IntermediateAirport = __decorate([
    (0, typeorm_1.Entity)({ name: 'TRUNGGIAN' })
], IntermediateAirport);
//# sourceMappingURL=intermediate-airport.entity.js.map