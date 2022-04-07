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
exports.CompraEntity = void 0;
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const presupuesto_entity_1 = require("../presupuestos/presupuesto.entity");
const typeorm_1 = require("typeorm");
const EstatusCompra_enum_1 = require("./EstatusCompra.enum");
const pagosProveedores_entity_1 = require("./pagosProveedores.entity");
let CompraEntity = class CompraEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: false }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], CompraEntity.prototype, "proveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "proveedorId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => presupuesto_entity_1.PresupuestoEntity, { nullable: true }),
    __metadata("design:type", presupuesto_entity_1.PresupuestoEntity)
], CompraEntity.prototype, "presupuesto", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "presupuestoId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], CompraEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        name: 'folio',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], CompraEntity.prototype, "folio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "numCotizacion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "descuento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1,
        nullable: false,
        default: EstatusCompra_enum_1.EstatusCompra.BORRADOR,
    }),
    __metadata("design:type", String)
], CompraEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "saldo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], CompraEntity.prototype, "conClave", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], CompraEntity.prototype, "pagado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], CompraEntity.prototype, "credito", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], CompraEntity.prototype, "diasCredito", void 0);
__decorate([
    typeorm_1.Column({
        name: 'pathCotizacion',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], CompraEntity.prototype, "pathCotizacion", void 0);
__decorate([
    typeorm_1.OneToMany(() => pagosProveedores_entity_1.PagoProveedorEntity, (pago) => pago.compra),
    __metadata("design:type", pagosProveedores_entity_1.PagoProveedorEntity)
], CompraEntity.prototype, "pagos", void 0);
CompraEntity = __decorate([
    typeorm_1.Entity('compras')
], CompraEntity);
exports.CompraEntity = CompraEntity;
//# sourceMappingURL=compras.entity.js.map