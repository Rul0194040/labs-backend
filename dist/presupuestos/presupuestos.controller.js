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
exports.PresupuestosController = void 0;
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const presupuestosDetalle_entity_1 = require("./presupuestosDetalle.entity");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const update_presupuesto_dto_1 = require("./DTO/update-presupuesto.dto");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const create_presupuesto_dto_1 = require("./DTO/create-presupuesto.dto");
const presupuestos_service_1 = require("./presupuestos.service");
const user_decorator_1 = require("../users/decorators/user.decorator");
const EstatusPresupuesto_enum_1 = require("./EstatusPresupuesto.enum");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const moment = require("moment");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const presupuesto_entity_1 = require("./presupuesto.entity");
let PresupuestosController = class PresupuestosController {
    constructor(presupuestoServices, heimalService) {
        this.presupuestoServices = presupuestoServices;
        this.heimalService = heimalService;
    }
    create(presupuesto, user) {
        return this.presupuestoServices.create(presupuesto, user);
    }
    paginate(options) {
        return this.presupuestoServices.paginate(options);
    }
    UpdateInsumoDetalle(id, presupuesto) {
        return this.presupuestoServices.UpdateInsumoDetallePresupuesto(id, presupuesto);
    }
    getById(id) {
        return this.presupuestoServices.getById(id);
    }
    update(id, presupuesto) {
        return this.presupuestoServices.updateDetallePresupuesto(id, presupuesto);
    }
    updateStatus(id, estatus) {
        return this.presupuestoServices.updateStatus(id, estatus);
    }
    delete(id) {
        return this.presupuestoServices.deletePresupuestoDetalle(id);
    }
    EnviarCompra(idPresupuesto, proveedorSeleccionadoId) {
        return this.presupuestoServices.sendToProveedor(idPresupuesto, proveedorSeleccionadoId);
    }
    async sendPres(res, id, proveedorSeleccionadoId) {
        const presupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(id);
        if (!presupuesto) {
            res.send('No hay registros para el reporte.');
        }
        const Detalle = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
            .createQueryBuilder('detalle')
            .leftJoinAndSelect('detalle.insumo', 'insumo')
            .where('detalle.presupuestoId=:id AND detalle.proveedorSeleccionadoId=:proveedorSeleccionadoId', {
            id: presupuesto.id,
            proveedorSeleccionadoId,
        })
            .getMany();
        let totalPresupuesto = 0;
        for (const det of Detalle) {
            totalPresupuesto += det.precioSeleccionado;
        }
        const totalIva = totalPresupuesto + totalPresupuesto * 0.16;
        const proveedor = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne(proveedorSeleccionadoId);
        let fechaPresupuesto = presupuesto.createdAt;
        fechaPresupuesto = moment(fechaPresupuesto).format('DD/MM/YYYY');
        const formato = {
            presupuesto: presupuesto,
            detalle: Detalle,
        };
        const bufferDoc = await this.heimalService.render('reportes/presupuestos/presupuesto', {
            formatoPresupuesto: formato,
            fechaPresupuesto,
            proveedor,
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
            totalPresupuesto,
            totalIva,
        }, 'pdf');
        console.log(bufferDoc);
        res.set({
            'Content-Length': bufferDoc.length,
        });
        res.end(bufferDoc);
    }
};
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:presupuesto'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_presupuesto_dto_1.CreatePresupuestoDTO,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "create", null);
__decorate([
    common_1.Post('paginate'),
    require_rule_decorator_1.RequireRule('view:presupuestos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "paginate", null);
__decorate([
    common_1.Post('create-detalle-presupuesto/:id'),
    require_rule_decorator_1.RequireRule('view:presupuestos'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_presupuesto_dto_1.UpdatePresupuestoDTO]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "UpdateInsumoDetalle", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:presupuestos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "getById", null);
__decorate([
    common_1.Put(':id'),
    require_rule_decorator_1.RequireRule('update:presupuestos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_presupuesto_dto_1.UpdatePresupuestoDTO]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "update", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:presupuestos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('estatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "updateStatus", null);
__decorate([
    common_1.Delete('detalle/:id'),
    require_rule_decorator_1.RequireRule('delete:presupuestos'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "delete", null);
__decorate([
    common_1.Post('enviar-presupuesto/:idPresupuesto'),
    __param(0, common_1.Param('idPresupuesto', common_1.ParseIntPipe)),
    __param(1, common_1.Body('proveedorSeleccionadoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "EnviarCompra", null);
__decorate([
    common_1.Post('generar/presupuesto'),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=presupuesto.pdf'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('id', common_1.ParseIntPipe)),
    __param(2, common_1.Body('proveedorSeleccionadoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PresupuestosController.prototype, "sendPres", null);
PresupuestosController = __decorate([
    swagger_1.ApiTags('presupuestos'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('presupuestos'),
    __metadata("design:paramtypes", [presupuestos_service_1.PresupuestosService,
        heimdal_service_1.HeimdalService])
], PresupuestosController);
exports.PresupuestosController = PresupuestosController;
//# sourceMappingURL=presupuestos.controller.js.map