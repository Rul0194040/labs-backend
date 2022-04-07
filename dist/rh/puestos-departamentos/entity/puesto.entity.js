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
var PuestoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuestoEntity = void 0;
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const departamento_entity_1 = require("./departamento.entity");
let PuestoEntity = PuestoEntity_1 = class PuestoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'tinytext',
        nullable: false,
    }),
    __metadata("design:type", String)
], PuestoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.ManyToOne(() => PuestoEntity_1, { nullable: true }),
    __metadata("design:type", PuestoEntity)
], PuestoEntity.prototype, "puestoJefe", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PuestoEntity.prototype, "sueldoMensual", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 1,
    }),
    __metadata("design:type", Number)
], PuestoEntity.prototype, "plazasDisponibles", void 0);
__decorate([
    typeorm_1.ManyToOne(() => departamento_entity_1.DepartamentoEntity, { nullable: true }),
    __metadata("design:type", departamento_entity_1.DepartamentoEntity)
], PuestoEntity.prototype, "departamento", void 0);
PuestoEntity = PuestoEntity_1 = __decorate([
    typeorm_1.Entity('puestos')
], PuestoEntity);
exports.PuestoEntity = PuestoEntity;
//# sourceMappingURL=puesto.entity.js.map