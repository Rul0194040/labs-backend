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
exports.TesorerosController = void 0;
const faltante_dto_1 = require("./cortesTesorero/faltante.dto");
const common_1 = require("@nestjs/common");
const tesoreros_service_1 = require("./tesoreros.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const require_profiles_decorator_1 = require("../users/decorators/require-profiles.decorator");
const profiles_enum_1 = require("../users/profiles.enum");
const ventas_service_1 = require("../ventas/ventas.service");
const estadosCancelacion_enum_1 = require("../ventas/estadosCancelacion.enum");
const user_decorator_1 = require("../users/decorators/user.decorator");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const cajas_entity_1 = require("../cajas/cajas.entity");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const users_entity_1 = require("../users/users.entity");
const movimientos_caja_entity_1 = require("../cajas/movimientos-caja.entity");
const estatusMovimiento_enum_1 = require("../cajas/estatusMovimiento.enum");
const cajas_service_1 = require("../cajas/cajas.service");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
let TesorerosController = class TesorerosController {
    constructor(tesorerosService, ventasService, cajasService) {
        this.tesorerosService = tesorerosService;
        this.ventasService = ventasService;
        this.cajasService = cajasService;
    }
    verSolicitudesCancelacion() {
        return this.tesorerosService.verSolicitudesCancelacion();
    }
    verVentasCanceladas() {
        return this.tesorerosService.verVentasCanceladas();
    }
    cancelarVenta(ventaId, estatusCancelacion, user) {
        return this.ventasService.cancelarVenta(ventaId, estatusCancelacion, user);
    }
    obtenerCajasActivas(user, options) {
        return this.tesorerosService.obtenerCajasAbiertas(user, options);
    }
    movimientosSolicitudCancelacion() {
        return this.tesorerosService.movimientosSolicitudCancelacion();
    }
    cancelarMovimiento(movimientoId, estatusCancelacion) {
        return this.cajasService.cancelarMovimiento(movimientoId, estatusCancelacion);
    }
    paginate(options) {
        return this.tesorerosService.paginate(options);
    }
    finalizarCorte(corteId) {
        return this.tesorerosService.finalizarCorte(corteId);
    }
    patchFaltante(cajaId, data) {
        return this.tesorerosService.setObservaciones(cajaId, data);
    }
};
__decorate([
    common_1.Get('solicitudes-cancelacion'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "verSolicitudesCancelacion", null);
__decorate([
    common_1.Get('ventas/canceladas'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "verVentasCanceladas", null);
__decorate([
    common_1.Put('cancelar/:ventaId'),
    require_rule_decorator_1.RequireRule('update:ventas'),
    __param(0, common_1.Param('ventaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body('estatusCancelacion')),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "cancelarVenta", null);
__decorate([
    common_1.Post('cajas/activas'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO,
        paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "obtenerCajasActivas", null);
__decorate([
    common_1.Get('cajas/movimientos-solicitudes'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "movimientosSolicitudCancelacion", null);
__decorate([
    common_1.Put('movimiento/cancelar/:movimientoId'),
    require_rule_decorator_1.RequireRule('update:cajas'),
    __param(0, common_1.Param('movimientoId', common_1.ParseIntPipe)),
    __param(1, common_1.Body('estatusCancelacion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "cancelarMovimiento", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "paginate", null);
__decorate([
    common_1.Patch('finalizar-corte/:corteId'),
    __param(0, common_1.Param('corteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "finalizarCorte", null);
__decorate([
    common_1.Patch('faltante-caja/:cajaId'),
    __param(0, common_1.Param('cajaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, faltante_dto_1.FaltanteDTO]),
    __metadata("design:returntype", Promise)
], TesorerosController.prototype, "patchFaltante", null);
TesorerosController = __decorate([
    common_1.Controller('tesoreros'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    require_profiles_decorator_1.RequireProfiles(profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES, profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS),
    __metadata("design:paramtypes", [tesoreros_service_1.TesorerosService,
        ventas_service_1.VentasService,
        cajas_service_1.CajasService])
], TesorerosController);
exports.TesorerosController = TesorerosController;
//# sourceMappingURL=tesoreros.controller.js.map