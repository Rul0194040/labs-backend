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
exports.ContratoEntity = void 0;
const banco_entity_1 = require("../../../bancos/entities/banco.entity");
const cuenta_bancaria_entity_1 = require("../../../bancos/entities/cuenta-bancaria.entity");
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const esquema_pago_entity_1 = require("../../esquema-pago.entity");
const jornada_entity_1 = require("../../jornada.entity");
const puesto_entity_1 = require("../../puestos-departamentos/entity/puesto.entity");
const sucursal_entity_1 = require("../../../sucursales/sucursal.entity");
const users_entity_1 = require("../../../users/users.entity");
const typeorm_1 = require("typeorm");
let ContratoEntity = class ContratoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], ContratoEntity.prototype, "empleado", void 0);
__decorate([
    typeorm_1.ManyToOne(() => puesto_entity_1.PuestoEntity, { nullable: false }),
    __metadata("design:type", puesto_entity_1.PuestoEntity)
], ContratoEntity.prototype, "puesto", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], ContratoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ContratoEntity.prototype, "numero", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], ContratoEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.ManyToOne(() => esquema_pago_entity_1.EsquemaPagoEntity, { nullable: false }),
    __metadata("design:type", esquema_pago_entity_1.EsquemaPagoEntity)
], ContratoEntity.prototype, "esquemaPago", void 0);
__decorate([
    typeorm_1.ManyToOne(() => jornada_entity_1.JornadaEntity, { nullable: false }),
    __metadata("design:type", jornada_entity_1.JornadaEntity)
], ContratoEntity.prototype, "jornada", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cuenta_bancaria_entity_1.CuentaBancariaEntity, { nullable: false }),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], ContratoEntity.prototype, "cuentaPago", void 0);
__decorate([
    typeorm_1.ManyToOne(() => banco_entity_1.BancoEntity, { nullable: true }),
    __metadata("design:type", banco_entity_1.BancoEntity)
], ContratoEntity.prototype, "cuentaDepositoBanco", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 100 }),
    __metadata("design:type", String)
], ContratoEntity.prototype, "cuentaDepositoCuenta", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], ContratoEntity.prototype, "sueldoReal", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], ContratoEntity.prototype, "sueldoContratado", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], ContratoEntity.prototype, "fondoAhorro", void 0);
ContratoEntity = __decorate([
    typeorm_1.Entity('contratos')
], ContratoEntity);
exports.ContratoEntity = ContratoEntity;
//# sourceMappingURL=contrato.entity.js.map