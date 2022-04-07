"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlmacenModule = void 0;
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
const common_1 = require("@nestjs/common");
const almacen_service_1 = require("./almacen.service");
const almacen_controller_1 = require("./almacen.controller");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const users_service_1 = require("../users/users.service");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const compras_service_1 = require("../compras/compras.service");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
let AlmacenModule = class AlmacenModule {
};
AlmacenModule = __decorate([
    common_1.Module({
        imports: [],
        providers: [
            almacen_service_1.AlmacenService,
            sucursales_service_1.SucursalesService,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
            heimdal_service_1.HeimdalService,
            compras_service_1.ComprasService,
            sucursalesInsumos_service_1.SucursalesInsumosService,
        ],
        controllers: [almacen_controller_1.AlmacenController],
        exports: [almacen_service_1.AlmacenService, compras_service_1.ComprasService],
    })
], AlmacenModule);
exports.AlmacenModule = AlmacenModule;
//# sourceMappingURL=almacen.module.js.map