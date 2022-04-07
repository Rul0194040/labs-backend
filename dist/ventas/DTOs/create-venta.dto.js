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
exports.CreateVentaDTO = void 0;
const zona_enum_1 = require("./../../sucursales/zona.enum");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tipoPrecio_enum_1 = require("../tipoPrecio.enum");
class CreateVentaDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateVentaDTO.prototype, "pacienteId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateVentaDTO.prototype, "medicoId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateVentaDTO.prototype, "zona", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreateVentaDTO.prototype, "fechaUltimaRegla", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateVentaDTO.prototype, "observaciones", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateVentaDTO.prototype, "diagnostico", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateVentaDTO.prototype, "tipoPrecio", void 0);
exports.CreateVentaDTO = CreateVentaDTO;
//# sourceMappingURL=create-venta.dto.js.map