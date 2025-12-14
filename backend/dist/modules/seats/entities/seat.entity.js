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
exports.Seat = void 0;
const typeorm_1 = require("typeorm");
const airplane_entity_1 = require("../../airplanes/entities/airplane.entity");
const ticket_class_entity_1 = require("../../ticket-classes/entities/ticket-class.entity");
let Seat = class Seat {
    id;
    code;
    airplane;
    class;
};
exports.Seat = Seat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaGhe' }),
    __metadata("design:type", Number)
], Seat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SoGhe' }),
    __metadata("design:type", String)
], Seat.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => airplane_entity_1.Airplane, (plane) => plane.seats),
    (0, typeorm_1.JoinColumn)({ name: 'MaMayBay' }),
    __metadata("design:type", airplane_entity_1.Airplane)
], Seat.prototype, "airplane", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_class_entity_1.TicketClass),
    (0, typeorm_1.JoinColumn)({ name: 'MaHangVe' }),
    __metadata("design:type", ticket_class_entity_1.TicketClass)
], Seat.prototype, "class", void 0);
exports.Seat = Seat = __decorate([
    (0, typeorm_1.Entity)({ name: 'GHE' })
], Seat);
//# sourceMappingURL=seat.entity.js.map