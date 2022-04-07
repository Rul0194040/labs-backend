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
var PublicoController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_venta_guard_1 = require("../../auth/guards/jwt-venta/jwt-venta.guard");
const logger_1 = require("../../logger");
const estadosVentas_enum_1 = require("../../ventas/estadosVentas.enum");
const ventas_entity_1 = require("../../ventas/ventas.entity");
const ventas_service_1 = require("../../ventas/ventas.service");
const login_venta_dto_1 = require("./login-venta.dto");
const venta_sesion_decorator_1 = require("./venta-sesion.decorator");
let PublicoController = PublicoController_1 = class PublicoController {
    constructor(ventasService, jwtService) {
        this.ventasService = ventasService;
        this.jwtService = jwtService;
        this.logger = new logger_1.MyLogger(PublicoController_1.name);
    }
    async loginPorVenta(loginVenta) {
        const venta = await this.ventasService.getByFolioAcceso(loginVenta.folio, loginVenta.acceso);
        if (!venta || venta.estatus === estadosVentas_enum_1.EstadosVentas.CANCELADA) {
            throw new common_1.HttpException('La venta no existe o ha sido cancelada.', common_1.HttpStatus.NOT_FOUND);
        }
        const access_token = this.jwtService.sign({ sub: venta.id, uuid: venta.uuid }, {
            expiresIn: '1h',
        });
        return {
            access_token,
        };
    }
    async getInfoVenta(ventaSesion) {
        return await this.ventasService.getByUuid(ventaSesion.uuid);
    }
    async descargarPdfVenta(ventaSesion, res) {
        const venta = await this.ventasService.getByUuid(ventaSesion.uuid);
        if (venta.estatus === estadosVentas_enum_1.EstadosVentas.CANCELADA) {
            throw new common_1.HttpException('La venta no existe.', common_1.HttpStatus.PAYMENT_REQUIRED);
        }
        if (!venta.pagado && !venta.credito) {
            throw new common_1.HttpException('La venta aún no ha sido pagada.', common_1.HttpStatus.PAYMENT_REQUIRED);
        }
        if (!venta.estudioPx) {
            throw new common_1.HttpException('Aún no se cuenta con los estudios para descarga.', common_1.HttpStatus.BAD_REQUEST);
        }
        const file = this.ventasService.getPdfUrl(venta.uuid);
        res.sendFile(file + '.pdf', {
            root: `./uploads/pxlab`,
        });
        this.logger.log('No implementado!');
    }
    descargarPdfFactura() {
        this.logger.log('No implementado!');
    }
    descargarXmlFactura() {
        this.logger.log('No implementado!');
    }
    guardarDatosFacturacion() {
        this.logger.log('No implementado!');
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_venta_dto_1.LoginVentaDTO]),
    __metadata("design:returntype", Promise)
], PublicoController.prototype, "loginPorVenta", null);
__decorate([
    common_1.UseGuards(jwt_venta_guard_1.JwtVentaGuard),
    common_1.Get('dashboard'),
    __param(0, venta_sesion_decorator_1.SesionVenta()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicoController.prototype, "getInfoVenta", null);
__decorate([
    common_1.UseGuards(jwt_venta_guard_1.JwtVentaGuard),
    common_1.Get('resultados'),
    __param(0, venta_sesion_decorator_1.SesionVenta()),
    __param(1, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicoController.prototype, "descargarPdfVenta", null);
__decorate([
    common_1.UseGuards(jwt_venta_guard_1.JwtVentaGuard),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicoController.prototype, "descargarPdfFactura", null);
__decorate([
    common_1.UseGuards(jwt_venta_guard_1.JwtVentaGuard),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicoController.prototype, "descargarXmlFactura", null);
__decorate([
    common_1.UseGuards(jwt_venta_guard_1.JwtVentaGuard),
    common_1.Post(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicoController.prototype, "guardarDatosFacturacion", null);
PublicoController = PublicoController_1 = __decorate([
    common_1.Controller('publico/venta'),
    __metadata("design:paramtypes", [ventas_service_1.VentasService,
        jwt_1.JwtService])
], PublicoController);
exports.PublicoController = PublicoController;
//# sourceMappingURL=publico.controller.js.map