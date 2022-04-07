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
exports.ClienteEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const tipos_convenios_enum_1 = require("../common/enum/tipos-convenios.enum");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
let ClienteEntity = class ClienteEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "tipoPersona", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], ClienteEntity.prototype, "diasCredito", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], ClienteEntity.prototype, "descuento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        default: tipos_convenios_enum_1.TiposConvenios.EMPLEADO,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "tipoConvenio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "codigo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "cuentaPxLab", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], ClienteEntity.prototype, "fechaNacimiento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], ClienteEntity.prototype, "fechaNac", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], ClienteEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ClienteEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ClienteEntity.prototype, "stripeId", void 0);
ClienteEntity = __decorate([
    typeorm_1.Entity('clientes')
], ClienteEntity);
exports.ClienteEntity = ClienteEntity;
//# sourceMappingURL=clientes.entity.js.map