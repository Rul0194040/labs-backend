"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const profiles_enum_1 = require("../users/profiles.enum");
const require_profiles_decorator_1 = require("../users/decorators/require-profiles.decorator");
const user_decorator_1 = require("../users/decorators/user.decorator");
const users_entity_1 = require("../users/users.entity");
const notificaciones_service_1 = require("./notificaciones.service");
let NotificacionesController = class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    async misNotificaciones(usuario) {
        return this.notificacionesService.misNotificaciones(usuario);
    }
};
__decorate([
    common_1.Get(''),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "misNotificaciones", null);
NotificacionesController = __decorate([
    swagger_1.ApiTags('notificaciones'),
    common_1.Controller('notificaciones'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN, profiles_enum_1.ProfileTypes.SUCURSAL, profiles_enum_1.ProfileTypes.ALMACEN_GENERAL, profiles_enum_1.ProfileTypes.SUPER),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
exports.NotificacionesController = NotificacionesController;
//# sourceMappingURL=notificaciones.controller.js.map