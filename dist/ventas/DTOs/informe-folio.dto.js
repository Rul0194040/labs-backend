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
exports.InformeFolioDTO = void 0;
const ventas_entity_1 = require("./../ventas.entity");
const swagger_1 = require("@nestjs/swagger");
class InformeFolioDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'venta referida al folio',
    }),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], InformeFolioDTO.prototype, "venta", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'detalle de la venta referido al folio',
    }),
    __metadata("design:type", Array)
], InformeFolioDTO.prototype, "detalle", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'pagos referidos al folio',
    }),
    __metadata("design:type", Array)
], InformeFolioDTO.prototype, "pagos", void 0);
exports.InformeFolioDTO = InformeFolioDTO;
//# sourceMappingURL=informe-folio.dto.js.map