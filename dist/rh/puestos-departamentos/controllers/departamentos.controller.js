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
exports.DepartamentosController = void 0;
const common_1 = require("@nestjs/common");
const puestos_departamentos_service_1 = require("../puestos-departamentos.service");
const create_departamento_dto_1 = require("../DTOs/create-departamento.dto");
const update_departamento_dto_1 = require("../DTOs/update-departamento.dto");
const paginationPrimeNg_dto_1 = require("../../../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../../../common/DTO/pagination-prime-Ng-result.dto");
let DepartamentosController = class DepartamentosController {
    constructor(puestosDepartamentosService) {
        this.puestosDepartamentosService = puestosDepartamentosService;
    }
    crearDepartamento(departamento) {
        return this.puestosDepartamentosService.crearDepartamento(departamento);
    }
    getById(id) {
        return this.puestosDepartamentosService.getDepartamentoById(id);
    }
    actualizarDepartamento(departamentoId, departamento) {
        return this.puestosDepartamentosService.actualizarDepartamento(departamentoId, departamento);
    }
    paginate(options) {
        return this.puestosDepartamentosService.departamentosPaginate(options);
    }
    delete(departamentoId) {
        return this.puestosDepartamentosService.deleteDepartamento(departamentoId);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_departamento_dto_1.CreateDepartamentoDTO]),
    __metadata("design:returntype", Promise)
], DepartamentosController.prototype, "crearDepartamento", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartamentosController.prototype, "getById", null);
__decorate([
    common_1.Put(':departamentoId'),
    __param(0, common_1.Param('departamentoId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_departamento_dto_1.UpdateDepartamentoDTO]),
    __metadata("design:returntype", Promise)
], DepartamentosController.prototype, "actualizarDepartamento", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], DepartamentosController.prototype, "paginate", null);
__decorate([
    common_1.Post(':departamentoId'),
    __param(0, common_1.Param('departamentoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartamentosController.prototype, "delete", null);
DepartamentosController = __decorate([
    common_1.Controller('departamentos'),
    __metadata("design:paramtypes", [puestos_departamentos_service_1.PuestosDepartamentosService])
], DepartamentosController);
exports.DepartamentosController = DepartamentosController;
//# sourceMappingURL=departamentos.controller.js.map