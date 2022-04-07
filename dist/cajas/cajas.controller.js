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
exports.CajasController = void 0;
const recibirDatos_dto_1 = require("./DTO/recibirDatos.dto");
const paginate_movimientos_caja_dto_1 = require("./DTO/paginate-movimientos-caja.dto");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const user_decorator_1 = require("../users/decorators/user.decorator");
const users_entity_1 = require("../users/users.entity");
const cajas_service_1 = require("./cajas.service");
const create_caja_dto_1 = require("./DTO/create-caja.dto");
const update_caja_dto_1 = require("./DTO/update-caja.dto");
const movimientos_caja_dto_1 = require("./DTO/movimientos-caja.dto");
const cerrar_caja_dto_1 = require("./DTO/cerrar-caja.dto");
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const cambiarStatusMovimiento_dto_1 = require("./DTO/cambiarStatusMovimiento.dto");
let CajasController = class CajasController {
    constructor(cajasService, heimalService) {
        this.cajasService = cajasService;
        this.heimalService = heimalService;
    }
    create(caja, user) {
        return this.cajasService.create(caja, user);
    }
    paginate(options) {
        return this.cajasService.paginate(options);
    }
    paginatemovCaja(id, options) {
        return this.cajasService.movimientosCaja(id, options.movimiento, options.options);
    }
    cancelacionesCaja(id) {
        return this.cajasService.movimientosCancelados(id);
    }
    retirosCaja(id) {
        return this.cajasService.movimientosRetiros(id);
    }
    depositosCaja(id) {
        return this.cajasService.movimientosDepositos(id);
    }
    solicitarCancelacion(idMovimiento, idCaja, cambiarStatus) {
        return this.cajasService.solicitarCancelacion(idMovimiento, idCaja, cambiarStatus);
    }
    paginateUserCaja(options, user) {
        return this.cajasService.cajasUsuario(user, options);
    }
    paginateventasCaja(user, options) {
        return this.cajasService.ventasCaja(user, options);
    }
    getById(id) {
        return this.cajasService.getById(id);
    }
    update(id, caja) {
        return this.cajasService.update(id, caja);
    }
    updateEntregada(id, datosCaja) {
        return this.cajasService.setEntregada(id, datosCaja);
    }
    updateContabilizada(id) {
        return this.cajasService.setContabilizada(id);
    }
    delete(id) {
        return this.cajasService.delete(id);
    }
    consultarCaja(user) {
        return this.cajasService.consultarCajaUsuario(user);
    }
    crearDeposito(user, depositoData) {
        return this.cajasService.crearDeposito(user, depositoData, false);
    }
    crearRetiro(user, depositoData) {
        return this.cajasService.crearRetiro(user, depositoData);
    }
    getTotalMovimientosByCaja(user) {
        return this.cajasService.getTotalMovimientosByCaja(user);
    }
    getCajasCerradasPorSucursal(sucursalId, user) {
        return this.cajasService.getCajasCerradasPorSucursal(sucursalId, user);
    }
    getCortePorCaja(cajaId) {
        return this.cajasService.getCortePorCaja(cajaId);
    }
    contabilizarCajas(sucursalId, user) {
        return this.cajasService.contabilizarCajas(sucursalId, user);
    }
    cerrarCaja(user, caja) {
        return this.cajasService.cerrarCaja(user, caja);
    }
    async arqueo(res, id) {
        const depositos = await this.cajasService.movimientosDepositos(id);
        const retiros = await this.cajasService.movimientosRetiros(id);
        depositos.forEach((element) => {
            element.createdAt = moment(element.createdAt).format('DD/MM/YYYY [a las] HH:mm:ss');
        });
        retiros.forEach((element) => {
            element.createdAt = moment(element.createdAt).format('DD/MM/YYYY [a las] HH:mm:ss');
        });
        const cajaInfo = await this.cajasService.getInfoForDoc(id);
        cajaInfo.caja.fechaApertura = moment(cajaInfo.caja.fechaApertura).format('DD/MM/YYYY [a las] HH:mm:ss');
        cajaInfo.caja.fechaCierre = moment(cajaInfo.caja.fechaCierre).format('DD/MM/YYYY [a las] HH:mm:ss');
        const bufferDoc = await this.heimalService.render('reportes/caja/arqueo', {
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
            nameSucursal: cajaInfo.sucursal.nombre,
            nameUsuario: `${cajaInfo.usuario.firstName} ${cajaInfo.usuario.lastName}`,
            caja: cajaInfo.caja,
            movimientos: cajaInfo.dataResult,
            depositos: depositos,
            retiros: retiros,
        });
        res.set({
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:caja'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_caja_dto_1.CreateCajaDTO,
        users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "paginate", null);
__decorate([
    common_1.Post('paginate/movimientos-caja/:id'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginate_movimientos_caja_dto_1.PaginateMovimientosCajaDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "paginatemovCaja", null);
__decorate([
    common_1.Get('movimientos-cancelados/:id'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "cancelacionesCaja", null);
__decorate([
    common_1.Get('movimientos-retiros/:id'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "retirosCaja", null);
__decorate([
    common_1.Get('movimientos-depositos/:id'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "depositosCaja", null);
__decorate([
    common_1.Post('cancelar-movimiento/:idMovimiento/caja/:idCaja'),
    require_rule_decorator_1.RequireRule('update:cajas'),
    __param(0, common_1.Param('idMovimiento', common_1.ParseIntPipe)),
    __param(1, common_1.Param('idCaja', common_1.ParseIntPipe)),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, cambiarStatusMovimiento_dto_1.CambiarStatusMovimientoDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "solicitarCancelacion", null);
__decorate([
    common_1.Post('paginate/cajas-usuario'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "paginateUserCaja", null);
__decorate([
    common_1.Post('paginate/ventas-caja'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO,
        paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "paginateventasCaja", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_caja_dto_1.UpdateCajaDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "update", null);
__decorate([
    common_1.Put('setEntrega/:id'),
    require_rule_decorator_1.RequireRule('update:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, recibirDatos_dto_1.RecibirDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "updateEntregada", null);
__decorate([
    common_1.Put('setContabilizada/:id'),
    require_rule_decorator_1.RequireRule('update:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "updateContabilizada", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:cajas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "delete", null);
__decorate([
    common_1.Get('consultar/estatus'),
    require_rule_decorator_1.RequireRule('view:cajas'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "consultarCaja", null);
__decorate([
    common_1.Post('deposito'),
    require_rule_decorator_1.RequireRule('create:caja'),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UsersEntity,
        movimientos_caja_dto_1.MovimientosCajaDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "crearDeposito", null);
__decorate([
    common_1.Post('retiro'),
    require_rule_decorator_1.RequireRule('create:caja'),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UsersEntity,
        movimientos_caja_dto_1.MovimientosCajaDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "crearRetiro", null);
__decorate([
    common_1.Get('total/movimientos'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UsersEntity]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "getTotalMovimientosByCaja", null);
__decorate([
    common_1.Get('cerradas/sucursal/:sucursalId'),
    __param(0, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "getCajasCerradasPorSucursal", null);
__decorate([
    common_1.Get('corte/caja/:cajaId'),
    __param(0, common_1.Param('cajaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "getCortePorCaja", null);
__decorate([
    common_1.Put('generar/arqueo/cajas-cerradas/:sucursalId'),
    __param(0, common_1.Param('sucursalId', common_1.ParseIntPipe)),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "contabilizarCajas", null);
__decorate([
    common_1.Put('cerrar/caja'),
    __param(0, user_decorator_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginIdentity_dto_1.LoginIdentityDTO,
        cerrar_caja_dto_1.CerrarCajaDTO]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "cerrarCaja", null);
__decorate([
    common_1.Post('generar/arqueo'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    common_1.Header('Content-Disposition', 'attachment; filename=arqueo.docx'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CajasController.prototype, "arqueo", null);
CajasController = __decorate([
    swagger_1.ApiTags('cajas'),
    common_1.Controller('cajas'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cajas_service_1.CajasService,
        heimdal_service_1.HeimdalService])
], CajasController);
exports.CajasController = CajasController;
//# sourceMappingURL=cajas.controller.js.map