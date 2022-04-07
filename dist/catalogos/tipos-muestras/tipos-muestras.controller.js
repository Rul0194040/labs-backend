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
exports.TiposMuestrasController = void 0;
const common_1 = require("@nestjs/common");
const profiles_enum_1 = require("../../users/profiles.enum");
const require_profiles_decorator_1 = require("../../users/decorators/require-profiles.decorator");
const tipos_muestras_service_1 = require("./tipos-muestras.service");
const createTiposMuestras_dto_1 = require("./DTOs/createTiposMuestras.dto");
const updateTiposMuestras_dto_1 = require("./DTOs/updateTiposMuestras.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TiposMuestrasController = class TiposMuestrasController {
    constructor(tiposMuestrasService) {
        this.tiposMuestrasService = tiposMuestrasService;
    }
    create(tipo) {
        return this.tiposMuestrasService.create(tipo);
    }
    getById(id) {
        return this.tiposMuestrasService.getById(id);
    }
    update(id, tipo) {
        return this.tiposMuestrasService.update(id, tipo);
    }
    updateStatus(id, status) {
        return this.tiposMuestrasService.updateStatus(id, status);
    }
    delete(id) {
        return this.tiposMuestrasService.delete(id);
    }
    paginate(options) {
        return this.tiposMuestrasService.paginate(options);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTiposMuestras_dto_1.CreateTipoMuestraDTO]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateTiposMuestras_dto_1.UpdateTipoMuestraDTO]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "delete", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], TiposMuestrasController.prototype, "paginate", null);
TiposMuestrasController = __decorate([
    swagger_1.ApiTags('tipos-muestras'),
    common_1.Controller('tipos-muestras'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN),
    __metadata("design:paramtypes", [tipos_muestras_service_1.TiposMuestrasService])
], TiposMuestrasController);
exports.TiposMuestrasController = TiposMuestrasController;
//# sourceMappingURL=tipos-muestras.controller.js.map