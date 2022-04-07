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
exports.CorteTesoreroEntity = void 0;
const cajas_entity_1 = require("../../cajas/cajas.entity");
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const estatusCorte_enum_1 = require("./estatusCorte.enum");
let CorteTesoreroEntity = class CorteTesoreroEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.OneToMany(() => cajas_entity_1.CajaEntity, (c) => c.corteTesorero),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], CorteTesoreroEntity.prototype, "cajas", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], CorteTesoreroEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], CorteTesoreroEntity.prototype, "tesorero", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CorteTesoreroEntity.prototype, "tesoreroId", void 0);
CorteTesoreroEntity = __decorate([
    typeorm_1.Entity('cortesTesorero')
], CorteTesoreroEntity);
exports.CorteTesoreroEntity = CorteTesoreroEntity;
//# sourceMappingURL=cortesTesorero.entity.js.map