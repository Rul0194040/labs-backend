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
exports.ProveedorEntity = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let ProveedorEntity = class ProveedorEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 13,
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "rfc", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200,
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 350,
        nullable: true,
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "direccion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], ProveedorEntity.prototype, "contacto", void 0);
ProveedorEntity = __decorate([
    typeorm_1.Entity('proveedores')
], ProveedorEntity);
exports.ProveedorEntity = ProveedorEntity;
//# sourceMappingURL=proveedores.entity.js.map