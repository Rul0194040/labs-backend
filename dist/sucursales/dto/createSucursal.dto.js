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
exports.CreateSucursalDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const users_entity_1 = require("../../users/users.entity");
const class_validator_1 = require("class-validator");
const zona_enum_1 = require("../zona.enum");
class CreateSucursalDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Nombre de la sucursal',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateSucursalDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Nombre del primer apikey de la sucursal',
    }),
    class_validator_1.IsString(),
    class_validator_1.MinLength(5),
    __metadata("design:type", String)
], CreateSucursalDTO.prototype, "apiKey", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Descripción de la sucursal',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateSucursalDTO.prototype, "descripcion", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Valor que nos permite saber si es matriz o no',
    }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSucursalDTO.prototype, "esMatriz", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Telefono de la sucursal',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateSucursalDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'responsable de la sucursal',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateSucursalDTO.prototype, "responsableId", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Indica si la sucursal puede hacer requisiciones o no',
    }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], CreateSucursalDTO.prototype, "puedeHacerRequisicion", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], CreateSucursalDTO.prototype, "esForanea", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEnum(zona_enum_1.ZonaEnum),
    __metadata("design:type", String)
], CreateSucursalDTO.prototype, "zona", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSucursalDTO.prototype, "seleccionarZona", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", users_entity_1.UsersEntity)
], CreateSucursalDTO.prototype, "userResponsable", void 0);
exports.CreateSucursalDTO = CreateSucursalDTO;
//# sourceMappingURL=createSucursal.dto.js.map