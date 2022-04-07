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
exports.CajasCerradasSucursalDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const users_entity_1 = require("../../users/users.entity");
class CajasCerradasSucursalDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "montoApertura", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "total", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CajasCerradasSucursalDTO.prototype, "fechaApertura", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CajasCerradasSucursalDTO.prototype, "fechaCierre", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", users_entity_1.UsersEntity)
], CajasCerradasSucursalDTO.prototype, "usuario", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "ventas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "retiros", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "depositos", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "transferencias", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "tarjeta", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "efectivo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "cheque", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "creditoVentas", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "credito", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CajasCerradasSucursalDTO.prototype, "faltante", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CajasCerradasSucursalDTO.prototype, "observaciones", void 0);
exports.CajasCerradasSucursalDTO = CajasCerradasSucursalDTO;
//# sourceMappingURL=cajasCerradasSucursal.dto.js.map