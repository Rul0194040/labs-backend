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
exports.TiposCuentasGastoController = void 0;
const common_1 = require("@nestjs/common");
const create_tipo_cuenta_gasto_dto_1 = require("../dto/create-tipo-cuenta-gasto.dto");
const update_tipo_cuenta_gasto_dto_1 = require("../dto/update-tipo-cuenta-gasto.dto");
const bancos_service_1 = require("../bancos.service");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
let TiposCuentasGastoController = class TiposCuentasGastoController {
    constructor(bancosService) {
        this.bancosService = bancosService;
    }
    crearTipoCuentaGasto(tipoCuentaGasto) {
        return this.bancosService.crearTipoCuentaGasto(tipoCuentaGasto);
    }
    paginate(options) {
        return this.bancosService.cuentaGastoPaginate(options);
    }
    getById(id) {
        return this.bancosService.getCuentaGastoById(id);
    }
    actualizarTipoCuentaGasto(id, tipoCuentaGastos) {
        return this.bancosService.actualizarTipoCuentaGasto(id, tipoCuentaGastos);
    }
    deleteEmpleado(cuentaG) {
        return this.bancosService.delete(cuentaG);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tipo_cuenta_gasto_dto_1.CreateTipoCuentaGastoDTO]),
    __metadata("design:returntype", Promise)
], TiposCuentasGastoController.prototype, "crearTipoCuentaGasto", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], TiposCuentasGastoController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TiposCuentasGastoController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tipo_cuenta_gasto_dto_1.UpdateTipoCuentaGastoDTO]),
    __metadata("design:returntype", Promise)
], TiposCuentasGastoController.prototype, "actualizarTipoCuentaGasto", null);
__decorate([
    common_1.Delete(':cuentaG'),
    __param(0, common_1.Param('cuentaG', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TiposCuentasGastoController.prototype, "deleteEmpleado", null);
TiposCuentasGastoController = __decorate([
    common_1.Controller('tipos-cuentas-gasto'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], TiposCuentasGastoController);
exports.TiposCuentasGastoController = TiposCuentasGastoController;
//# sourceMappingURL=tipos-cuentas-gasto.controller.js.map