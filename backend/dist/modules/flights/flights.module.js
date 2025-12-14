"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flights_service_1 = require("./flights.service");
const flights_controller_1 = require("./flights.controller");
const flight_entity_1 = require("./entities/flight.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
let FlightsModule = class FlightsModule {
};
exports.FlightsModule = FlightsModule;
exports.FlightsModule = FlightsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flight_entity_1.Flight, setting_entity_1.Setting])],
        providers: [flights_service_1.FlightsService],
        controllers: [flights_controller_1.FlightsController],
    })
], FlightsModule);
//# sourceMappingURL=flights.module.js.map