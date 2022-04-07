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
exports.IncentivoEmpleadoEntity = void 0;
const users_entity_1 = require("../../../users/users.entity");
const typeorm_1 = require("typeorm");
const incentivos_entity_1 = require("./incentivos.entity");
let IncentivoEmpleadoEntity = class IncentivoEmpleadoEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IncentivoEmpleadoEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => incentivos_entity_1.IncentivoEntity, { nullable: false }),
    __metadata("design:type", incentivos_entity_1.IncentivoEntity)
], IncentivoEmpleadoEntity.prototype, "incentivo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], IncentivoEmpleadoEntity.prototype, "empleado", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], IncentivoEmpleadoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], IncentivoEmpleadoEntity.prototype, "montoIncentivo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], IncentivoEmpleadoEntity.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', nullable: true }),
    __metadata("design:type", String)
], IncentivoEmpleadoEntity.prototype, "observaciones", void 0);
IncentivoEmpleadoEntity = __decorate([
    typeorm_1.Entity('incentivosEmpleados')
], IncentivoEmpleadoEntity);
exports.IncentivoEmpleadoEntity = IncentivoEmpleadoEntity;
//# sourceMappingURL=incentivos-empleados.entity.js.map