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
exports.UsersController = void 0;
const updateUser_dto_1 = require("./dto/updateUser.dto");
const createUser_dto_1 = require("./dto/createUser.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const require_rule_decorator_1 = require("./decorators/require-rule.decorator");
const user_decorator_1 = require("./decorators/user.decorator");
const statusUser_dto_1 = require("./dto/statusUser.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const rules_guard_1 = require("./guard/rules.guard");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(user) {
        return this.usersService.create(user);
    }
    paginate(options) {
        return this.usersService.paginate(options);
    }
    getById(id) {
        return this.usersService.getById(id);
    }
    update(id, data) {
        return this.usersService.update(id, data);
    }
    statusById(id, status) {
        return this.usersService.statusById(id, status);
    }
    delete(id) {
        return this.usersService.delete(id);
    }
    updatePassword(password, newPassword, user) {
        return this.usersService.changePassword(user, password, newPassword);
    }
    getProfiles() {
        return this.usersService.getProfiles();
    }
    getTiposEmpleados() {
        return this.usersService.getPerfilTipoEmpleados();
    }
    agregarUsuarioSucursal(usuarioId, sucursalId) {
        return this.usersService.asignarUsuarioSucursal(usuarioId, sucursalId);
    }
    quitarUsuarioSucursal(usuarioId, sucursalId) {
        return this.usersService.desasignarUsuarioSucursal(usuarioId, sucursalId);
    }
    obtenerSucursalesUsuario(usuarioId) {
        return this.usersService.getSucursales(usuarioId);
    }
    async finalizarGrabadoDeRoles(userSesion) {
        const user = await this.usersService.getById(userSesion.id);
        if (!user.grabandoRules) {
            throw new common_1.HttpException('Usted no está grabando roles.', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.usersService.finalizarGrabado(user.id);
        console.log('result', result);
        throw new common_1.HttpException('El grabado de roles ha finalizado, disfrute sus nuevos permisos.', common_1.HttpStatus.UNAUTHORIZED);
        return result;
    }
    activarGrabadoDeRoles(usuarioId) {
        return this.usersService.activarGrabado(usuarioId);
    }
    desactivarGrabadoDeRoles(usuarioId) {
        return this.usersService.activarGrabado(usuarioId, false);
    }
    async importarEmpleadosXLS(file) {
        return await this.usersService.importarEmpleados(file.path);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:users'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.createUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:users'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateUser_dto_1.updateUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, statusUser_dto_1.statusUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "statusById", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    common_1.Put('password/change'),
    __param(0, common_1.Body('password')),
    __param(1, common_1.Body('newPassword')),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    common_1.Get('profiles/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfiles", null);
__decorate([
    common_1.Get('/profiles/tipo-empleados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getTiposEmpleados", null);
__decorate([
    common_1.Patch(':usuarioId/asignar/sucursal/:sucursalId'),
    __param(0, common_1.Param('usuarioId', common_1.ParseIntPipe)),
    __param(1, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "agregarUsuarioSucursal", null);
__decorate([
    common_1.Patch(':usuarioId/desasignar/sucursal/:sucursalId'),
    __param(0, common_1.Param('usuarioId', common_1.ParseIntPipe)),
    __param(1, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "quitarUsuarioSucursal", null);
__decorate([
    common_1.Get('/:usuarioId/sucursales'),
    __param(0, common_1.Param('usuarioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "obtenerSucursalesUsuario", null);
__decorate([
    common_1.Patch('/finalizar-grabado-roles'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "finalizarGrabadoDeRoles", null);
__decorate([
    require_rule_decorator_1.RequireRule('cambiar:grabado:rules'),
    common_1.Patch('/activar-grabado-roles/:usuarioId'),
    __param(0, common_1.Param('usuarioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activarGrabadoDeRoles", null);
__decorate([
    require_rule_decorator_1.RequireRule('cambiar:grabado:rules'),
    common_1.Patch('/desactivar-grabado-roles/:usuarioId'),
    __param(0, common_1.Param('usuarioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "desactivarGrabadoDeRoles", null);
__decorate([
    common_1.Put('update/xls/empleados'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                (file.originalname.split('.').reverse()[0] === 'xls' ||
                    file.originalname.split('.').reverse()[0] === 'xlsx')) {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente xlsx y xls'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/xls';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "importarEmpleadosXLS", null);
UsersController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('users'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map