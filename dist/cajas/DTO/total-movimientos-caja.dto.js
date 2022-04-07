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
exports.TotalMovimientosCajaDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class TotalMovimientosCajaDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'total en depositos en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "depositos", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total en retiros en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "retiros", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de ventas en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "ventas", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cancelaciones en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "cancelaciones", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cobros con transferencias en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "transferencias", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cobros con tarjeta en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "tarjeta", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cobros con efectivo en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "efectivo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cobros con cheque en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "cheque", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cobros a credito en una caja',
    }),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "credito", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TotalMovimientosCajaDTO.prototype, "creditoVentas", void 0);
exports.TotalMovimientosCajaDTO = TotalMovimientosCajaDTO;
//# sourceMappingURL=total-movimientos-caja.dto.js.map