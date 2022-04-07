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
exports.PagoProveedorEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const tipoPagos_enum_1 = require("../pagos/tipoPagos.enum");
const typeorm_1 = require("typeorm");
const compras_entity_1 = require("./compras.entity");
let PagoProveedorEntity = class PagoProveedorEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => compras_entity_1.CompraEntity),
    __metadata("design:type", compras_entity_1.CompraEntity)
], PagoProveedorEntity.prototype, "compra", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PagoProveedorEntity.prototype, "compraId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        default: tipoPagos_enum_1.TiposPago.EFECTIVO,
    }),
    __metadata("design:type", String)
], PagoProveedorEntity.prototype, "tipo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
    }),
    __metadata("design:type", String)
], PagoProveedorEntity.prototype, "referencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PagoProveedorEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: false,
    }),
    __metadata("design:type", Number)
], PagoProveedorEntity.prototype, "monto", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", Number)
], PagoProveedorEntity.prototype, "estatus", void 0);
PagoProveedorEntity = __decorate([
    typeorm_1.Entity('pagosProveedores')
], PagoProveedorEntity);
exports.PagoProveedorEntity = PagoProveedorEntity;
//# sourceMappingURL=pagosProveedores.entity.js.map