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
exports.PagoEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const ventas_entity_1 = require("../ventas/ventas.entity");
const cajas_entity_1 = require("../cajas/cajas.entity");
const tipoPagos_enum_1 = require("./tipoPagos.enum");
let PagoEntity = class PagoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => ventas_entity_1.VentaEntity),
    __metadata("design:type", ventas_entity_1.VentaEntity)
], PagoEntity.prototype, "venta", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "ventaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cajas_entity_1.CajaEntity, { nullable: true }),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], PagoEntity.prototype, "caja", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "cajaId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        default: tipoPagos_enum_1.TiposPago.EFECTIVO,
    }),
    __metadata("design:type", String)
], PagoEntity.prototype, "tipo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
    }),
    __metadata("design:type", String)
], PagoEntity.prototype, "referencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], PagoEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        nullable: false,
    }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "monto", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "efectivoRecibido", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], PagoEntity.prototype, "cambio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], PagoEntity.prototype, "cobranza", void 0);
PagoEntity = __decorate([
    typeorm_1.Entity('pagos')
], PagoEntity);
exports.PagoEntity = PagoEntity;
//# sourceMappingURL=pagos.entity.js.map