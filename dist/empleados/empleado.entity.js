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
exports.EmpleadoEntity = void 0;
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
let EmpleadoEntity = class EmpleadoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "apellidoPaterno", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "apellidoMaterno", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", Number)
], EmpleadoEntity.prototype, "curp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], EmpleadoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], EmpleadoEntity.prototype, "tipoSanguineo", void 0);
EmpleadoEntity = __decorate([
    typeorm_1.Entity('empleados')
], EmpleadoEntity);
exports.EmpleadoEntity = EmpleadoEntity;
//# sourceMappingURL=empleado.entity.js.map