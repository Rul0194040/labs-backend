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
exports.UpdateInsumoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateInsumoDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Nombre del insumo',
    }),
    __metadata("design:type", String)
], UpdateInsumoDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Descripción del insumo',
    }),
    __metadata("design:type", String)
], UpdateInsumoDTO.prototype, "descripcion", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'codigo de barras',
    }),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateInsumoDTO.prototype, "codigo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Si descuenta en LABORATORIO, SUCURSAL O MATRIZ',
    }),
    __metadata("design:type", String)
], UpdateInsumoDTO.prototype, "descuentaEn", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'el tipo de unidad que posee el insumo',
    }),
    __metadata("design:type", Number)
], UpdateInsumoDTO.prototype, "tipoUnidadId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], UpdateInsumoDTO.prototype, "tipoInsumoId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UpdateInsumoDTO.prototype, "clave", void 0);
exports.UpdateInsumoDTO = UpdateInsumoDTO;
//# sourceMappingURL=updateInsumo.dto.js.map