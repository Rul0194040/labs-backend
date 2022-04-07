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
exports.InsumosController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const profiles_enum_1 = require("../users/profiles.enum");
const require_profiles_decorator_1 = require("../users/decorators/require-profiles.decorator");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const createInsumo_dto_1 = require("./DTOs/createInsumo.dto");
const updateInsumo_dto_1 = require("./DTOs/updateInsumo.dto");
const insumos_service_1 = require("./insumos.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
let InsumosController = class InsumosController {
    constructor(insumosService) {
        this.insumosService = insumosService;
    }
    create(insumo) {
        return this.insumosService.create(insumo);
    }
    paginate(options) {
        return this.insumosService.paginate(options);
    }
    getById(id) {
        return this.insumosService.getById(id);
    }
    update(id, sucursal) {
        return this.insumosService.update(id, sucursal);
    }
    updateStatus(id, status) {
        return this.insumosService.updateStatus(id, status);
    }
    delete(id) {
        return this.insumosService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:insumo'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createInsumo_dto_1.CreateInsumoDTO]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:insumos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:insumos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:insumos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateInsumo_dto_1.UpdateInsumoDTO]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:insumos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:insumos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InsumosController.prototype, "delete", null);
InsumosController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('insumos'),
    common_1.Controller('insumos'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.SYSADMIN),
    __metadata("design:paramtypes", [insumos_service_1.InsumosService])
], InsumosController);
exports.InsumosController = InsumosController;
//# sourceMappingURL=insumos.controller.js.map