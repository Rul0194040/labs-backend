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
exports.IngresoSucursalEntity = void 0;
const pacientes_entity_1 = require("./../../pacientes/pacientes.entity");
const banco_entity_1 = require("../../bancos/entities/banco.entity");
const cajas_entity_1 = require("../../cajas/cajas.entity");
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const sucursal_entity_1 = require("../../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
let IngresoSucursalEntity = class IngresoSucursalEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], IngresoSucursalEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "sucursalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cajas_entity_1.CajaEntity, { nullable: false }),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], IngresoSucursalEntity.prototype, "caja", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "cajaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => banco_entity_1.BancoEntity, { nullable: false }),
    __metadata("design:type", banco_entity_1.BancoEntity)
], IngresoSucursalEntity.prototype, "banco", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "bancoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => pacientes_entity_1.PacienteEntity, { nullable: true }),
    __metadata("design:type", pacientes_entity_1.PacienteEntity)
], IngresoSucursalEntity.prototype, "paciente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "pacienteId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], IngresoSucursalEntity.prototype, "estudioPxLab", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "ingreso", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", Number)
], IngresoSucursalEntity.prototype, "gasto", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], IngresoSucursalEntity.prototype, "vaucher", void 0);
IngresoSucursalEntity = __decorate([
    typeorm_1.Entity('ingresos-sucursales')
], IngresoSucursalEntity);
exports.IngresoSucursalEntity = IngresoSucursalEntity;
//# sourceMappingURL=ingresos-sucursal.entity.js.map