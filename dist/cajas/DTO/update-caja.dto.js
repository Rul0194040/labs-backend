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
exports.UpdateCajaDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateCajaDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'fecha de apertura',
    }),
    __metadata("design:type", Date)
], UpdateCajaDTO.prototype, "fechaApertura", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'fecha de cierre',
    }),
    __metadata("design:type", Date)
], UpdateCajaDTO.prototype, "fechaCierre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total del efectivo',
    }),
    __metadata("design:type", Number)
], UpdateCajaDTO.prototype, "totalEfecivo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total del efectivo proveniente de las tarjetas',
    }),
    __metadata("design:type", Number)
], UpdateCajaDTO.prototype, "totalTarjeta", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total del efectivo proveniente de los cheques',
    }),
    __metadata("design:type", Number)
], UpdateCajaDTO.prototype, "totalCheque", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total del efectivo proveniente de las tranferencias',
    }),
    __metadata("design:type", Number)
], UpdateCajaDTO.prototype, "totalTransferencia", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de cancelaciones',
    }),
    __metadata("design:type", Number)
], UpdateCajaDTO.prototype, "totalCancelaciones", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'notas de caja',
    }),
    __metadata("design:type", String)
], UpdateCajaDTO.prototype, "notas", void 0);
exports.UpdateCajaDTO = UpdateCajaDTO;
//# sourceMappingURL=update-caja.dto.js.map