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
exports.MovimientosCajaDTO = void 0;
const tiposMovimientoCaja_enum_1 = require("./../../common/enum/tiposMovimientoCaja.enum");
const swagger_1 = require("@nestjs/swagger");
class MovimientosCajaDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Monto del deposito',
    }),
    __metadata("design:type", Number)
], MovimientosCajaDTO.prototype, "monto", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'tipo de movimiento',
    }),
    __metadata("design:type", String)
], MovimientosCajaDTO.prototype, "movimiento", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Notas del deposito',
    }),
    __metadata("design:type", String)
], MovimientosCajaDTO.prototype, "notas", void 0);
exports.MovimientosCajaDTO = MovimientosCajaDTO;
//# sourceMappingURL=movimientos-caja.dto.js.map