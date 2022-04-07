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
exports.CajaEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const origenEntrega_dto_1 = require("./DTO/origenEntrega.dto");
const cortesTesorero_entity_1 = require("../tesoreros/cortesTesorero/cortesTesorero.entity");
let CajaEntity = class CajaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], CajaEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "sucursalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], CajaEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cortesTesorero_entity_1.CorteTesoreroEntity, { nullable: true }),
    __metadata("design:type", cortesTesorero_entity_1.CorteTesoreroEntity)
], CajaEntity.prototype, "corteTesorero", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "corteTesoreroId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "faltante", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "montoApertura", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], CajaEntity.prototype, "fechaApertura", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], CajaEntity.prototype, "fechaCierre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "notas", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        default: null,
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "observacionTesorero", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        default: '',
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "transferencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "tarjeta", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "cheque", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "credito", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn05", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn1", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn2", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn5", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn10", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn20", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn50", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn100", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn200", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn500", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "mxn1000", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "arqTransferencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "arqTarjeta", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "arqCheque", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "arqCredito", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], CajaEntity.prototype, "totalArqueo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "notasArqueo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "origenEntrega", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "referencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], CajaEntity.prototype, "recibio", void 0);
CajaEntity = __decorate([
    typeorm_1.Entity('cajas')
], CajaEntity);
exports.CajaEntity = CajaEntity;
//# sourceMappingURL=cajas.entity.js.map