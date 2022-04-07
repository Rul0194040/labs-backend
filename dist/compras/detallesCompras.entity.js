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
exports.DetalleCompraEntity = void 0;
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const insumo_entity_1 = require("../insumos/insumo.entity");
const typeorm_1 = require("typeorm");
const compras_entity_1 = require("./compras.entity");
let DetalleCompraEntity = class DetalleCompraEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => insumo_entity_1.InsumoEntity, { nullable: false }),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], DetalleCompraEntity.prototype, "insumo", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "insumoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => compras_entity_1.CompraEntity, { nullable: false }),
    __metadata("design:type", compras_entity_1.CompraEntity)
], DetalleCompraEntity.prototype, "compra", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "compraId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_unidades_entity_1.TipoUnidadEntity, { nullable: false }),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], DetalleCompraEntity.prototype, "tipoUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "tipoUnidadId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'clave',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], DetalleCompraEntity.prototype, "clave", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "subtotal", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], DetalleCompraEntity.prototype, "descuento", void 0);
DetalleCompraEntity = __decorate([
    typeorm_1.Entity('detallesCompras')
], DetalleCompraEntity);
exports.DetalleCompraEntity = DetalleCompraEntity;
//# sourceMappingURL=detallesCompras.entity.js.map