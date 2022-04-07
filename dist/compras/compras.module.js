"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const email_service_1 = require("../common/services/mailer/email.service");
const compras_controller_1 = require("./compras.controller");
const compras_service_1 = require("./compras.service");
const almacen_service_1 = require("../almacen/almacen.service");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
const almacen_module_1 = require("../almacen/almacen.module");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const users_service_1 = require("../users/users.service");
let ComprasModule = class ComprasModule {
};
ComprasModule = __decorate([
    common_1.Module({
        imports: [almacen_module_1.AlmacenModule],
        controllers: [compras_controller_1.ComprasController],
        providers: [
            compras_service_1.ComprasService,
            heimdal_service_1.HeimdalService,
            config_1.ConfigService,
            email_service_1.MailService,
            compras_service_1.ComprasService,
            almacen_service_1.AlmacenService,
            sucursales_service_1.SucursalesService,
            sucursalesInsumos_service_1.SucursalesInsumosService,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
        ],
    })
], ComprasModule);
exports.ComprasModule = ComprasModule;
//# sourceMappingURL=compras.module.js.map