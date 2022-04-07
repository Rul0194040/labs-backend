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
exports.DireccionFiscalEntity = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const pacientes_entity_1 = require("../../pacientes/pacientes.entity");
const clientes_entity_1 = require("../../clientes/clientes.entity");
let DireccionFiscalEntity = class DireccionFiscalEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => pacientes_entity_1.PacienteEntity, { nullable: true }),
    __metadata("design:type", pacientes_entity_1.PacienteEntity)
], DireccionFiscalEntity.prototype, "paciente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DireccionFiscalEntity.prototype, "pacienteId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => clientes_entity_1.ClienteEntity, { nullable: true }),
    __metadata("design:type", clientes_entity_1.ClienteEntity)
], DireccionFiscalEntity.prototype, "cliente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DireccionFiscalEntity.prototype, "clienteId", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "contribuyente", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "rfc", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "calle", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "numInt", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "numExt", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "colonia", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "cp", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "estado", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "municipio", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], DireccionFiscalEntity.prototype, "pais", void 0);
DireccionFiscalEntity = __decorate([
    typeorm_1.Entity('direccionesFiscales')
], DireccionFiscalEntity);
exports.DireccionFiscalEntity = DireccionFiscalEntity;
//# sourceMappingURL=direccionesFiscales.entity.js.map