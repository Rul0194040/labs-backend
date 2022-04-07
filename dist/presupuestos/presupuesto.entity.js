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
exports.PresupuestoEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const EstatusPresupuesto_enum_1 = require("./EstatusPresupuesto.enum");
const presupuestosDetalle_entity_1 = require("./presupuestosDetalle.entity");
let PresupuestoEntity = class PresupuestoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], PresupuestoEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], PresupuestoEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PresupuestoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1,
        nullable: false,
        default: EstatusPresupuesto_enum_1.EstatusPresupuesto.BORRADOR,
    }),
    __metadata("design:type", String)
], PresupuestoEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.OneToMany(() => presupuestosDetalle_entity_1.PresupuestoDetalleEntity, (presupuestoDetalle) => presupuestoDetalle.presupuesto),
    __metadata("design:type", presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
], PresupuestoEntity.prototype, "presupuestoDetalle", void 0);
PresupuestoEntity = __decorate([
    typeorm_1.Entity('presupuestos')
], PresupuestoEntity);
exports.PresupuestoEntity = PresupuestoEntity;
//# sourceMappingURL=presupuesto.entity.js.map