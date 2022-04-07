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
exports.CreateMovBancarioDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const users_entity_1 = require("../../users/users.entity");
const cuenta_bancaria_entity_1 = require("../entities/cuenta-bancaria.entity");
const tipo_movimientos_bancos_enum_1 = require("../tipo-movimientos-bancos.enum");
class CreateMovBancarioDTO {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], CreateMovBancarioDTO.prototype, "origen", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], CreateMovBancarioDTO.prototype, "destino", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", users_entity_1.UsersEntity)
], CreateMovBancarioDTO.prototype, "usuario", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], CreateMovBancarioDTO.prototype, "monto", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], CreateMovBancarioDTO.prototype, "fecha", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateMovBancarioDTO.prototype, "referencia", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateMovBancarioDTO.prototype, "tipo", void 0);
exports.CreateMovBancarioDTO = CreateMovBancarioDTO;
//# sourceMappingURL=create-detalle-cuenta.dto.js.map