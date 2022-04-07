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
exports.EmpleadosPublicController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const users_service_1 = require("../users/users.service");
const class_transformer_1 = require("class-transformer");
const enable_empleado_dto_1 = require("./dto/enable-empleado.dto");
const empleados_service_1 = require("./empleados.service");
let EmpleadosPublicController = class EmpleadosPublicController {
    constructor(empleadosService, usersService) {
        this.empleadosService = empleadosService;
        this.usersService = usersService;
    }
    async activarCuenta(data) {
        const user = await this.usersService.getByEmail(data.email);
        if (!user) {
            throw new common_1.HttpException('No existe la cuenta', common_1.HttpStatus.NOT_FOUND);
        }
        await this.usersService.statusById(user.id, { active: true });
        return this.usersService.changePassword(class_transformer_1.plainToClass(loginIdentity_dto_1.LoginIdentityDTO, user), 'password', (Math.random() * 10000000).toFixed(0));
    }
};
__decorate([
    common_1.Put('enable-account'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enable_empleado_dto_1.EnableEmpleadoDTO]),
    __metadata("design:returntype", Promise)
], EmpleadosPublicController.prototype, "activarCuenta", null);
EmpleadosPublicController = __decorate([
    common_1.Controller('public/empleados'),
    swagger_1.ApiTags('empleados'),
    __metadata("design:paramtypes", [empleados_service_1.EmpleadosService,
        users_service_1.UsersService])
], EmpleadosPublicController);
exports.EmpleadosPublicController = EmpleadosPublicController;
//# sourceMappingURL=empleados-public.controller.js.map