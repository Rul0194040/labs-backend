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
exports.CreateDetalleDTO = void 0;
const insumo_entity_1 = require("./../../insumos/insumo.entity");
const movimientosAlmacen_entity_1 = require("./../movimientosAlmacen.entity");
const swagger_1 = require("@nestjs/swagger");
class CreateDetalleDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
], CreateDetalleDTO.prototype, "movimientoAlmacen", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], CreateDetalleDTO.prototype, "insumo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateDetalleDTO.prototype, "cantidad", void 0);
exports.CreateDetalleDTO = CreateDetalleDTO;
//# sourceMappingURL=create-detalle.dto.js.map