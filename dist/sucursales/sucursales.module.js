"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucursalesModule = void 0;
const heimdal_service_1 = require("./../common/heimdal/heimdal.service");
const common_1 = require("@nestjs/common");
const sucursales_controller_1 = require("./sucursales.controller");
const sucursales_service_1 = require("./services/sucursales.service");
const almacen_module_1 = require("../almacen/almacen.module");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const users_service_1 = require("../users/users.service");
const sucursalesInsumos_service_1 = require("./services/sucursalesInsumos.service");
const sucursalesPublic_controller_1 = require("./sucursalesPublic.controller");
let SucursalesModule = class SucursalesModule {
};
SucursalesModule = __decorate([
    common_1.Module({
        imports: [almacen_module_1.AlmacenModule],
        controllers: [sucursales_controller_1.SucursalesController, sucursalesPublic_controller_1.SucursalesPublicController],
        providers: [
            sucursales_service_1.SucursalesService,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
            sucursalesInsumos_service_1.SucursalesInsumosService,
            heimdal_service_1.HeimdalService,
        ],
    })
], SucursalesModule);
exports.SucursalesModule = SucursalesModule;
//# sourceMappingURL=sucursales.module.js.map