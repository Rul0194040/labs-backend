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
exports.UsersEntity = void 0;
const puesto_entity_1 = require("./../rh/puestos-departamentos/entity/puesto.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const image_entity_1 = require("../images/model/image.entity");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
const profiles_enum_1 = require("./profiles.enum");
let UsersEntity = class UsersEntity extends commonEntity_abstract_1.CommonEntity {
    constructor(email, firstName, lastName, profile, password, rules, active, nip, maxDescuento) {
        super();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profile = profile;
        this.password = password;
        this.active = active;
        this.rules = rules;
        this.nip = nip;
        this.maxDescuento = maxDescuento;
    }
};
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "passwordToken", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], UsersEntity.prototype, "passwordTokenDate", void 0);
__decorate([
    typeorm_1.Column({
        unique: true,
        type: 'varchar',
        name: 'email',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: false,
        select: false,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        default: profiles_enum_1.ProfileTypes.SYSADMIN,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "profile", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        default: profiles_enum_1.PerfilTipoEmpleado.GENERAL,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "tipoEmpleado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], UsersEntity.prototype, "validEmail", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], UsersEntity.prototype, "accesoSistema", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "emailToken", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-array',
        nullable: true,
    }),
    __metadata("design:type", Array)
], UsersEntity.prototype, "rules", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 250,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "picUrl", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 15,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], UsersEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.ManyToMany(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", Array)
], UsersEntity.prototype, "sucursalesPermitidas", void 0);
__decorate([
    typeorm_1.OneToOne(() => image_entity_1.ImageEntity, (image) => image.avatar),
    __metadata("design:type", image_entity_1.ImageEntity)
], UsersEntity.prototype, "image", void 0);
__decorate([
    typeorm_1.OneToOne(() => puesto_entity_1.PuestoEntity, () => puesto_entity_1.PuestoEntity),
    __metadata("design:type", puesto_entity_1.PuestoEntity)
], UsersEntity.prototype, "puesto", void 0);
__decorate([
    typeorm_1.Column({ type: 'json', default: null }),
    __metadata("design:type", Object)
], UsersEntity.prototype, "device", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', default: null }),
    __metadata("design:type", String)
], UsersEntity.prototype, "jwt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 6,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "nip", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 6,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "tipoSanguineo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", Number)
], UsersEntity.prototype, "maxDescuento", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], UsersEntity.prototype, "fechaNac", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 18,
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersEntity.prototype, "curp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], UsersEntity.prototype, "grabandoRules", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", Number)
], UsersEntity.prototype, "comisionVendedor", void 0);
UsersEntity = __decorate([
    typeorm_1.Entity('users'),
    __metadata("design:paramtypes", [String, String, String, String, String, Array, Boolean, String, Number])
], UsersEntity);
exports.UsersEntity = UsersEntity;
//# sourceMappingURL=users.entity.js.map