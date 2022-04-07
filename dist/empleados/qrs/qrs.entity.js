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
var QrsEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrsEntity = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const sucursal_entity_1 = require("../../sucursales/sucursal.entity");
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
let QrsEntity = QrsEntity_1 = class QrsEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => QrsEntity_1, { nullable: true }),
    __metadata("design:type", QrsEntity)
], QrsEntity.prototype, "entrada", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], QrsEntity.prototype, "entradaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], QrsEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], QrsEntity.prototype, "sucursalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], QrsEntity.prototype, "empleado", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], QrsEntity.prototype, "empleadoId", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', nullable: true, default: null }),
    __metadata("design:type", Date)
], QrsEntity.prototype, "fechaHora", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: true, default: null }),
    __metadata("design:type", String)
], QrsEntity.prototype, "lat", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: true, default: null }),
    __metadata("design:type", String)
], QrsEntity.prototype, "lng", void 0);
QrsEntity = QrsEntity_1 = __decorate([
    typeorm_1.Entity('qrs')
], QrsEntity);
exports.QrsEntity = QrsEntity;
//# sourceMappingURL=qrs.entity.js.map