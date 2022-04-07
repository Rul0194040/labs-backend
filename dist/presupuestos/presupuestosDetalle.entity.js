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
exports.PresupuestoDetalleEntity = void 0;
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const insumo_entity_1 = require("../insumos/insumo.entity");
const typeorm_1 = require("typeorm");
const presupuesto_entity_1 = require("./presupuesto.entity");
let PresupuestoDetalleEntity = class PresupuestoDetalleEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => presupuesto_entity_1.PresupuestoEntity, { nullable: false }),
    __metadata("design:type", presupuesto_entity_1.PresupuestoEntity)
], PresupuestoDetalleEntity.prototype, "presupuesto", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "presupuestoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => insumo_entity_1.InsumoEntity, { nullable: false }),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], PresupuestoDetalleEntity.prototype, "insumo", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "insumoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_unidades_entity_1.TipoUnidadEntity, { nullable: false }),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], PresupuestoDetalleEntity.prototype, "tipoUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "tipoUnidadId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], PresupuestoDetalleEntity.prototype, "proveedor1", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "proveedor1Id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], PresupuestoDetalleEntity.prototype, "proveedor2", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "proveedor2Id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], PresupuestoDetalleEntity.prototype, "proveedor3", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "proveedor3Id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], PresupuestoDetalleEntity.prototype, "proveedorSeleccionado", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "proveedorSeleccionadoId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PresupuestoDetalleEntity.prototype, "fechaPromesa", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "precio1", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "precio2", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "precio3", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "descuento1", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "descuento2", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "descuento3", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "precioSeleccionado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PresupuestoDetalleEntity.prototype, "cantidad", void 0);
PresupuestoDetalleEntity = __decorate([
    typeorm_1.Entity('presupuestosDetalle')
], PresupuestoDetalleEntity);
exports.PresupuestoDetalleEntity = PresupuestoDetalleEntity;
//# sourceMappingURL=presupuestosDetalle.entity.js.map