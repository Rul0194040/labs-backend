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
exports.CambiarStatusMovimientoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const tipoMovimientosCajaStatus_enum_1 = require("../../common/enum/tipoMovimientosCajaStatus.enum");
class CambiarStatusMovimientoDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Razon de la cancelación',
    }),
    __metadata("design:type", String)
], CambiarStatusMovimientoDTO.prototype, "motivoCancelacion", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Tipo de movimiento',
    }),
    __metadata("design:type", String)
], CambiarStatusMovimientoDTO.prototype, "tipoMovimiento", void 0);
exports.CambiarStatusMovimientoDTO = CambiarStatusMovimientoDTO;
//# sourceMappingURL=cambiarStatusMovimiento.dto.js.map