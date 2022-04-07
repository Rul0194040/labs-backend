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
exports.ServiciosController = void 0;
const swagger_1 = require("@nestjs/swagger");
const createServicioInsumo_dto_1 = require("./DTOs/createServicioInsumo.dto");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const createServicio_dto_1 = require("./DTOs/createServicio.dto");
const updateServicio_dto_1 = require("./DTOs/updateServicio.dto");
const servicios_service_1 = require("./servicios.service");
const profiles_enum_1 = require("../users/profiles.enum");
const require_profiles_decorator_1 = require("../users/decorators/require-profiles.decorator");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const updateServiceCatalogs_dto_1 = require("./DTOs/updateServiceCatalogs.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
let ServiciosController = class ServiciosController {
    constructor(serviciosService) {
        this.serviciosService = serviciosService;
    }
    async create(servicio) {
        return this.serviciosService.create(servicio);
    }
    updateCatalogs(id, catalogs) {
        return this.serviciosService.updateServiceCatalogs(id, catalogs);
    }
    paginate(options) {
        return this.serviciosService.paginate(options);
    }
    async agragar(idServicio, insumo) {
        return this.serviciosService.agregarInsumo(idServicio, insumo);
    }
    paginateInsumo(idServicio, options) {
        return this.serviciosService.paginateServicioInsumo(idServicio, options);
    }
    async getById(id) {
        return this.serviciosService.getById(id);
    }
    async update(id, data) {
        return this.serviciosService.update(id, data);
    }
    async delete(id) {
        return this.serviciosService.delete(id);
    }
    quitarInsumo(id) {
        return this.serviciosService.quitarInsumo(id);
    }
    async importarServiciosXLS(file) {
        return this.serviciosService.importarServiciosXLS(file.path);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:servicios'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createServicio_dto_1.CreateServicioDTO]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "create", null);
__decorate([
    common_1.Put(':id/catalogs'),
    require_rule_decorator_1.RequireRule('update:servicios'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateServiceCatalogs_dto_1.UpdateServiceCatalogsDTO]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "updateCatalogs", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:servicios'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "paginate", null);
__decorate([
    common_1.Post(':idServicio/insumo'),
    __param(0, common_1.Param('idServicio', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createServicioInsumo_dto_1.CreateServiciosInsumosDTO]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "agragar", null);
__decorate([
    common_1.Post(':idServicio/insumos/paginate'),
    __param(0, common_1.Param('idServicio', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "paginateInsumo", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:servicios'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:servicios'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateServicio_dto_1.UpdateServicioDTO]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:servicios'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "delete", null);
__decorate([
    common_1.Delete('serviciosInsumo/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiciosController.prototype, "quitarInsumo", null);
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
], ServiciosController.prototype, "importarServiciosXLS", null);
ServiciosController = __decorate([
    swagger_1.ApiTags('servicios'),
    common_1.Controller('servicios'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN),
    __metadata("design:paramtypes", [servicios_service_1.ServiciosService])
], ServiciosController);
exports.ServiciosController = ServiciosController;
//# sourceMappingURL=servicios.controller.js.map