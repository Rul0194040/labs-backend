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
exports.CuentaBancariaEntity = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const banco_entity_1 = require("./banco.entity");
let CuentaBancariaEntity = class CuentaBancariaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'tinytext',
        nullable: false,
    }),
    __metadata("design:type", String)
], CuentaBancariaEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: false,
    }),
    __metadata("design:type", Number)
], CuentaBancariaEntity.prototype, "saldo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => banco_entity_1.BancoEntity, { nullable: false }),
    __metadata("design:type", banco_entity_1.BancoEntity)
], CuentaBancariaEntity.prototype, "banco", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], CuentaBancariaEntity.prototype, "numeroCuenta", void 0);
CuentaBancariaEntity = __decorate([
    typeorm_1.Entity('cuentasBancarias')
], CuentaBancariaEntity);
exports.CuentaBancariaEntity = CuentaBancariaEntity;
//# sourceMappingURL=cuenta-bancaria.entity.js.map