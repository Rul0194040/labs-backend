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
exports.PagosController = void 0;
const common_1 = require("@nestjs/common");
const pagos_service_1 = require("./pagos.service");
const agregar_pago_dto_1 = require("./dtos/agregar-pago.dto");
const user_decorator_1 = require("../users/decorators/user.decorator");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const ventas_service_1 = require("../ventas/ventas.service");
let PagosController = class PagosController {
    constructor(pagosService, ventasService, heimalService) {
        this.pagosService = pagosService;
        this.ventasService = ventasService;
        this.heimalService = heimalService;
    }
    create(pago, user) {
        return this.pagosService.create(pago, user);
    }
    getById(id) {
        return this.pagosService.getById(id);
    }
    delete(id) {
        return this.pagosService.delete(id);
    }
    updateStatus(id, estatus) {
        return this.pagosService.updateStatus(id, estatus);
    }
    cancelacionPago(id, motivo) {
        return this.pagosService.cancelacionPago(id, motivo);
    }
    async reciboPagos(ventaId, data) {
        const detalleVenta = await this.ventasService.getDetalleVentaById(ventaId);
        const ticketInfo = await this.pagosService.getReciboPagos(detalleVenta, data.pagosId);
        return ticketInfo;
    }
    abonarPagoCliente(clienteId, monto) {
        return this.pagosService.abonarPagoCliente(clienteId, monto);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:pago'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agregar_pago_dto_1.AgregarPago,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:pago'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "getById", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:pago'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "delete", null);
__decorate([
    common_1.Patch(':id'),
    require_rule_decorator_1.RequireRule('update:pago'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('estatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "updateStatus", null);
__decorate([
    common_1.Put('cancelacion/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('motivo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "cancelacionPago", null);
__decorate([
    common_1.Post('recibo-pago/:ventaId'),
    require_rule_decorator_1.RequireRule('view:pago'),
    __param(0, common_1.Param('ventaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "reciboPagos", null);
__decorate([
    common_1.Put('abonar/cliente/:clienteId'),
    __param(0, common_1.Param('clienteId', common_1.ParseIntPipe)),
    __param(1, common_1.Body('monto', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "abonarPagoCliente", null);
PagosController = __decorate([
    common_1.Controller('pagos'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pagos_service_1.PagosService,
        ventas_service_1.VentasService,
        heimdal_service_1.HeimdalService])
], PagosController);
exports.PagosController = PagosController;
//# sourceMappingURL=pagos.controller.js.map