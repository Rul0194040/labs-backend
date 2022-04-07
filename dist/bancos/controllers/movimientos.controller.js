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
exports.MovimientosController = void 0;
const update_movimiento_dto_1 = require("./../../almacen/DTOs/update-movimiento.dto");
const bancos_service_1 = require("./../bancos.service");
const create_mov_bancario_dto_1 = require("./../dto/create-mov-bancario.dto");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
let MovimientosController = class MovimientosController {
    constructor(bancoService) {
        this.bancoService = bancoService;
    }
    create(movimiento) {
        return this.bancoService.createMov(movimiento);
    }
    paginate(options) {
        return this.bancoService.paginateMov(options);
    }
    getById(id) {
        return this.bancoService.getMovById(id);
    }
    update(id, mov) {
        return this.bancoService.updateMov(id, mov);
    }
    delete(id) {
        return this.bancoService.deleteMov(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mov_bancario_dto_1.CreateMovBancarioDTO]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_movimiento_dto_1.UpdateMovimientoDTO]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "delete", null);
MovimientosController = __decorate([
    common_1.Controller('bancos/movimientos'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], MovimientosController);
exports.MovimientosController = MovimientosController;
//# sourceMappingURL=movimientos.controller.js.map