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
exports.MovimientoCuentaBanco = void 0;
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
const tipo_movimientos_bancos_enum_1 = require("../tipo-movimientos-bancos.enum");
const cuenta_bancaria_entity_1 = require("./cuenta-bancaria.entity");
let MovimientoCuentaBanco = class MovimientoCuentaBanco extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => cuenta_bancaria_entity_1.CuentaBancariaEntity, { nullable: false }),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], MovimientoCuentaBanco.prototype, "origen", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cuenta_bancaria_entity_1.CuentaBancariaEntity, { nullable: true }),
    __metadata("design:type", cuenta_bancaria_entity_1.CuentaBancariaEntity)
], MovimientoCuentaBanco.prototype, "destino", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], MovimientoCuentaBanco.prototype, "usuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], MovimientoCuentaBanco.prototype, "monto", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], MovimientoCuentaBanco.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinytext' }),
    __metadata("design:type", String)
], MovimientoCuentaBanco.prototype, "referencia", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1,
        default: tipo_movimientos_bancos_enum_1.TipoMovimientosBancos.TRANSFERENCIA,
    }),
    __metadata("design:type", String)
], MovimientoCuentaBanco.prototype, "tipo", void 0);
MovimientoCuentaBanco = __decorate([
    typeorm_1.Entity('movimientosCuentasBancos')
], MovimientoCuentaBanco);
exports.MovimientoCuentaBanco = MovimientoCuentaBanco;
//# sourceMappingURL=movimientos-bancos.entity.js.map