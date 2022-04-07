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
exports.CreateEmpleadoDTO = void 0;
const profiles_enum_1 = require("./../../users/profiles.enum");
const profiles_enum_2 = require("../../users/profiles.enum");
const puesto_entity_1 = require("../../rh/puestos-departamentos/entity/puesto.entity");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmpleadoDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", puesto_entity_1.PuestoEntity)
], CreateEmpleadoDTO.prototype, "puesto", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateEmpleadoDTO.prototype, "puestoId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreateEmpleadoDTO.prototype, "fechaNac", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "curp", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "profile", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateEmpleadoDTO.prototype, "tipoEmpleado", void 0);
exports.CreateEmpleadoDTO = CreateEmpleadoDTO;
//# sourceMappingURL=create-empleado.dto.js.map