"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncentivosDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_incentivo_dto_1 = require("./create-incentivo.dto");
class UpdateIncentivosDTO extends swagger_1.PartialType(create_incentivo_dto_1.CreateIncentivoDTO) {
}
exports.UpdateIncentivosDTO = UpdateIncentivosDTO;
//# sourceMappingURL=update-incentivo.dto.js.map