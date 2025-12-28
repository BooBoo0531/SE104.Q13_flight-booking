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
exports.Flight = void 0;
const typeorm_1 = require("typeorm");
const airplane_entity_1 = require("../../airplanes/entities/airplane.entity");
const ticket_entity_1 = require("../../tickets/entities/ticket.entity");
const airport_entity_1 = require("../../airports/entities/airport.entity");
const intermediate_airport_entity_1 = require("../../intermediate-airports/entities/intermediate-airport.entity");
const flight_ticket_class_entity_1 = require("../../flight-ticket-classes/entities/flight-ticket-class.entity");
let Flight = class Flight {
    id;
    flightCode;
    startTime;
    endTime;
    duration;
    price;
    totalSeats;
    availableSeats;
    status;
    fromAirport;
    toAirport;
    plane;
    tickets;
    intermediates;
    ticketClassDetails;
};
exports.Flight = Flight;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaChuyenBay' }),
    __metadata("design:type", Number)
], Flight.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MaSoChuyenBay', unique: true }),
    __metadata("design:type", String)
], Flight.prototype, "flightCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NgayGioBay' }),
    __metadata("design:type", Date)
], Flight.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NgayVe' }),
    __metadata("design:type", Date)
], Flight.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TGBay' }),
    __metadata("design:type", Number)
], Flight.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GiaVeGoc' }),
    __metadata("design:type", Number)
], Flight.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TongSoGhe' }),
    __metadata("design:type", Number)
], Flight.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoGheTrong' }),
    __metadata("design:type", Number)
], Flight.prototype, "availableSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TrangThai', default: 'active' }),
    __metadata("design:type", String)
], Flight.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => airport_entity_1.Airport, (airport) => airport.departingFlights),
    (0, typeorm_1.JoinColumn)({ name: 'MaSanBayDi' }),
    __metadata("design:type", airport_entity_1.Airport)
], Flight.prototype, "fromAirport", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => airport_entity_1.Airport, (airport) => airport.arrivingFlights),
    (0, typeorm_1.JoinColumn)({ name: 'MaSanBayDen' }),
    __metadata("design:type", airport_entity_1.Airport)
], Flight.prototype, "toAirport", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => airplane_entity_1.Airplane, (plane) => plane.flights),
    (0, typeorm_1.JoinColumn)({ name: 'MaMayBay' }),
    __metadata("design:type", airplane_entity_1.Airplane)
], Flight.prototype, "plane", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.flight),
    __metadata("design:type", Array)
], Flight.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => intermediate_airport_entity_1.IntermediateAirport, (inter) => inter.flight),
    __metadata("design:type", Array)
], Flight.prototype, "intermediates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_ticket_class_entity_1.FlightTicketClass, (details) => details.flight),
    __metadata("design:type", Array)
], Flight.prototype, "ticketClassDetails", void 0);
exports.Flight = Flight = __decorate([
    (0, typeorm_1.Entity)({ name: 'CHUYENBAY' })
], Flight);
//# sourceMappingURL=flight.entity.js.map