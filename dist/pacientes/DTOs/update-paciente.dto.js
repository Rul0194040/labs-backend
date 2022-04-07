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
exports.UpdatePacienteDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sexoPaciente_enum_1 = require("../sexoPaciente.enum");
class UpdatePacienteDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], UpdatePacienteDTO.prototype, "cliente", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "nombre", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "apellidoPaterno", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "apellidoMaterno", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({}),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], UpdatePacienteDTO.prototype, "fechaNac", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "descripcion", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdatePacienteDTO.prototype, "sexo", void 0);
exports.UpdatePacienteDTO = UpdatePacienteDTO;
//# sourceMappingURL=update-paciente.dto.js.map