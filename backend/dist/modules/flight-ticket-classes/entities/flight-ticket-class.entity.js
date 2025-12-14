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
exports.FlightTicketClass = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("../../flights/entities/flight.entity");
const ticket_class_entity_1 = require("../../ticket-classes/entities/ticket-class.entity");
let FlightTicketClass = class FlightTicketClass {
    id;
    flight;
    ticketClass;
    price;
    totalSeats;
    soldSeats;
};
exports.FlightTicketClass = FlightTicketClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightTicketClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, (flight) => flight.ticketClassDetails),
    (0, typeorm_1.JoinColumn)({ name: 'MaChuyenBay' }),
    __metadata("design:type", flight_entity_1.Flight)
], FlightTicketClass.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_class_entity_1.TicketClass),
    (0, typeorm_1.JoinColumn)({ name: 'MaHangVe' }),
    __metadata("design:type", ticket_class_entity_1.TicketClass)
], FlightTicketClass.prototype, "ticketClass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GiaTien' }),
    __metadata("design:type", Number)
], FlightTicketClass.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TongSoGhe' }),
    __metadata("design:type", Number)
], FlightTicketClass.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoGheDaBan', default: 0 }),
    __metadata("design:type", Number)
], FlightTicketClass.prototype, "soldSeats", void 0);
exports.FlightTicketClass = FlightTicketClass = __decorate([
    (0, typeorm_1.Entity)({ name: 'CT_HANGVE' })
], FlightTicketClass);
//# sourceMappingURL=flight-ticket-class.entity.js.map