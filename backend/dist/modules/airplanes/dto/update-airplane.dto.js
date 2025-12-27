"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAirplaneDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_airplane_dto_1 = require("./create-airplane.dto");
class UpdateAirplaneDto extends (0, swagger_1.PartialType)(create_airplane_dto_1.CreateAirplaneDto) {
}
exports.UpdateAirplaneDto = UpdateAirplaneDto;
//# sourceMappingURL=update-airplane.dto.js.map