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
exports.AgregarPago = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AgregarPago {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AgregarPago.prototype, "ventaId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AgregarPago.prototype, "descuento", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AgregarPago.prototype, "descuentoPesos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], AgregarPago.prototype, "pagos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], AgregarPago.prototype, "fechaHora", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], AgregarPago.prototype, "fechaUltimaRegla", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AgregarPago.prototype, "observaciones", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AgregarPago.prototype, "diagnostico", void 0);
exports.AgregarPago = AgregarPago;
//# sourceMappingURL=agregar-pago.dto.js.map