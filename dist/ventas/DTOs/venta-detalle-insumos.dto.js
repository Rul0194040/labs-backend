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
exports.VentaDetalleInsumosDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const servicio_entity_1 = require("../../servicios/servicio.entity");
const ventas_entity_1 = require("../ventas.entity");
class VentaDetalleInsumosDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], VentaDetalleInsumosDTO.prototype, "venta", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], VentaDetalleInsumosDTO.prototype, "ventaId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", servicio_entity_1.ServicioEntity)
], VentaDetalleInsumosDTO.prototype, "servicio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], VentaDetalleInsumosDTO.prototype, "servicioId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], VentaDetalleInsumosDTO.prototype, "descuento", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], VentaDetalleInsumosDTO.prototype, "precio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], VentaDetalleInsumosDTO.prototype, "cerrado", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], VentaDetalleInsumosDTO.prototype, "estudios", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], VentaDetalleInsumosDTO.prototype, "medico", void 0);
__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VentaDetalleInsumosDTO.prototype, "recomendaciones", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], VentaDetalleInsumosDTO.prototype, "insumos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], VentaDetalleInsumosDTO.prototype, "muestras", void 0);
exports.VentaDetalleInsumosDTO = VentaDetalleInsumosDTO;
//# sourceMappingURL=venta-detalle-insumos.dto.js.map