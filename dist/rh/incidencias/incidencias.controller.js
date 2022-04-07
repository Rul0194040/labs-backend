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
exports.IncidenciasController = void 0;
const incidencias_service_1 = require("./incidencias.service");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const create_incidencia_dto_1 = require("./DTO/create-incidencia.dto");
const update_incidencia_dto_1 = require("./DTO/update-incidencia.dto");
let IncidenciasController = class IncidenciasController {
    constructor(incidenciaService) {
        this.incidenciaService = incidenciaService;
    }
    crearIncidencia(incidencia) {
        return this.incidenciaService.createIncidencia(incidencia);
    }
    getById(id) {
        return this.incidenciaService.getIncidenciaById(id);
    }
    actualizarIncidencia(incidenciaId, incidencia) {
        return this.incidenciaService.updateIncidencia(incidenciaId, incidencia);
    }
    paginate(options) {
        return this.incidenciaService.incidenciasPaginate(options);
    }
    deleteIncidencia(incidenciaId) {
        return this.incidenciaService.delete(incidenciaId);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incidencia_dto_1.CreateIncidenciaDTO]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "crearIncidencia", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "getById", null);
__decorate([
    common_1.Put(':incidenciaId'),
    __param(0, common_1.Param('incidenciaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_incidencia_dto_1.UpdateIncidenciasDTO]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "actualizarIncidencia", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "paginate", null);
__decorate([
    common_1.Delete(':incidenciaId'),
    __param(0, common_1.Param('incidenciaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "deleteIncidencia", null);
IncidenciasController = __decorate([
    common_1.Controller('incidencias'),
    __metadata("design:paramtypes", [incidencias_service_1.IncidenciasService])
], IncidenciasController);
exports.IncidenciasController = IncidenciasController;
//# sourceMappingURL=incidencias.controller.js.map