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
exports.CreatePacienteDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sexoPaciente_enum_1 = require("../sexoPaciente.enum");
class CreatePacienteDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'empresa de la que viene el paciente',
    }),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreatePacienteDTO.prototype, "cliente", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "apellidoPaterno", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "apellidoMaterno", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], CreatePacienteDTO.prototype, "fechaNac", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'nombre del paciente',
    }),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'sexo del paciente',
    }),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreatePacienteDTO.prototype, "sexo", void 0);
exports.CreatePacienteDTO = CreatePacienteDTO;
//# sourceMappingURL=create-paciente.dto.js.map