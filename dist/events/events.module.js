"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../common/services/mailer/email.service");
const empleados_module_1 = require("../empleados/empleados.module");
const qrs_service_1 = require("../empleados/qrs/qrs.service");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
const sucursales_module_1 = require("../sucursales/sucursales.module");
const users_service_1 = require("../users/users.service");
const events_gateway_1 = require("./events.gateway");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    common_1.Module({
        imports: [sucursales_module_1.SucursalesModule, empleados_module_1.EmpleadosModule],
        providers: [
            events_gateway_1.EventsGateway,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
            email_service_1.MailService,
            sucursales_service_1.SucursalesService,
            qrs_service_1.QrsService,
        ],
        exports: [events_gateway_1.EventsGateway],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map