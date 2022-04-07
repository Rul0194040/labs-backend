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
exports.FacturaEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const ventas_entity_1 = require("../ventas/ventas.entity");
let FacturaEntity = class FacturaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.OneToOne(() => ventas_entity_1.VentaEntity, { nullable: true }),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], FacturaEntity.prototype, "venta", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], FacturaEntity.prototype, "ventaId", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "contribuyente", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1, default: 'F' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "persona", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "rfc", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "calle", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "numInt", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', default: null }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "numExt", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext', default: null }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "colonia", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "cp", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "estado", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "municipio", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "pais", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "xml", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "pdf", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FacturaEntity.prototype, "descargado", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', default: null }),
    __metadata("design:type", Date)
], FacturaEntity.prototype, "fechaDescargado", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "ipDescargado", void 0);
FacturaEntity = __decorate([
    typeorm_1.Entity('facturas')
], FacturaEntity);
exports.FacturaEntity = FacturaEntity;
//# sourceMappingURL=facturas.entity.js.map