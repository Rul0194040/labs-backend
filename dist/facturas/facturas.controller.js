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
exports.FacturasController = void 0;
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const datos_factura_dto_1 = require("./dto/datos-factura.dto");
const facturas_service_1 = require("./facturas.service");
const update_factura_dto_1 = require("./dto/update-factura.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
let FacturasController = class FacturasController {
    constructor(facturaService) {
        this.facturaService = facturaService;
    }
    create(factura) {
        return this.facturaService.create(factura);
    }
    paginate(options) {
        return this.facturaService.paginate(options);
    }
    getById(id) {
        return this.facturaService.getById(id);
    }
    update(id, factura) {
        return this.facturaService.update(id, factura);
    }
    delete(id) {
        return this.facturaService.delete(id);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:factura'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [datos_factura_dto_1.DatosFacturaDTO]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:facturas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:facturas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:facturas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_factura_dto_1.UpdateFacturaDTO]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:facturas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FacturasController.prototype, "delete", null);
FacturasController = __decorate([
    swagger_1.ApiTags('facturas'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('facturas'),
    __metadata("design:paramtypes", [facturas_service_1.FacturasService])
], FacturasController);
exports.FacturasController = FacturasController;
//# sourceMappingURL=facturas.controller.js.map