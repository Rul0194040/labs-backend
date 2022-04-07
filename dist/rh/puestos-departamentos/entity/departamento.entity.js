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
var DepartamentoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartamentoEntity = void 0;
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let DepartamentoEntity = DepartamentoEntity_1 = class DepartamentoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'tinytext',
        nullable: false,
    }),
    __metadata("design:type", String)
], DepartamentoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.ManyToOne(() => DepartamentoEntity_1, { nullable: true }),
    __metadata("design:type", DepartamentoEntity)
], DepartamentoEntity.prototype, "parent", void 0);
DepartamentoEntity = DepartamentoEntity_1 = __decorate([
    typeorm_1.Entity('departamentos')
], DepartamentoEntity);
exports.DepartamentoEntity = DepartamentoEntity;
//# sourceMappingURL=departamento.entity.js.map