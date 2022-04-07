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
exports.ClientesController = void 0;
const create_cliente_dto_1 = require("./DTOs/create-cliente.dto");
const clientes_service_1 = require("./clientes.service");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const update_cliente_dto_1 = require("./DTOs/update-cliente.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../users/decorators/user.decorator");
const users_entity_1 = require("../users/users.entity");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
let ClientesController = class ClientesController {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    create(cliente, user) {
        return this.clientesService.create(cliente, user);
    }
    paginate(options) {
        return this.clientesService.paginate(options);
    }
    getById(id) {
        return this.clientesService.getById(id);
    }
    update(id, cliente) {
        return this.clientesService.update(id, cliente);
    }
    updateStatus(id, status) {
        return this.clientesService.updateStatus(id, status);
    }
    delete(id) {
        return this.clientesService.delete(id);
    }
    async importarClientesXLS(file) {
        return this.clientesService.importarClientesXLS(file.path);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDTO,
        users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDTO]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "delete", null);
__decorate([
    common_1.Put('update/xls'),
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
], ClientesController.prototype, "importarClientesXLS", null);
ClientesController = __decorate([
    swagger_1.ApiTags('clientes'),
    common_1.Controller('clientes'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
exports.ClientesController = ClientesController;
//# sourceMappingURL=clientes.controller.js.map