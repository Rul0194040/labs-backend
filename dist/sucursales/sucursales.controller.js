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
exports.SucursalesController = void 0;
const sucursalesInsumos_service_1 = require("./services/sucursalesInsumos.service");
const loginIdentity_dto_1 = require("./../auth/dto/loginIdentity.dto");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const createSucursal_dto_1 = require("./dto/createSucursal.dto");
const sucursales_service_1 = require("./services/sucursales.service");
const updateSucursal_dto_1 = require("./dto/updateSucursal.dto");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const sucursal_entity_1 = require("./sucursal.entity");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const createSucursalInsumo_dto_1 = require("./dto/createSucursalInsumo.dto");
const updateSucursalInsumo_dto_1 = require("./dto/updateSucursalInsumo.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const almacen_service_1 = require("../almacen/almacen.service");
const movimientosAlmacen_entity_1 = require("../almacen/movimientosAlmacen.entity");
const user_decorator_1 = require("../users/decorators/user.decorator");
const moment = require("moment");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const createApiKey_dto_1 = require("./dto/createApiKey.dto");
const users_entity_1 = require("../users/users.entity");
let SucursalesController = class SucursalesController {
    constructor(sucursalesService, sucursalesInsumosService, almacenService, heimalService) {
        this.sucursalesService = sucursalesService;
        this.sucursalesInsumosService = sucursalesInsumosService;
        this.almacenService = almacenService;
        this.heimalService = heimalService;
    }
    asegurarApiKeys() {
        return this.sucursalesService.asegurarApiKeys();
    }
    create(sucursal) {
        return this.sucursalesService.create(sucursal);
    }
    paginate(options) {
        return this.sucursalesService.paginate(options);
    }
    paginateMinimosMatriz(options) {
        return this.sucursalesInsumosService.paginateMinimosMatriz(options);
    }
    paginateRecibidosMatriz(options, user) {
        return this.almacenService.paginateRecibidosMatriz(options, user);
    }
    paginateTransito(options, user) {
        return this.almacenService.paginateTransito(options, user);
    }
    paginateTransitoParcial(options) {
        return this.almacenService.paginateTransitoParcial(options);
    }
    getById(id) {
        return this.sucursalesService.getById(id);
    }
    getSucursalMatriz() {
        return this.sucursalesService.getSucursalMatriz();
    }
    update(id, sucursal) {
        return this.sucursalesService.update(id, sucursal);
    }
    updateStatus(id, status) {
        return this.sucursalesService.updateStatus(id, status);
    }
    delete(id) {
        return this.sucursalesService.delete(id);
    }
    tranferir(idDestino, idOrigen, insumoData) {
        return this.sucursalesInsumosService.transferencia(idDestino, idOrigen, insumoData);
    }
    updateSucursalInsumo(data, idSucursal, idInsumo) {
        return this.sucursalesInsumosService.updateMinMaxSucursalInsumo(data, idSucursal, idInsumo);
    }
    cancelarTransferencia(movimientoId) {
        return this.sucursalesInsumosService.cancelarTransferencia(movimientoId);
    }
    paginateInsumosBySucursal(idSucursal, options) {
        return this.sucursalesInsumosService.paginateInsumosBySucursal(idSucursal, options);
    }
    paginateInsumosBySucursalSinExistencia(idSucursal, options) {
        return this.sucursalesInsumosService.paginateInsumosBySucursalSinExistencias(idSucursal, options);
    }
    async arqueo(res, id) {
        let sucursal = new sucursal_entity_1.SucursalEntity();
        sucursal = await this.sucursalesService.getById(id);
        if (!sucursal) {
            res.send('No hay registros para el reporte.');
        }
        const bufferDoc = await this.heimalService.render('reportes/sucursales/insumosBysucursal', {
            nombre: sucursal.nombre,
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
        });
        res.set({
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
    paginateInsumosByTipoInsumo(tipoInsumoId) {
        return this.sucursalesInsumosService.minimosBytipoInsumo(tipoInsumoId);
    }
    getUsersBySucursal(idSucursal) {
        return this.sucursalesService.getUsersBySucursal(idSucursal);
    }
    getAlmacenesBySucursal(idSucursal, options) {
        return this.almacenService.getAlmacenesAltasBajasBySucursal(idSucursal, options);
    }
    getAlmacenesTransferenciaBySucursal(idSucursal, options) {
        return this.almacenService.getAlmacenesTransferenciaBySucursal(idSucursal, options);
    }
    verificarTransferencia(data) {
        return this.sucursalesInsumosService.verificarTransferencia(data.movimiento, data.detalle);
    }
    insumosExistentesPaginate() {
        return this.sucursalesInsumosService.insumosExistentes();
    }
    insumosExistentesBySucursalPaginate(idSucursal) {
        return this.sucursalesInsumosService.insumosExistentesBySucursal(idSucursal);
    }
    insumosExistentesByRequisicion(movimientoId) {
        return this.almacenService.getInsumosByRequisicion(movimientoId);
    }
    async sucursales(res) {
        const outputFileName = 'salida.docx';
        const options = {
            sort: '',
            direction: 'ASC',
            skip: 0,
            take: 100,
            filters: {},
        };
        const response = await this.sucursalesService.paginate(options);
        if (!response.data.length) {
            res.send('No hay registros para el reporte.');
        }
        const bufferDoc = await this.heimalService.render('reportes/sucursales/listado', {
            sucursales: response.data,
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
        });
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename=' + outputFileName,
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
    async uploadMinimos(file) {
        return this.sucursalesInsumosService.procesarMinimosMaximos(file.path);
    }
    async updateInsumosSucursal(file, sucursalId) {
        return this.sucursalesInsumosService.importarInsumosSucursal(file.path, sucursalId);
    }
    async updateInsumosTodas(file) {
        return this.sucursalesInsumosService.importarInsumosTodas(file.path);
    }
    agergarApiKey(datos, sucursalId) {
        return this.sucursalesService.crearApiKey(sucursalId, datos.nombre);
    }
    desactivarApiKey(apiKey, status) {
        return this.sucursalesService.estatusApiKey(apiKey, status);
    }
    renombrarApiKey(datos, apiKey) {
        return this.sucursalesService.renameApiKey(apiKey, datos.nombre);
    }
    calculoMinMaxMatriz() {
        return this.sucursalesInsumosService.calcularMinimosMaximosMatriz();
    }
    async importarMinMaxSucursal(file, sucursalId) {
        return this.sucursalesInsumosService.importarMinMaxSucursal(file.path, sucursalId);
    }
};
__decorate([
    common_1.Get('asegurar/api/key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SucursalesController.prototype, "asegurarApiKeys", null);
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:sucursales'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createSucursal_dto_1.CreateSucursalDTO]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginate", null);
__decorate([
    common_1.Post('paginate/minimos-matriz'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateMinimosMatriz", null);
__decorate([
    common_1.Post('paginate/transferencias-recibidas/matriz'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateRecibidosMatriz", null);
__decorate([
    common_1.Post('paginate/transito-almacen'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateTransito", null);
__decorate([
    common_1.Post('paginate/transito-parcial'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateTransitoParcial", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "getById", null);
__decorate([
    common_1.Get('matriz/detail'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "getSucursalMatriz", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:sucursales'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateSucursal_dto_1.UpdateSucursalDTO]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:sucursales'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:sucursales'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "delete", null);
__decorate([
    common_1.Post(':idDestino/:idOrigen/insumo'),
    require_rule_decorator_1.RequireRule('create:sucursales'),
    __param(0, common_1.Param('idDestino', common_1.ParseIntPipe)),
    __param(1, common_1.Param('idOrigen', common_1.ParseIntPipe)),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, createSucursalInsumo_dto_1.CreateSucursalesInsumosDTO]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "tranferir", null);
__decorate([
    common_1.Put(':idSucursal/:idInsumo'),
    require_rule_decorator_1.RequireRule('update:sucursales'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(2, common_1.Param('idInsumo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateSucursalInsumo_dto_1.UpdateSucursalesInsumosDTO, Number, Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "updateSucursalInsumo", null);
__decorate([
    common_1.Put('cancelar/transferencia/:movimientoId'),
    require_rule_decorator_1.RequireRule('update:sucursales'),
    __param(0, common_1.Param('movimientoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "cancelarTransferencia", null);
__decorate([
    common_1.Post(':idSucursal/insumos/paginate'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateInsumosBySucursal", null);
__decorate([
    common_1.Post(':idSucursal/insumos/paginate/sin-existencias'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateInsumosBySucursalSinExistencia", null);
__decorate([
    common_1.Post(':sucursalId/insumos'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    common_1.Header('Content-Disposition', 'attachment; filename=presupuesto.docx'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "arqueo", null);
__decorate([
    common_1.Get('paginate/tipo-insumo/:id'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "paginateInsumosByTipoInsumo", null);
__decorate([
    common_1.Get(':idSucursal/usuarios'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "getUsersBySucursal", null);
__decorate([
    common_1.Post(':idSucursal/almacenes/altas-bajas/paginate'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "getAlmacenesBySucursal", null);
__decorate([
    common_1.Post(':idSucursal/almacenes/transferencia/paginate'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "getAlmacenesTransferenciaBySucursal", null);
__decorate([
    common_1.Post('verificar/transferencia'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "verificarTransferencia", null);
__decorate([
    common_1.Get('cantidad/insumos/minimo'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "insumosExistentesPaginate", null);
__decorate([
    common_1.Get(':idSucursal/cantidad/insumos/minimo'),
    require_rule_decorator_1.RequireRule('view:sucursales'),
    __param(0, common_1.Param('idSucursal', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "insumosExistentesBySucursalPaginate", null);
__decorate([
    common_1.Get('insumos/requisicion/:movimientoId'),
    __param(0, common_1.Param('movimientoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "insumosExistentesByRequisicion", null);
__decorate([
    common_1.Get('reporte/doc/listado'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "sucursales", null);
__decorate([
    common_1.Put('update/minimos-maximos/xls'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                (file.originalname.split('.').reverse()[0] === 'xls' ||
                    file.originalname.split('.').reverse()[0] === 'xlsx')) {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente xlsx y xls'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/xls';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "uploadMinimos", null);
__decorate([
    common_1.Put('update/insumos-sucursal/xls/:sucursalId'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                (file.originalname.split('.').reverse()[0] === 'xls' ||
                    file.originalname.split('.').reverse()[0] === 'xlsx')) {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente xlsx y xls'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/xls';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "updateInsumosSucursal", null);
__decorate([
    common_1.Put('update/insumos/xls/todas'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                (file.originalname.split('.').reverse()[0] === 'xls' ||
                    file.originalname.split('.').reverse()[0] === 'xlsx')) {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente xlsx y xls'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/xls';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "updateInsumosTodas", null);
__decorate([
    common_1.Put('generate/:sucursalId/apikey'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createApiKey_dto_1.CreateApiKeyDTO, Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "agergarApiKey", null);
__decorate([
    common_1.Patch('apikey/:apiKey/status/:status'),
    __param(0, common_1.Param('apiKey')),
    __param(1, common_1.Param('status', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "desactivarApiKey", null);
__decorate([
    common_1.Patch('apikey/:apiKey/rename'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createApiKey_dto_1.CreateApiKeyDTO, String]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "renombrarApiKey", null);
__decorate([
    common_1.Get('insumos/calculo/min-max/matriz'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "calculoMinMaxMatriz", null);
__decorate([
    common_1.Put('insumos/importar/min-max/sucursal/:sucursalId'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('archivo', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                (file.originalname.split('.').reverse()[0] === 'xls' ||
                    file.originalname.split('.').reverse()[0] === 'xlsx')) {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente xlsx y xls'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const dirPath = './uploads/xls';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                cb(null, dirPath);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SucursalesController.prototype, "importarMinMaxSucursal", null);
SucursalesController = __decorate([
    swagger_1.ApiTags('sucursales'),
    common_1.Controller('sucursales'),
    common_2.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sucursales_service_1.SucursalesService,
        sucursalesInsumos_service_1.SucursalesInsumosService,
        almacen_service_1.AlmacenService,
        heimdal_service_1.HeimdalService])
], SucursalesController);
exports.SucursalesController = SucursalesController;
//# sourceMappingURL=sucursales.controller.js.map