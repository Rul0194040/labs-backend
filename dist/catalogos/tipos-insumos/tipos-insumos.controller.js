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
exports.TiposInsumosController = void 0;
const swagger_1 = require("@nestjs/swagger");
const tipo_insumo_entity_1 = require("./tipo-insumo.entity");
const common_1 = require("@nestjs/common");
const profiles_enum_1 = require("../../users/profiles.enum");
const require_profiles_decorator_1 = require("../../users/decorators/require-profiles.decorator");
const tipos_insumos_service_1 = require("./tipos-insumos.service");
const createTipoInsumo_dto_1 = require("./DTOs/createTipoInsumo.dto");
const updateTipoInsumo_dto_1 = require("./DTOs/updateTipoInsumo.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt/jwt-auth.guard");
let TiposInsumosController = class TiposInsumosController {
    constructor(tipoInsumoService) {
        this.tipoInsumoService = tipoInsumoService;
    }
    create(tipo) {
        return this.tipoInsumoService.create(tipo);
    }
    paginate(options) {
        return this.tipoInsumoService.paginate(options);
    }
    getById(id) {
        return this.tipoInsumoService.getById(id);
    }
    update(id, grupo) {
        return this.tipoInsumoService.update(id, grupo);
    }
    updateStatus(id, status) {
        return this.tipoInsumoService.updateStatus(id, status);
    }
    delete(id) {
        return this.tipoInsumoService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTipoInsumo_dto_1.CreateTipoInsumoDTO]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateTipoInsumo_dto_1.UpdateTipoInsumoDTO]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TiposInsumosController.prototype, "delete", null);
TiposInsumosController = __decorate([
    swagger_1.ApiTags('tipos-insumo'),
    common_1.Controller('tipos-insumos'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN),
    __metadata("design:paramtypes", [tipos_insumos_service_1.TiposInsumosService])
], TiposInsumosController);
exports.TiposInsumosController = TiposInsumosController;
//# sourceMappingURL=tipos-insumos.controller.js.map