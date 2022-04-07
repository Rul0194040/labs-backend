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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const reportes_service_1 = require("./reportes.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const reportes_ventas_service_1 = require("./reportes-ventas.service");
let ReportesController = class ReportesController {
    constructor(reportesService, reportesVentasService) {
        this.reportesService = reportesService;
        this.reportesVentasService = reportesVentasService;
    }
    reporteVentas(options) {
        return this.reportesService.reporteVentas(options);
    }
    reporteAdeudos(options) {
        return this.reportesService.reporteVentasAdeudos(options);
    }
    async filtroMovimientos(filter, res) {
        const buffer = await this.reportesService.getVentasXLS(filter);
        const outputFileName = 'ventas.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async filtroInsumos(sucursalId, res) {
        const buffer = await this.reportesService.getInsumosBySucursalXLS(sucursalId);
        const outputFileName = 'insumos.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async filtromovimiento(movimientoId, res) {
        const buffer = await this.reportesService.getMovimientoXLS(movimientoId);
        const outputFileName = 'insumos.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    ReportesVentasService(sucursalId, options) {
        return this.reportesVentasService.getServiciosVentas(options, sucursalId);
    }
    async serviciosVentasXLS(sucursalId, filter, res) {
        const buffer = await this.reportesVentasService.serviciosVentasXLS(filter, sucursalId);
        const outputFileName = 'servicios-ventas.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    reporte(inicio, fin) {
        return this.reportesVentasService.reporteVentasPeriodoJson(inicio, fin);
    }
    async reporteXls(inicio, fin, res) {
        const buffer = await this.reportesVentasService.reporteVentasPeriodoXls(inicio, fin);
        const outputFileName = 'reporte_ventas.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async filtroIngresos(sucursalId, filter, res) {
        const buffer = await this.reportesVentasService.getIngresosBySucursalXLS(filter, sucursalId);
        const outputFileName = 'insumos.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    paginateIngresos(options, sucursalId) {
        return this.reportesVentasService.paginateIngresos(options, sucursalId);
    }
    paginateVentasBySucursal(options, sucursalId) {
        return this.reportesVentasService.paginateVentasBySucursal(options, sucursalId);
    }
    async filtroVentasBySucursal(sucursalId, filter, res) {
        const buffer = await this.reportesVentasService.getVentasBySucursalXLS(filter, sucursalId);
        const outputFileName = 'insumos.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
__decorate([
    common_1.Post('ventas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteVentas", null);
__decorate([
    common_1.Post('ventas/adeudos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteAdeudos", null);
__decorate([
    common_1.Get('ventas-xls/:filter'),
    __param(0, common_1.Param('filter')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "filtroMovimientos", null);
__decorate([
    common_1.Get('insumos-xls/:sucursalId'),
    __param(0, common_1.Param('sucursalId')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "filtroInsumos", null);
__decorate([
    common_1.Get('movimiento-xls/:movimientoId'),
    __param(0, common_1.Param('movimientoId')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "filtromovimiento", null);
__decorate([
    common_1.Post('servicios-ventas/sucursal/:sucursalId'),
    __param(0, common_1.Param('sucursalId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "ReportesVentasService", null);
__decorate([
    common_1.Get('servicios-ventas/sucursal/:sucursalId/:filter'),
    __param(0, common_1.Param('sucursalId')),
    __param(1, common_1.Param('filter')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "serviciosVentasXLS", null);
__decorate([
    common_1.Get('ventas-sucursales-periodo/:inicio/:fin/json'),
    __param(0, common_1.Param('inicio')),
    __param(1, common_1.Param('fin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "reporte", null);
__decorate([
    common_1.Get('ventas-sucursales-periodo/:inicio/:fin/xls'),
    __param(0, common_1.Param('inicio')),
    __param(1, common_1.Param('fin')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteXls", null);
__decorate([
    common_1.Get('ingresos-xls/:sucursalId/:filter'),
    __param(0, common_1.Param('sucursalId')),
    __param(1, common_1.Param('filter')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "filtroIngresos", null);
__decorate([
    common_1.Post('paginate/ingresos/:sucursalId'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('sucursalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions, Number]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "paginateIngresos", null);
__decorate([
    common_1.Post('paginate/ventas/:sucursalId'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('sucursalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions, Number]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "paginateVentasBySucursal", null);
__decorate([
    common_1.Get('ventas-xls/:sucursalId/:filter'),
    __param(0, common_1.Param('sucursalId')),
    __param(1, common_1.Param('filter')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "filtroVentasBySucursal", null);
ReportesController = __decorate([
    common_1.Controller('reportes'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService,
        reportes_ventas_service_1.ReportesVentasService])
], ReportesController);
exports.ReportesController = ReportesController;
//# sourceMappingURL=reportes.controller.js.map