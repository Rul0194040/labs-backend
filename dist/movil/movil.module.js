"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovilModule = void 0;
const common_1 = require("@nestjs/common");
const movil_controller_1 = require("./movil.controller");
const movil_service_1 = require("./movil.service");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../common/services/mailer/email.service");
const cajas_module_1 = require("../cajas/cajas.module");
const cajas_service_1 = require("../cajas/cajas.service");
let MovilModule = class MovilModule {
};
MovilModule = __decorate([
    common_1.Module({
        imports: [cajas_module_1.CajasModule],
        controllers: [movil_controller_1.MovilController],
        providers: [
            movil_service_1.MovilService,
            sucursalesInsumos_service_1.SucursalesInsumosService,
            notificaciones_service_1.NotificacionesService,
            users_service_1.UsersService,
            email_service_1.MailService,
            cajas_service_1.CajasService,
        ],
    })
], MovilModule);
exports.MovilModule = MovilModule;
//# sourceMappingURL=movil.module.js.map