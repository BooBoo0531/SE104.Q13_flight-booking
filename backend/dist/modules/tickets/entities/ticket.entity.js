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
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("../../flights/entities/flight.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
let Ticket = class Ticket {
    id;
    ticketId;
    seat;
    seatClass;
    price;
    passengerName;
    flight;
    booking;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaVe' }),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MaVeHienThi', unique: true }),
    __metadata("design:type", String)
], Ticket.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoGhe' }),
    __metadata("design:type", String)
], Ticket.prototype, "seat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HangVe' }),
    __metadata("design:type", String)
], Ticket.prototype, "seatClass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GiaTien' }),
    __metadata("design:type", Number)
], Ticket.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TenHanhKhach' }),
    __metadata("design:type", String)
], Ticket.prototype, "passengerName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, (flight) => flight.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'MaChuyenBay' }),
    __metadata("design:type", flight_entity_1.Flight)
], Ticket.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'MaPhieuDat' }),
    __metadata("design:type", booking_entity_1.Booking)
], Ticket.prototype, "booking", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)({ name: 'VE' })
], Ticket);
//# sourceMappingURL=ticket.entity.js.map