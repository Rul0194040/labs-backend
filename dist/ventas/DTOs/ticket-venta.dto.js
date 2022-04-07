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
exports.TicketVentaDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const ventas_entity_1 = require("../ventas.entity");
class TicketVentaDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'venta referida al id',
    }),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], TicketVentaDTO.prototype, "venta", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'detalle de la venta referidos a la venta',
    }),
    __metadata("design:type", Array)
], TicketVentaDTO.prototype, "detalle", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'listado de pagos referidos a la venta',
    }),
    __metadata("design:type", Array)
], TicketVentaDTO.prototype, "pagos", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'datos referentes a la sucursal donde se realizó la venta',
    }),
    __metadata("design:type", Object)
], TicketVentaDTO.prototype, "sucursal", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'nombre del cajero',
    }),
    __metadata("design:type", String)
], TicketVentaDTO.prototype, "cajero", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'fecha en que se realizó la venta',
    }),
    __metadata("design:type", String)
], TicketVentaDTO.prototype, "fechaVenta", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'total de la venta en letra',
    }),
    __metadata("design:type", String)
], TicketVentaDTO.prototype, "totalVentaLetra", void 0);
exports.TicketVentaDTO = TicketVentaDTO;
//# sourceMappingURL=ticket-venta.dto.js.map