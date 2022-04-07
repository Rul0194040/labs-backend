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
exports.PuestosController = void 0;
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../../../common/DTO/paginationPrimeNg.dto");
const create_puesto_dto_1 = require("../DTOs/create-puesto.dto");
const update_puesto_dto_1 = require("../DTOs/update-puesto.dto");
const puestos_departamentos_service_1 = require("../puestos-departamentos.service");
let PuestosController = class PuestosController {
    constructor(puestosDepartamentosService) {
        this.puestosDepartamentosService = puestosDepartamentosService;
    }
    crearPuesto(puesto) {
        return this.puestosDepartamentosService.crearPuesto(puesto);
    }
    getById(id) {
        return this.puestosDepartamentosService.getPuestoById(id);
    }
    actualizarPuesto(puestoId, puesto) {
        return this.puestosDepartamentosService.actualizarPuesto(puestoId, puesto);
    }
    paginate(options) {
        return this.puestosDepartamentosService.puestosPaginate(options);
    }
    delete(id) {
        return this.puestosDepartamentosService.puestosDelete(id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_puesto_dto_1.CreatePuestoDTO]),
    __metadata("design:returntype", Promise)
], PuestosController.prototype, "crearPuesto", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuestosController.prototype, "getById", null);
__decorate([
    common_1.Put(':puestoId'),
    __param(0, common_1.Param('puestoId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_puesto_dto_1.UpdatePuestoDTO]),
    __metadata("design:returntype", Promise)
], PuestosController.prototype, "actualizarPuesto", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], PuestosController.prototype, "paginate", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuestosController.prototype, "delete", null);
PuestosController = __decorate([
    common_1.Controller('puestos'),
    __metadata("design:paramtypes", [puestos_departamentos_service_1.PuestosDepartamentosService])
], PuestosController);
exports.PuestosController = PuestosController;
//# sourceMappingURL=puestos.controller.js.map