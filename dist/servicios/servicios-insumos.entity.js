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
exports.ServiciosInsumosEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const insumo_entity_1 = require("../insumos/insumo.entity");
const typeorm_1 = require("typeorm");
const servicio_entity_1 = require("./servicio.entity");
let ServiciosInsumosEntity = class ServiciosInsumosEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => servicio_entity_1.ServicioEntity, { nullable: false }),
    __metadata("design:type", servicio_entity_1.ServicioEntity)
], ServiciosInsumosEntity.prototype, "servicio", void 0);
__decorate([
    typeorm_1.ManyToOne(() => insumo_entity_1.InsumoEntity, { nullable: false }),
    __metadata("design:type", insumo_entity_1.InsumoEntity)
], ServiciosInsumosEntity.prototype, "insumo", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], ServiciosInsumosEntity.prototype, "cantidad", void 0);
ServiciosInsumosEntity = __decorate([
    typeorm_1.Entity('serviciosInsumos'),
    typeorm_1.Index(['servicio', 'insumo'], { unique: true })
], ServiciosInsumosEntity);
exports.ServiciosInsumosEntity = ServiciosInsumosEntity;
//# sourceMappingURL=servicios-insumos.entity.js.map