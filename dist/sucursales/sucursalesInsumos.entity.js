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
exports.SucursalesInsumosEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const insumo_entity_1 = require("../insumos/insumo.entity");
const lotes_entity_1 = require("../lotes/lotes.entity");
const typeorm_1 = require("typeorm");
const sucursal_entity_1 = require("./sucursal.entity");
let SucursalesInsumosEntity = class SucursalesInsumosEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], SucursalesInsumosEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.ManyToOne(() => insumo_entity_1.InsumoEntity, { nullable: false }),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], SucursalesInsumosEntity.prototype, "insumo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => lotes_entity_1.LoteEntity, { nullable: true }),
    __metadata("design:type", lotes_entity_1.LoteEntity)
], SucursalesInsumosEntity.prototype, "lote", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], SucursalesInsumosEntity.prototype, "existencia", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], SucursalesInsumosEntity.prototype, "promedio", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], SucursalesInsumosEntity.prototype, "minimo", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], SucursalesInsumosEntity.prototype, "maximo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], SucursalesInsumosEntity.prototype, "ubicacion", void 0);
SucursalesInsumosEntity = __decorate([
    typeorm_1.Entity('sucursalesInsumos'),
    typeorm_1.Index(['sucursal', 'insumo', 'lote'], { unique: true })
], SucursalesInsumosEntity);
exports.SucursalesInsumosEntity = SucursalesInsumosEntity;
//# sourceMappingURL=sucursalesInsumos.entity.js.map