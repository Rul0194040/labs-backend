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
exports.LoginResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const loginIdentity_dto_1 = require("./loginIdentity.dto");
class LoginResponseDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Token JWT generado, contiene la identidad del user y sus rules.',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], LoginResponseDTO.prototype, "access_token", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Identidad del user y sus rules para ser procesadas y utilizadas por el front.',
    }),
    __metadata("design:type", loginIdentity_dto_1.LoginIdentityDTO)
], LoginResponseDTO.prototype, "identity", void 0);
exports.LoginResponseDTO = LoginResponseDTO;
//# sourceMappingURL=loginresponse.dto.js.map