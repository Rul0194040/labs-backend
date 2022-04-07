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
exports.DetalleMovimientosEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const insumo_entity_1 = require("../insumos/insumo.entity");
const typeorm_1 = require("typeorm");
const movimientosAlmacen_entity_1 = require("./movimientosAlmacen.entity");
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const lotes_entity_1 = require("../lotes/lotes.entity");
let DetalleMovimientosEntity = class DetalleMovimientosEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => movimientosAlmacen_entity_1.MovimientosAlmacenEntity, { nullable: false }),
    __metadata("design:type", movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
], DetalleMovimientosEntity.prototype, "movimiento", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "movimientoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => insumo_entity_1.InsumoEntity, { nullable: true }),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], DetalleMovimientosEntity.prototype, "insumo", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "insumoId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
    }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "cantidadRecibida", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], DetalleMovimientosEntity.prototype, "nota", void 0);
__decorate([
    typeorm_1.ManyToOne(() => lotes_entity_1.LoteEntity, { nullable: true }),
    __metadata("design:type", lotes_entity_1.LoteEntity)
], DetalleMovimientosEntity.prototype, "lote", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "loteId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], DetalleMovimientosEntity.prototype, "proveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleMovimientosEntity.prototype, "proveedorId", void 0);
DetalleMovimientosEntity = __decorate([
    typeorm_1.Entity('detalleMovimientos')
], DetalleMovimientosEntity);
exports.DetalleMovimientosEntity = DetalleMovimientosEntity;
//# sourceMappingURL=detalleMovimientos.entity.js.map