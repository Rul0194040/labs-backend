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
exports.ComprasController = void 0;
const detalle_compra_dto_1 = require("./DTO/detalle-compra.dto");
const generar_orden_dto_1 = require("./DTO/generar-orden.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const compras_service_1 = require("./compras.service");
const informe_compra_dto_1 = require("./DTO/informe-compra.dto");
const get_compra_dto_1 = require("./DTO/get-compra.dto");
const agregarInsumoDetalle_dto_1 = require("./DTO/agregarInsumoDetalle.dto");
const moment = require("moment");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const altaBycompra_dto_1 = require("./DTO/altaBycompra.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const user_decorator_1 = require("../users/decorators/user.decorator");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
const fileResult_dto_1 = require("../common/DTO/fileResult.dto");
let ComprasController = class ComprasController {
    constructor(compraService, heimalService) {
        this.compraService = compraService;
        this.heimalService = heimalService;
    }
    create(compra) {
        return this.compraService.create(compra);
    }
    generarCompra(compra) {
        return this.compraService.generarOrden(compra);
    }
    paginate(options) {
        return this.compraService.paginate(options);
    }
    getById(id) {
        return this.compraService.getById(id);
    }
    createDetalle(compraId, detalle) {
        return this.compraService.createDetalleCompra(compraId, detalle);
    }
    FinalizarOrdenCompra(compraId, data, user) {
        return this.compraService.altaBycompra(compraId, data, user);
    }
    EnviarCompra(compraId) {
        return this.compraService.sendToProveedor(compraId);
    }
    updateDetalle(detalleId, detalle) {
        return this.compraService.UpdateDetalleCompra(detalleId, detalle);
    }
    updateClave(id, clave) {
        return this.compraService.UpdateCompraClave(id, clave);
    }
    updateStatus(id, status) {
        return this.compraService.updateStatus(id, status);
    }
    delete(id) {
        return this.compraService.delete(id);
    }
    deleteDetalle(id) {
        return this.compraService.deleteDetalleCompras(id);
    }
    updateCotizacion(file, id, numCotizacion) {
        return this.compraService.importarCotizacion(id, numCotizacion, file.filename);
    }
    async descargarCotizacion(id, res) {
        const file = await this.compraService.descargarCotizacion(id);
        res.sendFile(file, {
            root: `./uploads/cotizaciones`,
        });
    }
    async arqueo(res, id) {
        let compra = new get_compra_dto_1.GetCompraDTO();
        compra = await this.compraService.getById(id);
        if (!compra) {
            res.send('No hay registros para el reporte.');
        }
        let fechaCompra = compra.compra.fecha;
        fechaCompra = moment(fechaCompra).format('DD/MM/YYYY');
        let total = 0;
        for (const det of compra.detalle) {
            total = det.cantidad * det.precio;
        }
        const totalIva = total + total * 0.16;
        let bufferDoc;
        if (compra.compra.conClave) {
            bufferDoc = await this.heimalService.render('reportes/compras/ordenCompra', {
                orden: compra,
                fechaCompra: fechaCompra,
                fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
                total,
                totalIva,
            }, 'pdf');
        }
        else {
            bufferDoc = await this.heimalService.render('reportes/compras/ordenCompra_sinClave', {
                orden: compra,
                fechaCompra: fechaCompra,
                fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
                total,
                totalIva,
            }, 'pdf');
        }
        res.set({
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:compra'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [informe_compra_dto_1.InformeCompraDTO]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "create", null);
__decorate([
    common_1.Post('orden'),
    require_rule_decorator_1.RequireRule('create:compra'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generar_orden_dto_1.GenerarOrdenDTO]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "generarCompra", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:compras'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "paginate", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:compras'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "getById", null);
__decorate([
    common_1.Post('detalleCompra/:compraId'),
    require_rule_decorator_1.RequireRule('update:compras'),
    __param(0, common_1.Param('compraId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, agregarInsumoDetalle_dto_1.AgregarInsumoDTO]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "createDetalle", null);
__decorate([
    common_1.Post('ordenCompra/:compraId'),
    require_rule_decorator_1.RequireRule('update:compras'),
    __param(0, common_1.Param('compraId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, altaBycompra_dto_1.AltaByCompraDTO,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "FinalizarOrdenCompra", null);
__decorate([
    common_1.Post('enviar-compra/:compraId'),
    __param(0, common_1.Param('compraId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "EnviarCompra", null);
__decorate([
    common_1.Put('detalleCompra/:detalleId'),
    require_rule_decorator_1.RequireRule('update:compras'),
    __param(0, common_1.Param('detalleId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, detalle_compra_dto_1.DetalleCompraDTO]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "updateDetalle", null);
__decorate([
    common_1.Put('conClave/:id'),
    require_rule_decorator_1.RequireRule('update:compras'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('clave')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "updateClave", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:compras'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:compras'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "delete", null);
__decorate([
    common_1.Delete('detalle-compras/:id'),
    require_rule_decorator_1.RequireRule('delete:compras'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "deleteDetalle", null);
__decorate([
    common_1.Put('cotizacion/importar/:id/:numCotizacion'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('cotizacion', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['application/pdf'];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                file.originalname.split('.').reverse()[0] === 'pdf') {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente pdf'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/cotizaciones/';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
            filename: (req, file, cb) => {
                const fileNameDest = file.originalname;
                cb(null, fileNameDest);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __param(2, common_1.Param('numCotizacion', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fileResult_dto_1.FileResultDTO, Number, Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "updateCotizacion", null);
__decorate([
    common_1.Get('descargar/cotizacion/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "descargarCotizacion", null);
__decorate([
    common_1.Post('generar/orden-compra'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=presupuesto.pdf'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "arqueo", null);
ComprasController = __decorate([
    swagger_1.ApiTags('compras'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('compras'),
    __metadata("design:paramtypes", [compras_service_1.ComprasService,
        heimdal_service_1.HeimdalService])
], ComprasController);
exports.ComprasController = ComprasController;
//# sourceMappingURL=compras.controller.js.map