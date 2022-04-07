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
exports.DetalleVentasInsumosEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const ventasDetalle_entity_1 = require("./ventasDetalle.entity");
const sucursalesInsumos_entity_1 = require("../sucursales/sucursalesInsumos.entity");
const users_entity_1 = require("../users/users.entity");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
let DetalleVentasInsumosEntity = class DetalleVentasInsumosEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => ventasDetalle_entity_1.DetalleVentasEntity, { nullable: false }),
    __metadata("design:type", ventasDetalle_entity_1.DetalleVentasEntity)
], DetalleVentasInsumosEntity.prototype, "detalleVenta", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleVentasInsumosEntity.prototype, "detalleVentaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursalesInsumos_entity_1.SucursalesInsumosEntity, { nullable: false }),
    __metadata("design:type", sucursalesInsumos_entity_1.SucursalesInsumosEntity)
], DetalleVentasInsumosEntity.prototype, "insumoSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleVentasInsumosEntity.prototype, "insumoSucursalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity),
    __metadata("design:type", users_entity_1.UsersEntity)
], DetalleVentasInsumosEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleVentasInsumosEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_unidades_entity_1.TipoUnidadEntity),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], DetalleVentasInsumosEntity.prototype, "unidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetalleVentasInsumosEntity.prototype, "unidadId", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], DetalleVentasInsumosEntity.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DetalleVentasInsumosEntity.prototype, "nota", void 0);
DetalleVentasInsumosEntity = __decorate([
    typeorm_1.Entity('detalleVentasInsumos'),
    typeorm_1.Index(['detalleVenta', 'insumoSucursal'], { unique: true })
], DetalleVentasInsumosEntity);
exports.DetalleVentasInsumosEntity = DetalleVentasInsumosEntity;
//# sourceMappingURL=ventasDetalleInsumos.entity.js.map