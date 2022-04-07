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
exports.IncidenciaEntity = void 0;
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const unidades_descuento_enum_1 = require("../../unidades-descuento.enum");
let IncidenciaEntity = class IncidenciaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'tinytext',
        nullable: false,
    }),
    __metadata("design:type", String)
], IncidenciaEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 1,
    }),
    __metadata("design:type", Number)
], IncidenciaEntity.prototype, "requeridas", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 1,
    }),
    __metadata("design:type", Number)
], IncidenciaEntity.prototype, "descuento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        default: unidades_descuento_enum_1.UnidadesDescuento.DIAS,
    }),
    __metadata("design:type", String)
], IncidenciaEntity.prototype, "unidadDescuento", void 0);
IncidenciaEntity = __decorate([
    typeorm_1.Entity('incidencias')
], IncidenciaEntity);
exports.IncidenciaEntity = IncidenciaEntity;
//# sourceMappingURL=incidencias.entity.js.map