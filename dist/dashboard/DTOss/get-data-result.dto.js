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
exports.DataResultDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class DataResultDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "insumos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "servicios", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "sucursales", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "usuarios", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "ventas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "minimosSucursal", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "cantidadProveedores", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "ordenesCompras", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "presupuestos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "requisicionesMatriz", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "minimosMatriz", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "movimientosTransito", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "requisicionesPedidas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "transferenciasRecibidas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "altas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "insumosSucursal", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "clientes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "pacientes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], DataResultDTO.prototype, "ventasExcedidas", void 0);
exports.DataResultDTO = DataResultDTO;
//# sourceMappingURL=get-data-result.dto.js.map