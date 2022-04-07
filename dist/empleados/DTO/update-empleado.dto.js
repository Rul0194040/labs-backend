"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmpleadoDTO = void 0;
const create_empleado_dto_1 = require("./create-empleado.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateEmpleadoDTO extends swagger_1.PartialType(create_empleado_dto_1.CreateEmpleadoDTO) {
}
exports.UpdateEmpleadoDTO = UpdateEmpleadoDTO;
//# sourceMappingURL=update-empleado.dto.js.map