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
exports.DetalleVentasEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const servicio_entity_1 = require("../servicios/servicio.entity");
const typeorm_1 = require("typeorm");
const ventas_entity_1 = require("./ventas.entity");
let DetalleVentasEntity = class DetalleVentasEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => ventas_entity_1.VentaEntity),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], DetalleVentasEntity.prototype, "venta", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleVentasEntity.prototype, "ventaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => servicio_entity_1.ServicioEntity, { nullable: true }),
    __metadata("design:type", servicio_entity_1.ServicioEntity)
], DetalleVentasEntity.prototype, "servicio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleVentasEntity.prototype, "servicioId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
        nullable: true,
    }),
    __metadata("design:type", Number)
], DetalleVentasEntity.prototype, "descuento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
        nullable: true,
    }),
    __metadata("design:type", Number)
], DetalleVentasEntity.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DetalleVentasEntity.prototype, "cerrado", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DetalleVentasEntity.prototype, "estudios", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], DetalleVentasEntity.prototype, "medico", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DetalleVentasEntity.prototype, "recomendaciones", void 0);
DetalleVentasEntity = __decorate([
    typeorm_1.Entity('detalleVentas')
], DetalleVentasEntity);
exports.DetalleVentasEntity = DetalleVentasEntity;
//# sourceMappingURL=ventasDetalle.entity.js.map