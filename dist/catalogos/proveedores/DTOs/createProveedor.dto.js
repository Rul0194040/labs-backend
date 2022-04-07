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
exports.CreateProveedorDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProveedorDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Nombre del proveedor',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'rfc del proveedor',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "rfc", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'email del proveedor',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'telefono del proveedor',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'descripcion del proveedor',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "descripcion", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'direccion del proveedor',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "direccion", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'contacto',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateProveedorDTO.prototype, "contacto", void 0);
exports.CreateProveedorDTO = CreateProveedorDTO;
//# sourceMappingURL=createProveedor.dto.js.map