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
exports.InsumoEntity = void 0;
const tipo_insumo_entity_1 = require("../catalogos/tipos-insumos/tipo-insumo.entity");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const DescuentaEn_enum_1 = require("./DescuentaEn.enum");
let InsumoEntity = class InsumoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        name: 'nombre',
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], InsumoEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        name: 'descripcion',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], InsumoEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({
        name: 'codigo',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], InsumoEntity.prototype, "codigo", void 0);
__decorate([
    typeorm_1.Column({
        name: 'clave',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], InsumoEntity.prototype, "clave", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipo_insumo_entity_1.TipoInsumoEntity),
    __metadata("design:type", tipo_insumo_entity_1.TipoInsumoEntity)
], InsumoEntity.prototype, "tipoInsumo", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], InsumoEntity.prototype, "tipoInsumoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tipos_unidades_entity_1.TipoUnidadEntity),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], InsumoEntity.prototype, "tipoUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], InsumoEntity.prototype, "tipoUnidadId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        nullable: false,
        default: DescuentaEn_enum_1.DescuentaEn.SUCURSAL,
    }),
    __metadata("design:type", String)
], InsumoEntity.prototype, "descuentaEn", void 0);
InsumoEntity = __decorate([
    typeorm_1.Entity('insumos')
], InsumoEntity);
exports.InsumoEntity = InsumoEntity;
//# sourceMappingURL=insumo.entity.js.map