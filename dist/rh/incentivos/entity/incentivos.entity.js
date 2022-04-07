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
exports.IncentivoEntity = void 0;
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const unidades_descuento_enum_1 = require("../../unidades-descuento.enum");
const typeorm_1 = require("typeorm");
let IncentivoEntity = class IncentivoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'tinytext',
        nullable: false,
    }),
    __metadata("design:type", String)
], IncentivoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 1,
    }),
    __metadata("design:type", Number)
], IncentivoEntity.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        default: unidades_descuento_enum_1.UnidadesDescuento.DIAS,
    }),
    __metadata("design:type", String)
], IncentivoEntity.prototype, "unidad", void 0);
IncentivoEntity = __decorate([
    typeorm_1.Entity('incentivos')
], IncentivoEntity);
exports.IncentivoEntity = IncentivoEntity;
//# sourceMappingURL=incentivos.entity.js.map