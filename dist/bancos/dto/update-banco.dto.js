"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBancoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_banco_dto_1 = require("./create-banco.dto");
class UpdateBancoDto extends swagger_1.PartialType(create_banco_dto_1.CreateBancoDto) {
}
exports.UpdateBancoDto = UpdateBancoDto;
//# sourceMappingURL=update-banco.dto.js.map