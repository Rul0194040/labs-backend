"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentoDto = void 0;
const create_documento_dto_1 = require("./create-documento.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateDocumentoDto extends swagger_1.PartialType(create_documento_dto_1.CreateDocumentoDto) {
}
exports.UpdateDocumentoDto = UpdateDocumentoDto;
//# sourceMappingURL=update-documento.dto.js.map