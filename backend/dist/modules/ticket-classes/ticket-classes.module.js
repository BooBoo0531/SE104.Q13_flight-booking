"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketClassesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ticket_class_entity_1 = require("./entities/ticket-class.entity");
const ticket_classes_service_1 = require("./ticket-classes.service");
const ticket_classes_controller_1 = require("./ticket-classes.controller");
const flight_ticket_class_entity_1 = require("../flight-ticket-classes/entities/flight-ticket-class.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
const flight_entity_1 = require("../flights/entities/flight.entity");
const airplane_entity_1 = require("../airplanes/entities/airplane.entity");
let TicketClassesModule = class TicketClassesModule {
};
exports.TicketClassesModule = TicketClassesModule;
exports.TicketClassesModule = TicketClassesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ticket_class_entity_1.TicketClass, flight_ticket_class_entity_1.FlightTicketClass, seat_entity_1.Seat, flight_entity_1.Flight, airplane_entity_1.Airplane])],
        controllers: [ticket_classes_controller_1.TicketClassesController],
        providers: [ticket_classes_service_1.TicketClassesService],
        exports: [ticket_classes_service_1.TicketClassesService],
    })
], TicketClassesModule);
//# sourceMappingURL=ticket-classes.module.js.map