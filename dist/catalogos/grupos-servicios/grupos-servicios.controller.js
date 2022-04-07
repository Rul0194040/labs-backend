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
exports.GruposServiciosController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const profiles_enum_1 = require("../../users/profiles.enum");
const require_profiles_decorator_1 = require("../../users/decorators/require-profiles.decorator");
const grupos_servicios_service_1 = require("./grupos-servicios.service");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const createGrupoServicio_dto_1 = require("./DTOs/createGrupoServicio.dto");
const updateGrupoServicio_dto_1 = require("./DTOs/updateGrupoServicio.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
let GruposServiciosController = class GruposServiciosController {
    constructor(grupoServiciosService) {
        this.grupoServiciosService = grupoServiciosService;
    }
    create(grupo) {
        return this.grupoServiciosService.create(grupo);
    }
    paginate(options) {
        return this.grupoServiciosService.paginate(options);
    }
    getById(id) {
        return this.grupoServiciosService.getById(id);
    }
    update(id, grupo) {
        return this.grupoServiciosService.update(id, grupo);
    }
    updateStatus(id, status) {
        return this.grupoServiciosService.updateStatus(id, status);
    }
    delete(id) {
        return this.grupoServiciosService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createGrupoServicio_dto_1.CreateGrupoServiciosDTO]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateGrupoServicio_dto_1.UpdateGrupoServiciosDTO]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GruposServiciosController.prototype, "delete", null);
GruposServiciosController = __decorate([
    swagger_1.ApiTags('grupos-servicios'),
    common_1.Controller('grupos-servicios'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN),
    __metadata("design:paramtypes", [grupos_servicios_service_1.GruposServiciosService])
], GruposServiciosController);
exports.GruposServiciosController = GruposServiciosController;
//# sourceMappingURL=grupos-servicios.controller.js.map