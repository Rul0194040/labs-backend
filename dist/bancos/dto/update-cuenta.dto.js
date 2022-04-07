"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCuentaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cuenta_dto_1 = require("./create-cuenta.dto");
class UpdateCuentaDto extends swagger_1.PartialType(create_cuenta_dto_1.CreateCuentaDto) {
}
exports.UpdateCuentaDto = UpdateCuentaDto;
//# sourceMappingURL=update-cuenta.dto.js.map