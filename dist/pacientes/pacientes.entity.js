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
exports.PacienteEntity = void 0;
const clientes_entity_1 = require("../clientes/clientes.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const sexoPaciente_enum_1 = require("./sexoPaciente.enum");
const users_entity_1 = require("../users/users.entity");
let PacienteEntity = class PacienteEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => clientes_entity_1.ClienteEntity),
    __metadata("design:type", clientes_entity_1.ClienteEntity)
], PacienteEntity.prototype, "cliente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PacienteEntity.prototype, "clienteId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "apellidoPaterno", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "apellidoMaterno", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PacienteEntity.prototype, "fechaNacimiento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PacienteEntity.prototype, "fechaNac", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        nullable: true,
    }),
    __metadata("design:type", String)
], PacienteEntity.prototype, "sexo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], PacienteEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PacienteEntity.prototype, "usuarioId", void 0);
PacienteEntity = __decorate([
    typeorm_1.Entity('pacientes')
], PacienteEntity);
exports.PacienteEntity = PacienteEntity;
//# sourceMappingURL=pacientes.entity.js.map