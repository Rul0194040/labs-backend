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
exports.createUserDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const profiles_enum_1 = require("../profiles.enum");
class createUserDTO {
    constructor(email, firstName, lastName, password, profile, active, rules, telefono, sucursal, nip, maxDescuento, tipoEmpleado, comisionVendedor) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profile = profile;
        this.password = password;
        this.active = active;
        this.rules = rules;
        this.telefono = telefono;
        this.sucursal = sucursal;
        this.nip = nip;
        this.maxDescuento = maxDescuento;
        this.tipoEmpleado = tipoEmpleado;
        this.comisionVendedor = comisionVendedor;
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], createUserDTO.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], createUserDTO.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], createUserDTO.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], createUserDTO.prototype, "profile", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], createUserDTO.prototype, "tipoEmpleado", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], createUserDTO.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], createUserDTO.prototype, "active", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.Min(0),
    class_validator_1.Max(1),
    __metadata("design:type", Number)
], createUserDTO.prototype, "comisionVendedor", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], createUserDTO.prototype, "rules", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Telefono del usuario',
    }),
    __metadata("design:type", String)
], createUserDTO.prototype, "telefono", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'sucursal del usuario',
    }),
    __metadata("design:type", Number)
], createUserDTO.prototype, "sucursal", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], createUserDTO.prototype, "nip", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], createUserDTO.prototype, "maxDescuento", void 0);
exports.createUserDTO = createUserDTO;
//# sourceMappingURL=createUser.dto.js.map