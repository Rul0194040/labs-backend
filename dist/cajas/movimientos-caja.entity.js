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
exports.MovimientoCajaEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const tiposMovimientoCaja_enum_1 = require("../common/enum/tiposMovimientoCaja.enum");
const pagos_entity_1 = require("../pagos/pagos.entity");
const typeorm_1 = require("typeorm");
const cajas_entity_1 = require("./cajas.entity");
const estatusMovimiento_enum_1 = require("./estatusMovimiento.enum");
let MovimientoCajaEntity = class MovimientoCajaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => cajas_entity_1.CajaEntity, { nullable: false }),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], MovimientoCajaEntity.prototype, "caja", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MovimientoCajaEntity.prototype, "cajaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => pagos_entity_1.PagoEntity, { nullable: true }),
    __metadata("design:type", pagos_entity_1.PagoEntity)
], MovimientoCajaEntity.prototype, "pago", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MovimientoCajaEntity.prototype, "pagoId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], MovimientoCajaEntity.prototype, "monto", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1,
        nullable: false,
        default: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.APERTURA,
    }),
    __metadata("design:type", String)
], MovimientoCajaEntity.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], MovimientoCajaEntity.prototype, "notas", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", Number)
], MovimientoCajaEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], MovimientoCajaEntity.prototype, "estatusMovimiento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], MovimientoCajaEntity.prototype, "motivoCancelacion", void 0);
MovimientoCajaEntity = __decorate([
    typeorm_1.Entity('movimientoscaja')
], MovimientoCajaEntity);
exports.MovimientoCajaEntity = MovimientoCajaEntity;
//# sourceMappingURL=movimientos-caja.entity.js.map