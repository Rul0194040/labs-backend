"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancosModule = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("./bancos.service");
const cuentas_controller_1 = require("./controllers/cuentas.controller");
const movimientos_controller_1 = require("./controllers/movimientos.controller");
const bancos_controller_1 = require("./controllers/bancos.controller");
const tipos_cuentas_gasto_controller_1 = require("./controllers/tipos-cuentas-gasto.controller");
let BancosModule = class BancosModule {
};
BancosModule = __decorate([
    common_1.Module({
        controllers: [
            bancos_controller_1.BancosController,
            cuentas_controller_1.CuentasController,
            movimientos_controller_1.MovimientosController,
            tipos_cuentas_gasto_controller_1.TiposCuentasGastoController,
        ],
        providers: [bancos_service_1.BancosService],
    })
], BancosModule);
exports.BancosModule = BancosModule;
//# sourceMappingURL=bancos.module.js.map