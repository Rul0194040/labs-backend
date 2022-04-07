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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const local_auth_guard_1 = require("./guards/local/local-auth.guard");
const nestjs_rate_limiter_1 = require("nestjs-rate-limiter");
const users_service_1 = require("../users/users.service");
const loginEmailData_dto_1 = require("./dto/loginEmailData.dto");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(body, req) {
        return this.authService.login(req.user, body.rememberme, body.device, body.sucursalId);
    }
    optionsLogin() {
        return '';
    }
    async getLoginData(data) {
        return this.authService.cajasCajero(data.email.toLowerCase());
    }
    getLoginDataOptions() {
        return '';
    }
    passwordReset(email) {
        return this.usersService.startPasswordReset(email);
    }
    async getPasswordToken(token, newPassword, email) {
        return this.usersService.changePasswordByToken(email, token, newPassword);
    }
};
__decorate([
    swagger_1.ApiOperation({
        summary: 'Inicio de sesión, no debe permitir inicio de usuarios inactivos.',
    }),
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('login'),
    nestjs_rate_limiter_1.RateLimit({
        keyPrefix: 'login',
        points: 5,
        duration: 60,
        errorMessage: 'Solo puede intentar 5 veces en 5 minutos máximo.',
    }),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Options('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "optionsLogin", null);
__decorate([
    common_1.Post('login/email'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginEmailData_dto_1.LoginEmailDataDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getLoginData", null);
__decorate([
    common_1.Options('login/email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getLoginDataOptions", null);
__decorate([
    common_1.Put('password-reset'),
    __param(0, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "passwordReset", null);
__decorate([
    common_1.Put('password-reset/:token'),
    __param(0, common_1.Param('token')),
    __param(1, common_1.Body('password')),
    __param(2, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPasswordToken", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map