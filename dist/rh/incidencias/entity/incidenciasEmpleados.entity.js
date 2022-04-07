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
exports.IncidenciaEmpleadoEntity = void 0;
const commonEntity_abstract_1 = require("../../../common/commonEntity.abstract");
const users_entity_1 = require("../../../users/users.entity");
const typeorm_1 = require("typeorm");
const incidencias_entity_1 = require("./incidencias.entity");
let IncidenciaEmpleadoEntity = class IncidenciaEmpleadoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => incidencias_entity_1.IncidenciaEntity, { nullable: false }),
    __metadata("design:type", incidencias_entity_1.IncidenciaEntity)
], IncidenciaEmpleadoEntity.prototype, "incidencia", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], IncidenciaEmpleadoEntity.prototype, "empleado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], IncidenciaEmpleadoEntity.prototype, "montoDescuento", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], IncidenciaEmpleadoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], IncidenciaEmpleadoEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], IncidenciaEmpleadoEntity.prototype, "observaciones", void 0);
IncidenciaEmpleadoEntity = __decorate([
    typeorm_1.Entity('incidenciasEmpleados')
], IncidenciaEmpleadoEntity);
exports.IncidenciaEmpleadoEntity = IncidenciaEmpleadoEntity;
//# sourceMappingURL=incidenciasEmpleados.entity.js.map