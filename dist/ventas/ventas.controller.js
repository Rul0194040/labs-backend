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
var VentasController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasController = void 0;
const updateSegumientoVenta_dto_1 = require("./../pagos/dtos/updateSegumientoVenta.dto");
const transaccion_dto_1 = require("./DTOs/transaccion.dto");
const pagos_entity_1 = require("../pagos/pagos.entity");
const create_detalle_dto_1 = require("./DTOs/create-detalle.dto");
const loginIdentity_dto_1 = require("./../auth/dto/loginIdentity.dto");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const require_rule_decorator_1 = require("../users/decorators/require-rule.decorator");
const cliente_venta_dto_1 = require("./DTOs/cliente-venta.dto");
const paciente_venta_dto_1 = require("./DTOs/paciente-venta.dto");
const create_venta_dto_1 = require("./DTOs/create-venta.dto");
const estadosVentas_enum_1 = require("./estadosVentas.enum");
const ventas_entity_1 = require("./ventas.entity");
const ventas_service_1 = require("./ventas.service");
const user_decorator_1 = require("../users/decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
const update_credito_dto_1 = require("./DTOs/update-credito.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt/jwt-auth.guard");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const autorizar_descuento_dto_1 = require("./DTOs/autorizar-descuento.dto");
const email_service_1 = require("../common/services/mailer/email.service");
const send_email_resultados_dto_1 = require("./DTOs/send-email-resultados.dto");
const maquilador_venta_dto_1 = require("./DTOs/maquilador-venta.dto");
const captador_venta_dto_1 = require("./DTOs/captador-venta.dto");
const users_entity_1 = require("../users/users.entity");
const vendedor_venta_dto_1 = require("./DTOs/vendedor-venta.dto");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const logger_1 = require("../logger");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
let VentasController = VentasController_1 = class VentasController {
    constructor(ventasService, heimalService, mailSenderService, whatsapService, configService) {
        this.ventasService = ventasService;
        this.heimalService = heimalService;
        this.mailSenderService = mailSenderService;
        this.whatsapService = whatsapService;
        this.configService = configService;
        this.logger = new logger_1.MyLogger(VentasController_1.name);
    }
    paginate(cajaId, options) {
        return this.ventasService.paginate(cajaId, options);
    }
    paginateSegumiento(options, user) {
        return this.ventasService.paginateSeguimientoVenta(user, options);
    }
    paginateVentasClientes(options) {
        return this.ventasService.paginateVentasClientes(options);
    }
    getDetalleVentaPorId(detalleVentaId) {
        return this.ventasService.getDetalleVentaPorId(detalleVentaId);
    }
    insumosADetalle(ventaDetalleId, detalles, user) {
        return this.ventasService.insumosADetalle(detalles, ventaDetalleId, user);
    }
    insumosFueraDetalle(VentasInsumoId) {
        return this.ventasService.insumosADetalleRetiro(VentasInsumoId);
    }
    getInsumoDetallePorVenta(ventaId) {
        return this.ventasService.getInsumoDetallePorVenta(ventaId);
    }
    getInsumosPorDetalleVenta(detalleVentaId) {
        return this.ventasService.getInsumosPorDetalleVenta(detalleVentaId);
    }
    updateEstadoDetalleVenta(detalleVentaId) {
        return this.ventasService.updateEstadoDetalleVenta(detalleVentaId);
    }
    updateEstadosDetalleVenta(ventaId, estado) {
        return this.ventasService.updateEstadosDetalleVenta(ventaId, estado);
    }
    async interaccionWhatsapp(ventaId) {
        const venta = await this.ventasService.getById(ventaId);
        if (!venta.paciente.telefono) {
            return false;
        }
        const prefix = this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_PREFIX);
        const nombreEmpresa = this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_EMPRESA);
        const mensaje = `Hola ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno}
    
Nos comunicamos de *${nombreEmpresa}* para agradecer su preferencia.
    
Que tenga un excelente día.`;
        const result = await this.whatsapService.send(mensaje, `${prefix}${venta.paciente.telefono}`);
        this.logger.log('Mensaje interaccion:::' + mensaje);
        this.logger.log(`Envio interaccion-whatsapp :: ${prefix}${venta.paciente.telefono} ` +
            JSON.stringify(result));
        return result;
    }
    async encuestaWhatsapp(ventaId) {
        const venta = await this.ventasService.getById(ventaId);
        if (!venta.paciente.telefono) {
            return false;
        }
        const prefix = this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_PREFIX);
        const nombreEmpresa = this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_EMPRESA);
        const urlEncuesta = 'https://forms.gle/sdxkVFKJTaptFhGGA';
        const mensaje = `Hola ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno} en *${nombreEmpresa}* agradecemos su preferencia, esperamos pueda tomar dos minutos de su tiempo para responder una breve encuesta de satisfacción: ${urlEncuesta} 
    
Su participación nos permite brindarle un mejor servicio. 
    
¡Muchas gracias!`;
        const result = await this.whatsapService.send(mensaje, `${prefix}${venta.paciente.telefono}`);
        this.logger.log('Mensaje encuesta-whatsapp:::' + mensaje);
        this.logger.log(`Envio encuesta-whatsapp :: ${prefix}${venta.paciente.telefono} ` +
            JSON.stringify(result));
        return result;
    }
    CreateDetalle(asignacion) {
        return this.ventasService.CreateDetalle(asignacion);
    }
    removeCliente(id) {
        return this.ventasService.removeCliente(id);
    }
    finalizarVenta(ventaId) {
        return this.ventasService.FinalizadoVenta(ventaId);
    }
    Transaccion(id, montos) {
        return this.ventasService.updateTransaccion(id, montos);
    }
    removeDetalle(id) {
        return this.ventasService.removeDetalle(id);
    }
    clienteAVenta(asignacion) {
        return this.ventasService.ClienteAVenta(asignacion);
    }
    maquiladorAVenta(asignacion) {
        return this.ventasService.MaquiladorAVenta(asignacion);
    }
    captadorAVenta(asignacion) {
        return this.ventasService.CaptadorAVenta(asignacion);
    }
    vendedorAVenta(asignacion) {
        return this.ventasService.VendedorAVenta(asignacion);
    }
    PacienteAVenta(asignacion) {
        return this.ventasService.PacienteAVenta(asignacion);
    }
    create(venta, user) {
        return this.ventasService.create(venta, user);
    }
    getById(id) {
        return this.ventasService.getById(id);
    }
    getVentasCreditoCliente(clienteId, options) {
        return this.ventasService.getVentasCreditoCliente(clienteId, options);
    }
    getpagosByVentas(ventaId) {
        return this.ventasService.getPagosByVenta(ventaId);
    }
    solicitarCancelacion(ventaId, motivoCancelacion) {
        return this.ventasService.solicitarCancelacion(ventaId, motivoCancelacion);
    }
    getDetalleVentaById(id) {
        return this.ventasService.getDetalleVentaById(id);
    }
    async getventaByFolio(folioId) {
        return await this.ventasService.getventaByFolio(folioId);
    }
    updateStatus(id, status) {
        return this.ventasService.updateStatus(id, status);
    }
    updateVenta(id, body) {
        return this.ventasService.updateVenta(id, body);
    }
    delete(id) {
        return this.ventasService.delete(id);
    }
    updateCredito(id, credito) {
        return this.ventasService.updateCredito(id, credito);
    }
    async ticket(id) {
        return await this.ventasService.getTicketVenta(id);
    }
    autorizarDescuento(ventaId, data) {
        return this.ventasService.autorizarDescuento(ventaId, data);
    }
    paginateVentasPaciente(options) {
        return this.ventasService.paginateVentasPaciente(options);
    }
    async cotizacion(id) {
        return await this.ventasService.getTicketVenta(id);
    }
    paginateMovil(options) {
        return this.ventasService.paginateMovil(options);
    }
    updateSeguimientoVenta(ventaId, pago) {
        return this.ventasService.updateSeguimientoVenta(ventaId, pago);
    }
    async uploadAvatar(file) {
        return file;
    }
    async getPdf(uuid, res) {
        const file = await this.ventasService.getPdfUrl(uuid);
        res.sendFile(file + '.PDF', {
            root: `./uploads/pxlab`,
        });
    }
    async emailPdfPaciente(uuid, data) {
        const venta = await this.ventasService.getByUuid(uuid);
        const file = await this.ventasService.getPdfUrl(uuid);
        this.mailSenderService.send({
            to: data.email,
            subject: `Resultados de Laboratorio, Paciente: ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno}`,
            attachments: [
                {
                    path: './uploads/pxlab/' + file + '.PDF',
                },
            ],
        }, 'ventas/envio-estudios-paciente', {
            venta,
        });
    }
    getMaquiladoresVendedoresCaptadores() {
        return this.ventasService.getMaquiladoresVendedoresCaptadores();
    }
};
__decorate([
    common_1.Post('paginate/:cajaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('cajaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "paginate", null);
__decorate([
    common_1.Post('seguimiento-venta/paginate'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "paginateSegumiento", null);
__decorate([
    common_1.Post('paginate/clientes/registrados'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "paginateVentasClientes", null);
__decorate([
    common_1.Get('detalle-venta/:detalleVentaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('detalleVentaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getDetalleVentaPorId", null);
__decorate([
    common_1.Post('asignacion/detalle-insumos/:ventaDetalleId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('ventaDetalleId')),
    __param(1, common_1.Body('detalles')),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "insumosADetalle", null);
__decorate([
    common_1.Put('borrado/detalle-insumos/:VentasInsumoId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('VentasInsumoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "insumosFueraDetalle", null);
__decorate([
    common_1.Get('detalle-insumos/:ventaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('ventaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getInsumoDetallePorVenta", null);
__decorate([
    common_1.Get('detalle-venta-insumos/:detalleVentaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('detalleVentaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getInsumosPorDetalleVenta", null);
__decorate([
    common_1.Patch('detalle-venta-estado/:detalleVentaId'),
    __param(0, common_1.Param('detalleVentaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateEstadoDetalleVenta", null);
__decorate([
    common_1.Patch('detalles-venta-estado/:ventaId'),
    __param(0, common_1.Param('ventaId')),
    __param(1, common_1.Body('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateEstadosDetalleVenta", null);
__decorate([
    common_1.Patch(':ventaId/interaccion-whatsapp'),
    __param(0, common_1.Param('ventaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "interaccionWhatsapp", null);
__decorate([
    common_1.Patch(':ventaId/encuesta-whatsapp'),
    __param(0, common_1.Param('ventaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "encuestaWhatsapp", null);
__decorate([
    common_1.Post('asignacion/detalle'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detalle_dto_1.AsignDetalleDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "CreateDetalle", null);
__decorate([
    common_1.Put('remover/cliente-venta/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "removeCliente", null);
__decorate([
    common_1.Put('finalizar/:ventaId'),
    __param(0, common_1.Param('ventaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "finalizarVenta", null);
__decorate([
    common_1.Put('hacer-transaccion/:id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, transaccion_dto_1.TransaccionDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "Transaccion", null);
__decorate([
    common_1.Delete('remover/detalle/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "removeDetalle", null);
__decorate([
    common_1.Put('asignacion/cliente-venta'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cliente_venta_dto_1.ClienteVentaDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "clienteAVenta", null);
__decorate([
    common_1.Put('asignacion/maquilador-venta'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maquilador_venta_dto_1.MaquiladorVentaDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "maquiladorAVenta", null);
__decorate([
    common_1.Put('asignacion/captador-venta'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [captador_venta_dto_1.CaptadorVentaDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "captadorAVenta", null);
__decorate([
    common_1.Put('asignacion/vendedor-venta'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendedor_venta_dto_1.VendedorVentaDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "vendedorAVenta", null);
__decorate([
    common_1.Put('asignacion/paciente-venta'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paciente_venta_dto_1.PacienteVentaDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "PacienteAVenta", null);
__decorate([
    common_1.Post(),
    require_rule_decorator_1.RequireRule('create:ventas'),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venta_dto_1.CreateVentaDTO,
        loginIdentity_dto_1.LoginIdentityDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "create", null);
__decorate([
    common_1.Get(':id'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getById", null);
__decorate([
    common_1.Post('credito/clientes/:clienteId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('clienteId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getVentasCreditoCliente", null);
__decorate([
    common_1.Get('pagos/:ventaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('ventaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getpagosByVentas", null);
__decorate([
    common_1.Put('solicitar-cancelacion/:ventaId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('ventaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body('motivoCancelacion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "solicitarCancelacion", null);
__decorate([
    common_1.Get(':id/detalle-servicios'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getDetalleVentaById", null);
__decorate([
    common_1.Get('folio/:folioId'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('folioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getventaByFolio", null);
__decorate([
    common_1.Patch(':id/status'),
    require_rule_decorator_1.RequireRule('update:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateStatus", null);
__decorate([
    common_1.Patch(':id'),
    require_rule_decorator_1.RequireRule('delete:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ventas_entity_1.VentaEntity]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateVenta", null);
__decorate([
    common_1.Delete(':id'),
    require_rule_decorator_1.RequireRule('delete:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "delete", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_credito_dto_1.UpdateCreditoDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateCredito", null);
__decorate([
    common_1.Get('ticket-venta/:id'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "ticket", null);
__decorate([
    common_1.Put('autorizar/descuento/:ventaId'),
    __param(0, common_1.Param('ventaId', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, autorizar_descuento_dto_1.AutorizarDescuentoDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "autorizarDescuento", null);
__decorate([
    common_1.Post('paginate/paciente/vencidos'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "paginateVentasPaciente", null);
__decorate([
    common_1.Get('cotizacion-venta/:id'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "cotizacion", null);
__decorate([
    common_1.Post('movil/paginate'),
    require_rule_decorator_1.RequireRule('view:ventas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationPrimeNg_dto_1.PaginationOptions]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "paginateMovil", null);
__decorate([
    common_1.Patch('update/seguimiento-venta/:ventaId'),
    __param(0, common_1.Param('ventaId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateSegumientoVenta_dto_1.updateSeguimientoVenta]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "updateSeguimientoVenta", null);
__decorate([
    common_1.Post('UpdateResultado/:folioPxLab'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('folioPxLab', {
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['application/pdf'];
            if (allowedTypes.indexOf(file.mimetype) > -1 &&
                file.originalname.split('.').reverse()[0] === 'pdf') {
                return cb(null, true);
            }
            return cb(new Error('Tipo de archivo no aceptado, se aceptan solamente "application/pdf".'), false);
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const folio = req.params.folioPxLab;
                const dirPath = './uploads/resultados';
                if (!fs_1.existsSync(`${dirPath}`)) {
                    fs_1.mkdirSync(`${dirPath}`, { recursive: true });
                }
                if (fs_1.existsSync(`${dirPath}/${folio}.pdf`)) {
                    fs_1.unlinkSync(`${dirPath}/${folio}.pdf`);
                }
                cb(null, dirPath);
            },
            filename: (req, file, cb) => {
                const folio = req.params.folioPxLab;
                const fileNameDest = `${folio}.pdf`;
                cb(null, fileNameDest);
            },
        }),
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "uploadAvatar", null);
__decorate([
    common_1.Get(':uuid/pdf/resultados'),
    __param(0, common_1.Param('uuid')),
    __param(1, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getPdf", null);
__decorate([
    common_1.Put(':uuid/pdf/send'),
    __param(0, common_1.Param('uuid')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_email_resultados_dto_1.SendEmailResultadosDTO]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "emailPdfPaciente", null);
__decorate([
    common_1.Get('catalogos/captadores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "getMaquiladoresVendedoresCaptadores", null);
VentasController = VentasController_1 = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('ventas'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('ventas'),
    __metadata("design:paramtypes", [ventas_service_1.VentasService,
        heimdal_service_1.HeimdalService,
        email_service_1.MailService,
        whatsapp_service_1.WhatsappService,
        config_1.ConfigService])
], VentasController);
exports.VentasController = VentasController;
//# sourceMappingURL=ventas.controller.js.map