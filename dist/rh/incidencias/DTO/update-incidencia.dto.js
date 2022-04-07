"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncidenciasDTO = void 0;
const create_incidencia_dto_1 = require("./create-incidencia.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateIncidenciasDTO extends swagger_1.PartialType(create_incidencia_dto_1.CreateIncidenciaDTO) {
}
exports.UpdateIncidenciasDTO = UpdateIncidenciasDTO;
//# sourceMappingURL=update-incidencia.dto.js.map