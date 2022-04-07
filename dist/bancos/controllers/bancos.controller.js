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
exports.BancosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const bancos_service_1 = require("../bancos.service");
const create_banco_dto_1 = require("../dto/create-banco.dto");
const update_banco_dto_1 = require("../dto/update-banco.dto");
let BancosController = class BancosController {
    constructor(bancoService) {
        this.bancoService = bancoService;
    }
    create(banco) {
        return this.bancoService.create(banco);
    }
    paginate(options) {
        return this.bancoService.paginate(options);
    }
    getById(id) {
        return this.bancoService.getById(id);
    }
    update(id, banco) {
        return this.bancoService.update(id, banco);
    }
    delete(id) {
        return this.bancoService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banco_dto_1.CreateBancoDto]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_banco_dto_1.UpdateBancoDto]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "delete", null);
BancosController = __decorate([
    common_1.Controller('bancos'),
    swagger_1.ApiTags('bancos'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], BancosController);
exports.BancosController = BancosController;
//# sourceMappingURL=bancos.controller.js.map