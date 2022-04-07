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
exports.CreateInsumoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateInsumoDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Nombre del insumo',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateInsumoDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'El tipo de insumo al que pertenece',
    }),
    __metadata("design:type", Number)
], CreateInsumoDTO.prototype, "tipoInsumo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'codigo de barras',
    }),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateInsumoDTO.prototype, "codigo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'el tipo de unidad que posee el insumo',
    }),
    __metadata("design:type", Number)
], CreateInsumoDTO.prototype, "tipoUnidad", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Si descuenta en LABORATORIO, SUCURSAL O MATRIZ',
    }),
    __metadata("design:type", String)
], CreateInsumoDTO.prototype, "descuentaEn", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateInsumoDTO.prototype, "clave", void 0);
exports.CreateInsumoDTO = CreateInsumoDTO;
//# sourceMappingURL=createInsumo.dto.js.map