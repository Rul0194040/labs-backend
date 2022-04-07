"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresupuestosModule = void 0;
const email_service_1 = require("../common/services/mailer/email.service");
const config_1 = require("@nestjs/config");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const common_1 = require("@nestjs/common");
const presupuestos_controller_1 = require("./presupuestos.controller");
const presupuestos_service_1 = require("./presupuestos.service");
let PresupuestosModule = class PresupuestosModule {
};
PresupuestosModule = __decorate([
    common_1.Module({
        controllers: [presupuestos_controller_1.PresupuestosController],
        providers: [presupuestos_service_1.PresupuestosService, heimdal_service_1.HeimdalService, config_1.ConfigService, email_service_1.MailService],
    })
], PresupuestosModule);
exports.PresupuestosModule = PresupuestosModule;
//# sourceMappingURL=presupuestos.module.js.map