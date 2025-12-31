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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const ticket_entity_1 = require("../../tickets/entities/ticket.entity");
let Booking = class Booking {
    id;
    bookingCode;
    bookingDate;
    status;
    totalPrice;
    user;
    tickets;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'MaPhieuDat' }),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MaDatCho' }),
    __metadata("design:type", String)
], Booking.prototype, "bookingCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'NgayDat' }),
    __metadata("design:type", Date)
], Booking.prototype, "bookingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TinhTrang', default: 'confirmed' }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TongTien' }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'MaNguoiDungDat' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.booking),
    __metadata("design:type", Array)
], Booking.prototype, "tickets", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)({ name: 'PHIEUDATCHO' })
], Booking);
//# sourceMappingURL=booking.entity.js.map