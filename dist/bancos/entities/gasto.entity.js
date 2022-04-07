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
exports.GastoEntity = void 0;
const cajas_entity_1 = require("../../cajas/cajas.entity");
const proveedores_entity_1 = require("../../catalogos/proveedores/proveedores.entity");
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const compras_entity_1 = require("../../compras/compras.entity");
const sucursal_entity_1 = require("../../sucursales/sucursal.entity");
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
const cuenta_bancaria_entity_1 = require("./cuenta-bancaria.entity");
const tipos_cuenta_gasto_entity_1 = require("./tipos-cuenta-gasto.entity");
let GastoEntity = class GastoEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity, { nullable: false }),
    __metadata("design:type", tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity)
], GastoEntity.prototype, "tipoCuenta", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], GastoEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cajas_entity_1.CajaEntity, { nullable: true }),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], GastoEntity.prototype, "caja", void 0);
__decorate([
    typeorm_1.ManyToOne(() => proveedores_entity_1.ProveedorEntity, { nullable: true }),
    __metadata("design:type", proveedores_entity_1.ProveedorEntity)
], GastoEntity.prototype, "proveedor", void 0);
__decorate([
    typeorm_1.ManyToOne(() => compras_entity_1.CompraEntity, { nullable: true }),
    __metadata("design:type", compras_entity_1.CompraEntity)
], GastoEntity.prototype, "compra", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], GastoEntity.prototype, "documento", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], GastoEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], GastoEntity.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cuenta_bancaria_entity_1.CuentaBancariaEntity, { nullable: true }),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], GastoEntity.prototype, "cuentaBanco", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], GastoEntity.prototype, "fechaGasto", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], GastoEntity.prototype, "referencia", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], GastoEntity.prototype, "monto", void 0);
GastoEntity = __decorate([
    typeorm_1.Entity('gastos')
], GastoEntity);
exports.GastoEntity = GastoEntity;
//# sourceMappingURL=gasto.entity.js.map