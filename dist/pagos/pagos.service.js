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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const pagos_entity_1 = require("./pagos.entity");
const ventas_entity_1 = require("../ventas/ventas.entity");
const cajas_entity_1 = require("../cajas/cajas.entity");
const estatusCaja_enum_1 = require("../cajas/estatusCaja.enum");
const tiposMovimientoCaja_enum_1 = require("../common/enum/tiposMovimientoCaja.enum");
const movimientos_caja_entity_1 = require("../cajas/movimientos-caja.entity");
const estadosVentas_enum_1 = require("../ventas/estadosVentas.enum");
const moment = require("moment");
const convertidor = require("numero-a-letras");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const ventas_service_1 = require("../ventas/ventas.service");
const ventasDetalle_entity_1 = require("../ventas/ventasDetalle.entity");
const profiles_enum_1 = require("../users/profiles.enum");
let PagosService = class PagosService {
    constructor(pxService, ventasService) {
        this.pxService = pxService;
        this.ventasService = ventasService;
    }
    async create(pago, user) {
        var _a;
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(pago.ventaId);
        if (!pago.fechaHora) {
            pago.fechaHora = moment().toDate();
        }
        if (!venta) {
            throw new common_1.HttpException('La venta no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (venta.pagado) {
            throw new common_1.HttpException('La venta ya esta pagada', common_1.HttpStatus.BAD_REQUEST);
        }
        let caja;
        let cajaQuery;
        let enviadoPx = false;
        if ((user === null || user === void 0 ? void 0 : user.profile) === profiles_enum_1.ProfileTypes.SUCURSAL) {
            cajaQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
                .createQueryBuilder('caja')
                .leftJoin('caja.usuario', 'usuario')
                .leftJoin('caja.sucursal', 'sucursal')
                .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
                usuarioId: user.id,
                sucursalId: (_a = user.sucursal) === null || _a === void 0 ? void 0 : _a.id,
            })
                .andWhere('estatus = :cajaEstatus', {
                cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
            });
            caja = await cajaQuery.getOne();
            if (!caja) {
                throw new common_1.HttpException('El usuario no tiene una caja abierta', common_1.HttpStatus.NOT_FOUND);
            }
        }
        if (venta.estatus === estadosVentas_enum_1.EstadosVentas.BORRADOR) {
            await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, { estatus: estadosVentas_enum_1.EstadosVentas.EN_PROCESO });
            if (!venta.folioPxLab && venta.credito && pago.pagos.length === 0) {
                await this.pxService.enviarVenta(await this.ventasService.getventaByFolio(venta.folio), 'N');
                enviadoPx = true;
            }
        }
        const sumVenta = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('dVenta')
            .select('SUM(dVenta.precio)', 'sum')
            .where('dVenta.ventaId = :ventaId', { ventaId: venta.id })
            .getRawOne();
        console.log('sumVenta', sumVenta.total);
        let totalVenta = sumVenta.sum;
        if (pago.descuento > 0) {
            totalVenta = sumVenta.sum - (sumVenta.sum * pago.descuento) / 100;
            pago.descuentoPesos = (sumVenta.sum * pago.descuento) / 100;
        }
        else if (pago.descuentoPesos > 0) {
            totalVenta = totalVenta - pago.descuentoPesos;
            pago.descuento = (pago.descuentoPesos * 100) / sumVenta.sum;
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, {
            total: totalVenta,
            descuento: pago.descuento ? pago.descuento : 0,
            descuentoPesos: pago.descuentoPesos ? pago.descuentoPesos : 0,
            fechaUltimaRegla: pago.fechaUltimaRegla ? pago.fechaUltimaRegla : null,
            observaciones: pago.observaciones ? pago.observaciones : null,
            diagnostico: pago.diagnostico ? pago.diagnostico : null,
        });
        const pagosAnteriores = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagos')
            .leftJoin('pagos.venta', 'venta')
            .where('venta.id = :ventaId && pagos.estatus = :estatus', {
            ventaId: venta.id,
            estatus: true,
        })
            .getMany();
        const esPrimerPago = pagosAnteriores.length === 0;
        if (!pagosAnteriores.length) {
            const nuevoSaldo = totalVenta;
            await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, {
                saldo: totalVenta,
            });
            venta.saldo = nuevoSaldo;
        }
        const pagos = pagosAnteriores;
        let suma = 0;
        const pagosNuevos = [];
        for (let i = 0; i < pago.pagos.length; i++) {
            const createPago = {
                venta,
                caja,
                tipo: pago.pagos[i].tipo,
                referencia: pago.pagos[i].referencia,
                fecha: pago.fechaHora,
                monto: pago.pagos[i].monto,
                efectivoRecibido: pago.pagos[i].efectivoRecibido,
                cambio: pago.pagos[i].cambio,
                cobranza: pago.pagos[i].cobranza,
            };
            const savedPago = await typeorm_1.getRepository(pagos_entity_1.PagoEntity).save(createPago);
            if ((user === null || user === void 0 ? void 0 : user.profile) === profiles_enum_1.ProfileTypes.SUCURSAL) {
                const cajaMov = {
                    caja,
                    pago: savedPago,
                    monto: pago.pagos[i].monto,
                    tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
                    notas: pago.pagos[i].notas !== null ? pago.pagos[i].notas : '',
                };
                await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity).save(cajaMov);
            }
            delete savedPago.venta;
            delete savedPago.caja;
            suma += pago.pagos[i].monto;
            pagos.push(savedPago);
            pagosNuevos.push(savedPago);
        }
        const newSaldo = parseFloat(venta.saldo.toString()) - suma;
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, {
            saldo: newSaldo,
        });
        const ventaCompr = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(pago.ventaId);
        if (ventaCompr.saldo <= 0) {
            await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, {
                pagado: true,
            });
        }
        if (!venta.folioPxLab && esPrimerPago && !enviadoPx) {
            await this.pxService.enviarVenta(await this.ventasService.getventaByFolio(venta.folio), 'N');
        }
        if (user.profile === profiles_enum_1.ProfileTypes.SUCURSAL) {
            const newTotal = parseFloat(caja.total.toString()) + suma;
            await cajaQuery.update().set({ total: newTotal }).execute();
        }
        const informePagos = {
            venta: await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(pago.ventaId),
            pagos,
            pagosNuevos,
        };
        return informePagos;
    }
    async getById(id) {
        const pago = await typeorm_1.getRepository(pagos_entity_1.PagoEntity).findOne(id);
        if (!pago) {
            throw new common_1.HttpException('El pago no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return pago;
    }
    async delete(id) {
        return typeorm_1.getRepository(pagos_entity_1.PagoEntity).delete(id);
    }
    async updateStatus(id, estatus) {
        return await typeorm_1.getRepository(pagos_entity_1.PagoEntity).update({ id }, { estatus });
    }
    async cancelacionPago(id, motivo) {
        const pago = await typeorm_1.getRepository(pagos_entity_1.PagoEntity).findOne(id);
        if (!pago) {
            throw new common_1.HttpException('El pago no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (pago.estatus === 0) {
            throw new common_1.HttpException('El pago ya ha sido cancelado', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await typeorm_1.getRepository(pagos_entity_1.PagoEntity).update({ id }, { estatus: 0 });
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne({
            id: pago.ventaId,
        });
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: venta.id }, { saldo: venta.saldo + pago.monto });
        const movimientoCaja = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity).findOne({
            pagoId: pago.id,
        });
        if (movimientoCaja) {
            await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
                .createQueryBuilder()
                .update()
                .set({ estatus: 0, motivoCancelacion: motivo })
                .where('id = :movimientoId', { movimientoId: movimientoCaja.id })
                .execute();
        }
        return result;
    }
    async getReciboPagos(detalleVenta, pagosId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const pagos = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder()
            .where('id IN (:...ids)', { ids: pagosId })
            .getMany();
        let totalAbono = 0;
        pagos.forEach((pago) => {
            totalAbono += pago.monto;
        });
        const ticket = Object.assign(Object.assign({}, detalleVenta), { pagos, sucursal: {
                direccion: `${(_a = detalleVenta.venta.sucursal) === null || _a === void 0 ? void 0 : _a.calle} No. ${(_b = detalleVenta.venta.sucursal) === null || _b === void 0 ? void 0 : _b.numExt}. Colonia ${(_c = detalleVenta.venta.sucursal) === null || _c === void 0 ? void 0 : _c.colonia}, ${(_d = detalleVenta.venta.sucursal) === null || _d === void 0 ? void 0 : _d.municipio}. CP. ${(_e = detalleVenta.venta.sucursal) === null || _e === void 0 ? void 0 : _e.cp}.`,
                telefono: (_f = detalleVenta.venta.sucursal) === null || _f === void 0 ? void 0 : _f.telefono,
                nombre: (_g = detalleVenta.venta.sucursal) === null || _g === void 0 ? void 0 : _g.nombre,
            }, cajero: `${(_j = (_h = detalleVenta.venta.caja) === null || _h === void 0 ? void 0 : _h.usuario) === null || _j === void 0 ? void 0 : _j.firstName} ${(_l = (_k = detalleVenta.venta.caja) === null || _k === void 0 ? void 0 : _k.usuario) === null || _l === void 0 ? void 0 : _l.lastName}`, fechaVenta: moment(detalleVenta.venta.fecha).format('DD-MM-YYYY hh:mm:ss'), totalAbonoVenta: convertidor.NumerosALetras(totalAbono), totalAbono });
        return ticket;
    }
    async abonarPagoCliente(clienteId, monto) {
        const ventasQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('ventas')
            .leftJoin('ventas.cliente', 'cliente')
            .where('cliente.id = :clienteId', { clienteId })
            .andWhere('ventas.pagado = :estaPagada', { estaPagada: false })
            .andWhere('ventas.saldo > 0');
        const ventas = await ventasQuery
            .orderBy('ventas.createdAt', 'DESC')
            .getMany();
        if (!ventas.length) {
            throw new common_1.HttpException('El cliente no tiene pagos pendiente', common_1.HttpStatus.BAD_REQUEST);
        }
        const cantidad = ventas.map((e) => e.saldo).reduce((ac, cv) => ac + cv);
        if (monto === cantidad) {
            return await ventasQuery
                .update()
                .set({ saldo: 0, pagado: true })
                .execute();
        }
        else if (monto > cantidad) {
            const result = monto - cantidad;
            throw new common_1.HttpException(`El monto es superior al adeudo por $${result}`, common_1.HttpStatus.BAD_REQUEST);
        }
        let result;
        for (const i of ventas) {
            if (monto > 0) {
                const resta = monto - i.saldo;
                if (resta >= 0) {
                    result = await ventasQuery
                        .andWhere('ventas.id = :ventaId', { ventaId: i.id })
                        .update()
                        .set({ saldo: 0, pagado: true })
                        .execute();
                    monto -= i.saldo;
                }
                else {
                    const nuevoSaldo = i.saldo - monto;
                    result = await ventasQuery
                        .andWhere('ventas.id = :ventaId', { ventaId: i.id })
                        .update()
                        .set({ saldo: nuevoSaldo })
                        .execute();
                    monto = 0;
                }
            }
        }
        return result;
    }
};
PagosService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [pxlab_service_1.PxlabService,
        ventas_service_1.VentasService])
], PagosService);
exports.PagosService = PagosService;
//# sourceMappingURL=pagos.service.js.map