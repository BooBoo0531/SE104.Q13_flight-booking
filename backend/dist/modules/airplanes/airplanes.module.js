"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirplanesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const airplanes_service_1 = require("./airplanes.service");
const airplanes_controller_1 = require("./airplanes.controller");
const airplane_entity_1 = require("./entities/airplane.entity");
let AirplanesModule = class AirplanesModule {
};
exports.AirplanesModule = AirplanesModule;
exports.AirplanesModule = AirplanesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([airplane_entity_1.Airplane])],
        controllers: [airplanes_controller_1.AirplanesController],
        providers: [airplanes_service_1.AirplanesService],
    })
], AirplanesModule);
//# sourceMappingURL=airplanes.module.js.map