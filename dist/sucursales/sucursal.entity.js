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
exports.SucursalEntity = void 0;
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const users_entity_1 = require("../users/users.entity");
const zona_enum_1 = require("./zona.enum");
const api_keys_entity_1 = require("./api-keys.entity");
let SucursalEntity = class SucursalEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "calle", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 15,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "numExt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "colonia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], SucursalEntity.prototype, "cp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "municipio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], SucursalEntity.prototype, "esMatriz", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], SucursalEntity.prototype, "esLaboratorio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], SucursalEntity.prototype, "esForanea", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "lat", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "lng", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 15,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "responsable", void 0);
__decorate([
    typeorm_1.OneToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", users_entity_1.UsersEntity)
], SucursalEntity.prototype, "userResponsable", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], SucursalEntity.prototype, "puedeHacerRequisicion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], SucursalEntity.prototype, "zona", void 0);
__decorate([
    typeorm_1.OneToMany(() => api_keys_entity_1.ApiKeyEntity, (key) => key.sucursal),
    __metadata("design:type", Array)
], SucursalEntity.prototype, "apikeys", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], SucursalEntity.prototype, "seleccionarZona", void 0);
__decorate([
    typeorm_1.OneToMany(() => users_entity_1.UsersEntity, (user) => user.sucursal),
    __metadata("design:type", users_entity_1.UsersEntity)
], SucursalEntity.prototype, "usuarios", void 0);
SucursalEntity = __decorate([
    typeorm_1.Entity('sucursales')
], SucursalEntity);
exports.SucursalEntity = SucursalEntity;
//# sourceMappingURL=sucursal.entity.js.map