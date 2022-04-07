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
exports.ServicioEntity = void 0;
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const grupo_servicio_entity_1 = require("../catalogos/grupos-servicios/grupo-servicio.entity");
const tipos_muestras_entity_1 = require("../catalogos/tipos-muestras/tipos-muestras.entity");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
let ServicioEntity = class ServicioEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 1,
        nullable: false,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "muestrasRequeridas", void 0);
__decorate([
    typeorm_1.Column({
        name: 'clave',
        type: 'varchar',
        unique: true,
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "clave", void 0);
__decorate([
    typeorm_1.Column({
        name: 'nombre',
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        name: 'sinonimo1',
        type: 'varchar',
        length: 80,
        nullable: true,
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "sinonimo1", void 0);
__decorate([
    typeorm_1.Column({
        name: 'sinonimo2',
        type: 'varchar',
        length: 80,
        nullable: true,
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "sinonimo2", void 0);
__decorate([
    typeorm_1.Column({
        name: 'tiempo',
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "tiempo", void 0);
__decorate([
    typeorm_1.Column({
        name: 'precio',
        type: 'float',
        scale: 2,
        precision: 12,
        nullable: false,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        scale: 2,
        precision: 12,
        default: 0,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "precio2", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        scale: 2,
        precision: 12,
        default: 0,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "precio3", void 0);
__decorate([
    typeorm_1.Column({
        name: 'maquila',
        type: 'float',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "precioMaquila", void 0);
__decorate([
    typeorm_1.Column({
        name: 'factor',
        type: 'float',
        nullable: true,
    }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "factor", void 0);
__decorate([
    typeorm_1.Column({
        name: 'recomendaciones',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "recomendaciones", void 0);
__decorate([
    typeorm_1.Column({
        name: 'realizaEstudioEn',
        type: 'varchar',
        length: 20,
        nullable: false,
        default: 'SUCURSAL',
    }),
    __metadata("design:type", String)
], ServicioEntity.prototype, "realizaEstudioEn", void 0);
__decorate([
    typeorm_1.ManyToOne(() => grupo_servicio_entity_1.GrupoServicioEntity),
    __metadata("design:type", grupo_servicio_entity_1.GrupoServicioEntity)
], ServicioEntity.prototype, "grupoServicio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "grupoServicioId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_muestras_entity_1.TipoMuestraEntity),
    __metadata("design:type", tipos_muestras_entity_1.TipoMuestraEntity)
], ServicioEntity.prototype, "tipoMuestra", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "tipoMuestraId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_unidades_entity_1.TipoUnidadEntity),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], ServicioEntity.prototype, "tipoUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ServicioEntity.prototype, "tipoUnidadId", void 0);
ServicioEntity = __decorate([
    typeorm_1.Entity('servicios')
], ServicioEntity);
exports.ServicioEntity = ServicioEntity;
//# sourceMappingURL=servicio.entity.js.map