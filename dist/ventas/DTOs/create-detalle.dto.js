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
exports.AsignDetalleDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const servicio_venta_dto_1 = require("./servicio-venta.dto");
const class_validator_1 = require("class-validator");
class AsignDetalleDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AsignDetalleDTO.prototype, "ventaId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", servicio_venta_dto_1.ServicioVentaDTO)
], AsignDetalleDTO.prototype, "servicio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AsignDetalleDTO.prototype, "medico", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AsignDetalleDTO.prototype, "recomendaciones", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AsignDetalleDTO.prototype, "precio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], AsignDetalleDTO.prototype, "descuento", void 0);
exports.AsignDetalleDTO = AsignDetalleDTO;
//# sourceMappingURL=create-detalle.dto.js.map