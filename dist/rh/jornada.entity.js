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
exports.JornadaEntity = void 0;
const tipos_cuenta_gasto_entity_1 = require("../bancos/entities/tipos-cuenta-gasto.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let JornadaEntity = class JornadaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: false, length: 100 }),
    __metadata("design:type", String)
], JornadaEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity)
], JornadaEntity.prototype, "horas", void 0);
JornadaEntity = __decorate([
    typeorm_1.Entity('jornadas')
], JornadaEntity);
exports.JornadaEntity = JornadaEntity;
//# sourceMappingURL=jornada.entity.js.map