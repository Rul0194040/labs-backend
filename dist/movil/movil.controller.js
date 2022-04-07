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
exports.MovilController = void 0;
const common_1 = require("@nestjs/common");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const swagger_1 = require("@nestjs/swagger");
const movil_service_1 = require("./movil.service");
const cajas_entity_1 = require("../cajas/cajas.entity");
const cajas_service_1 = require("../cajas/cajas.service");
const estadosVentas_enum_1 = require("../ventas/estadosVentas.enum");
let MovilController = class MovilController {
    constructor(sucursalesInsumosService, movilService, cajasService) {
        this.sucursalesInsumosService = sucursalesInsumosService;
        this.movilService = movilService;
        this.cajasService = cajasService;
    }
    getById(id) {
        return this.cajasService.getById(id);
    }
    paginateInsumosBySucursal(idSucursal, options) {
        return this.sucursalesInsumosService.paginateInsumosBySucursal(idSucursal, options);
    }
    obtenerCajasActivas() {
        return this.movilService.obtenerCajasAbiertas();
    }
};
__decorate([
    common_1.Get('cajas/:id/detalle'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovilController.prototype, "getById", null);
__decorate([
    common_1.Post('sucursal/:idSucursal/insumos/paginate'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], MovilController.prototype, "paginateInsumosBySucursal", null);
__decorate([
    common_1.Get('cajas/abiertas'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MovilController.prototype, "obtenerCajasActivas", null);
MovilController = __decorate([
    swagger_1.ApiTags('movil'),
    common_1.Controller('movil'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sucursalesInsumos_service_1.SucursalesInsumosService,
        movil_service_1.MovilService,
        cajas_service_1.CajasService])
], MovilController);
exports.MovilController = MovilController;
//# sourceMappingURL=movil.controller.js.map