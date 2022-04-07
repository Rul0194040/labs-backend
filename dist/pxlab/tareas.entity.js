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
exports.TareasEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
const tareas_estatus_enum_1 = require("./tareas-estatus.enum");
let TareasEntity = class TareasEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], TareasEntity.prototype, "event", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TareasEntity.prototype, "channel", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", Object)
], TareasEntity.prototype, "data", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], TareasEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], TareasEntity.prototype, "sucursalId", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TareasEntity.prototype, "status", void 0);
TareasEntity = __decorate([
    typeorm_1.Entity('tareas')
], TareasEntity);
exports.TareasEntity = TareasEntity;
//# sourceMappingURL=tareas.entity.js.map