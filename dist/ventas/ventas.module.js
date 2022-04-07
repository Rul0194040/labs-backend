"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasModule = void 0;
const compras_service_1 = require("../compras/compras.service");
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
const servicios_service_1 = require("./../servicios/servicios.service");
const common_1 = require("@nestjs/common");
const ventas_controller_1 = require("./ventas.controller");
const ventas_service_1 = require("./ventas.service");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const users_service_1 = require("../users/users.service");
const direcciones_fiscales_module_1 = require("./direcciones-fiscales/direcciones-fiscales.module");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const almacen_service_1 = require("../almacen/almacen.service");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
const muestras_module_1 = require("./muestras/muestras.module");
const email_module_1 = require("../common/services/mailer/email.module");
const email_service_1 = require("../common/services/mailer/email.service");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const axios_1 = require("@nestjs/axios");
let VentasModule = class VentasModule {
};
VentasModule = __decorate([
    common_1.Module({
        imports: [
            direcciones_fiscales_module_1.DireccionesFiscalesModule,
            muestras_module_1.MuestrasModule,
            email_module_1.LocalMailerModule,
            whatsapp_module_1.WhatsappModule,
            axios_1.HttpModule,
        ],
        controllers: [ventas_controller_1.VentasController],
        providers: [
            ventas_service_1.VentasService,
            servicios_service_1.ServiciosService,
            sucursales_service_1.SucursalesService,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
            heimdal_service_1.HeimdalService,
            compras_service_1.ComprasService,
            heimdal_service_1.HeimdalService,
            pxlab_service_1.PxlabService,
            almacen_service_1.AlmacenService,
            sucursalesInsumos_service_1.SucursalesInsumosService,
            email_service_1.MailService,
            whatsapp_service_1.WhatsappService,
        ],
    })
], VentasModule);
exports.VentasModule = VentasModule;
//# sourceMappingURL=ventas.module.js.map