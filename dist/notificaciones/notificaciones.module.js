"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const notificaciones_service_1 = require("./notificaciones.service");
const notificaciones_controller_1 = require("./notificaciones.controller");
let NotificacionesModule = class NotificacionesModule {
};
NotificacionesModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        providers: [notificaciones_service_1.NotificacionesService, users_service_1.UsersService],
        controllers: [notificaciones_controller_1.NotificacionesController],
    })
], NotificacionesModule);
exports.NotificacionesModule = NotificacionesModule;
//# sourceMappingURL=notificaciones.module.js.map