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
exports.EmpleadosController = void 0;
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const user_decorator_1 = require("../users/decorators/user.decorator");
const users_entity_1 = require("../users/users.entity");
const create_empleado_dto_1 = require("./DTO/create-empleado.dto");
const update_empleado_dto_1 = require("./DTO/update-empleado.dto");
const empleados_service_1 = require("./empleados.service");
let EmpleadosController = class EmpleadosController {
    constructor(empleadoService, userService) {
        this.empleadoService = empleadoService;
        this.userService = userService;
    }
    getEntradasSalids(user) {
        return this.empleadoService.getEntradasSalidas(user.id);
    }
    crearEmpleado(empleado) {
        return this.userService.create(empleado);
    }
    getById(id) {
        return this.userService.getById(id);
    }
    actualizarEmpleado(empleadoId, empleado) {
        return this.empleadoService.updateEmpleado(empleadoId, empleado);
    }
    paginate(options) {
        return this.empleadoService.empleadosPaginate(options);
    }
    deleteEmpleado(empleadoId) {
        return this.empleadoService.delete(empleadoId);
    }
};
__decorate([
    common_1.Get('entradas-salidas'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "getEntradasSalids", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_empleado_dto_1.CreateEmpleadoDTO]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "crearEmpleado", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "getById", null);
__decorate([
    common_1.Put(':empleadoId'),
    __param(0, common_1.Param('empleadoId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_empleado_dto_1.UpdateEmpleadoDTO]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "actualizarEmpleado", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "paginate", null);
__decorate([
    common_1.Delete(':empleadoId'),
    __param(0, common_1.Param('empleadoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmpleadosController.prototype, "deleteEmpleado", null);
EmpleadosController = __decorate([
    common_1.Controller('empleados'),
    swagger_1.ApiTags('empleados'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [empleados_service_1.EmpleadosService,
        users_service_1.UsersService])
], EmpleadosController);
exports.EmpleadosController = EmpleadosController;
//# sourceMappingURL=empleados.controller.js.map