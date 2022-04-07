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
exports.CuentasController = void 0;
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const bancos_service_1 = require("../bancos.service");
const create_cuenta_dto_1 = require("../dto/create-cuenta.dto");
const update_cuenta_dto_1 = require("../dto/update-cuenta.dto");
let CuentasController = class CuentasController {
    constructor(bancoService) {
        this.bancoService = bancoService;
    }
    create(cuenta) {
        return this.bancoService.createCuenta(cuenta);
    }
    paginate(options) {
        return this.bancoService.paginateCuenta(options);
    }
    getById(id) {
        return this.bancoService.getCuentaById(id);
    }
    update(id, cuenta) {
        return this.bancoService.updateCuenta(id, cuenta);
    }
    delete(id) {
        return this.bancoService.deleteCuenta(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cuenta_dto_1.CreateCuentaDto]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cuenta_dto_1.UpdateCuentaDto]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "delete", null);
CuentasController = __decorate([
    common_1.Controller('bancos/cuentas'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], CuentasController);
exports.CuentasController = CuentasController;
//# sourceMappingURL=cuentas.controller.js.map