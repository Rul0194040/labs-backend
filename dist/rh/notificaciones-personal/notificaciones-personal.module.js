"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesPersonalModule = void 0;
const common_1 = require("@nestjs/common");
const notificaciones_personal_service_1 = require("./notificaciones-personal.service");
const notificaciones_personal_controller_1 = require("./notificaciones-personal.controller");
let NotificacionesPersonalModule = class NotificacionesPersonalModule {
};
NotificacionesPersonalModule = __decorate([
    common_1.Module({
        providers: [notificaciones_personal_service_1.NotificacionesPersonalService],
        controllers: [notificaciones_personal_controller_1.NotificacionesPersonalController]
    })
], NotificacionesPersonalModule);
exports.NotificacionesPersonalModule = NotificacionesPersonalModule;
//# sourceMappingURL=notificaciones-personal.module.js.map