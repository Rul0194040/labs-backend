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
var TipoCuentaGastoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoCuentaGastoEntity = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let TipoCuentaGastoEntity = TipoCuentaGastoEntity_1 = class TipoCuentaGastoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], TipoCuentaGastoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], TipoCuentaGastoEntity.prototype, "clave", void 0);
__decorate([
    typeorm_1.ManyToOne(() => TipoCuentaGastoEntity_1, { nullable: true }),
    __metadata("design:type", TipoCuentaGastoEntity)
], TipoCuentaGastoEntity.prototype, "parent", void 0);
TipoCuentaGastoEntity = TipoCuentaGastoEntity_1 = __decorate([
    typeorm_1.Entity('tiposCuentaGasto')
], TipoCuentaGastoEntity);
exports.TipoCuentaGastoEntity = TipoCuentaGastoEntity;
//# sourceMappingURL=tipos-cuenta-gasto.entity.js.map