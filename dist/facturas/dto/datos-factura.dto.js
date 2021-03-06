"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatosFacturaDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DatosFacturaDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "contribuyente", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsIn(['F', 'M']),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "persona", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.Matches(/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "rfc", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "calle", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "numInt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "numExt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "colonia", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "cp", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "estado", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "municipio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], DatosFacturaDTO.prototype, "pais", void 0);
exports.DatosFacturaDTO = DatosFacturaDTO;
//# sourceMappingURL=datos-factura.dto.js.map