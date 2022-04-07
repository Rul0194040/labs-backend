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
exports.DocumentoEmpleadoEntity = void 0;
const users_entity_1 = require("../../../users/users.entity");
const typeorm_1 = require("typeorm");
const documento_entity_1 = require("./documento.entity");
let DocumentoEmpleadoEntity = class DocumentoEmpleadoEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DocumentoEmpleadoEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => documento_entity_1.DocumentoEntity, { nullable: false }),
    __metadata("design:type", documento_entity_1.DocumentoEntity)
], DocumentoEmpleadoEntity.prototype, "documento", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], DocumentoEmpleadoEntity.prototype, "empleado", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], DocumentoEmpleadoEntity.prototype, "file", void 0);
DocumentoEmpleadoEntity = __decorate([
    typeorm_1.Entity('documentosEmpleados')
], DocumentoEmpleadoEntity);
exports.DocumentoEmpleadoEntity = DocumentoEmpleadoEntity;
//# sourceMappingURL=documentos-empleados.entity.js.map