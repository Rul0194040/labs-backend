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
exports.AlmacenController = void 0;
const paginate_requisicion_sucursal_dto_1 = require("./DTOs/paginate-requisicion-sucursal.dto");
const create_informe_dto_1 = require("./DTOs/create-informe.dto");
const almacen_service_1 = require("./almacen.service");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const update_movimiento_dto_1 = require("./DTOs/update-movimiento.dto");
const user_decorator_1 = require("../users/decorators/user.decorator");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const swagger_1 = require("@nestjs/swagger");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const moment = require("moment");
let AlmacenController = class AlmacenController {
    constructor(almacenService, heimalService) {
        this.almacenService = almacenService;
        this.heimalService = heimalService;
    }
    create(data, user) {
        return this.almacenService.create(data.movimiento, data.detalle, user);
    }
    paginate(options) {
        return this.almacenService.paginate(options);
    }
    paginateRequisicion(options) {
        return this.almacenService.paginateRequisicion(options);
    }
    paginateRequisicionbySucursal(data, user) {
        return this.almacenService.paginateRequisicionbySucursal(data.options, data.sucursal, user);
    }
    paginateTransferencia(options, user) {
        return this.almacenService.paginateTransferencia(options, user);
    }
    getById(id) {
        return this.almacenService.getById(id);
    }
    update(id, sucursal) {
        return this.almacenService.update(id, sucursal);
    }
    updateStatus(id, status) {
        return this.almacenService.setStatus(id, status);
    }
    delete(id) {
        return this.almacenService.delete(id);
    }
    async filtroMovimientos(start, end, res) {
        const buffer = await this.almacenService.filtroMovimientos(start, end);
        const outputFileName = 'salida.xlsx';
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async documento(res, id) {
        let movimiento = new create_informe_dto_1.CreateInformeDTO();
        movimiento = await this.almacenService.getById(id);
        if (!movimiento) {
            res.send('No hay registros para el reporte.');
        }
        const data = [];
        let fecha = movimiento.movimiento.fecha;
        fecha = moment(fecha).format('DD/MM/YYYY');
        for (let i = 0; i < movimiento.detalle.length; i++) {
            const mov = {
                insumo: movimiento.detalle[i].insumo
                    ? movimiento.detalle[i].insumo.nombre
                    : '',
                cantidad: movimiento.detalle[i].cantidad,
                tipoUnidad: movimiento.detalle[i].insumo.tipoUnidad
                    ? movimiento.detalle[i].insumo.tipoUnidad.nombre
                    : '',
                lote: movimiento.detalle[i].lote
                    ? movimiento.detalle[i].lote.numero
                    : '',
                caducidad: movimiento.detalle[i].lote
                    ? movimiento.detalle[i].lote.caducidad
                    : '',
            };
            if (movimiento.detalle[i].lote && movimiento.detalle[i].lote.caducidad) {
                mov.caducidad = moment(movimiento.detalle[i].lote.caducidad).format('DD/MM/YYYY');
            }
            data.push(mov);
        }
        delete movimiento.detalle;
        const info = {
            tipoMov: movimiento.movimiento
                ? movimiento.movimiento.tipoMovimiento
                : '',
            sucOrigen: movimiento.movimiento && movimiento.movimiento.sucursalOrigen
                ? movimiento.movimiento.sucursalOrigen.nombre
                : '',
            sucDestino: movimiento.movimiento && movimiento.movimiento.sucursalDestino
                ? movimiento.movimiento.sucursalDestino.nombre
                : '',
            notas: movimiento.movimiento ? movimiento.movimiento.notas : '',
        };
        const bufferDoc = await this.heimalService.render('reportes/movimientos/movimiento', {
            movimiento: info,
            detalle: data,
            fecha,
        });
        res.set({
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "paginate", null);
__decorate([
    common_1.Post('paginate/requisicion'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "paginateRequisicion", null);
__decorate([
    common_1.Post('paginate/requisicion-sucursal'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginate_requisicion_sucursal_dto_1.RequisicionBySucursalDTO,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "paginateRequisicionbySucursal", null);
__decorate([
    common_1.Post('paginate/transferencia'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "paginateTransferencia", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_movimiento_dto_1.UpdateMovimientoDTO]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "update", null);
__decorate([
    common_1.Patch('status/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "delete", null);
__decorate([
    common_1.Get('filtro/:start?/:end?'),
    __param(0, common_1.Param('start')),
    __param(1, common_1.Param('end')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "filtroMovimientos", null);
__decorate([
    common_1.Post('descargar/movimiento'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    common_1.Header('Content-Disposition', 'attachment; filename=presupuesto.docx'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AlmacenController.prototype, "documento", null);
AlmacenController = __decorate([
    swagger_1.ApiTags('almacen'),
    common_1.Controller('almacen'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [almacen_service_1.AlmacenService,
        heimdal_service_1.HeimdalService])
], AlmacenController);
exports.AlmacenController = AlmacenController;
//# sourceMappingURL=almacen.controller.js.map