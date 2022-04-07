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
exports.MovimientosAlmacenEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const detalleMovimientos_entity_1 = require("./detalleMovimientos.entity");
const estatusMovimiento_enum_1 = require("./estatusMovimiento.enum");
const tiposMovimiento_enum_1 = require("./tiposMovimiento.enum");
let MovimientosAlmacenEntity = class MovimientosAlmacenEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], MovimientosAlmacenEntity.prototype, "sucursalOrigen", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MovimientosAlmacenEntity.prototype, "sucursalOrigenId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], MovimientosAlmacenEntity.prototype, "sucursalDestino", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MovimientosAlmacenEntity.prototype, "sucursalDestinoId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], MovimientosAlmacenEntity.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], MovimientosAlmacenEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MovimientosAlmacenEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.OneToMany(() => detalleMovimientos_entity_1.DetalleMovimientosEntity, (d) => d.movimiento),
    __metadata("design:type", detalleMovimientos_entity_1.DetalleMovimientosEntity)
], MovimientosAlmacenEntity.prototype, "detalle", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        default: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO,
    }),
    __metadata("design:type", String)
], MovimientosAlmacenEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], MovimientosAlmacenEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
    }),
    __metadata("design:type", String)
], MovimientosAlmacenEntity.prototype, "notas", void 0);
MovimientosAlmacenEntity = __decorate([
    typeorm_1.Entity('movimientosAlmacen')
], MovimientosAlmacenEntity);
exports.MovimientosAlmacenEntity = MovimientosAlmacenEntity;
//# sourceMappingURL=movimientosAlmacen.entity.js.map