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
exports.LotesController = void 0;
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const lotes_service_1 = require("./lotes.service");
const create_lote_dto_1 = require("./DTOs/create-lote.dto");
const update_lote_dto_1 = require("./DTOs/update-lote.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let LotesController = class LotesController {
    constructor(lotesService) {
        this.lotesService = lotesService;
    }
    create(lote) {
        return this.lotesService.create(lote);
    }
    getById(id) {
        return this.lotesService.getById(id);
    }
    delete(id) {
        return this.lotesService.delete(id);
    }
    paginate(options) {
        return this.lotesService.paginate(options);
    }
    update(id, descripcion) {
        return this.lotesService.update(id, descripcion);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lote_dto_1.CreateLoteDTO]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "getById", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "delete", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "paginate", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lote_dto_1.UpdateLoteDTO]),
    __metadata("design:returntype", Promise)
], LotesController.prototype, "update", null);
LotesController = __decorate([
    swagger_1.ApiTags('lotes'),
    common_1.Controller('lotes'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [lotes_service_1.LotesService])
], LotesController);
exports.LotesController = LotesController;
//# sourceMappingURL=lotes.controller.js.map