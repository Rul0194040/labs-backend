"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajasService = void 0;
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const sucursal_entity_1 = require("./../sucursales/sucursal.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const users_entity_1 = require("../users/users.entity");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const cajas_entity_1 = require("./cajas.entity");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const estatusCaja_enum_1 = require("./estatusCaja.enum");
const movimientos_caja_entity_1 = require("./movimientos-caja.entity");
const tiposMovimientoCaja_enum_1 = require("../common/enum/tiposMovimientoCaja.enum");
const moment = require("moment");
const estatusMovimiento_enum_1 = require("./estatusMovimiento.enum");
const pagos_entity_1 = require("../pagos/pagos.entity");
const tipoPagos_enum_1 = require("../pagos/tipoPagos.enum");
const class_transformer_1 = require("class-transformer");
const estatusCorte_enum_1 = require("../tesoreros/cortesTesorero/estatusCorte.enum");
const cortesTesorero_entity_1 = require("../tesoreros/cortesTesorero/cortesTesorero.entity");
const ventas_entity_1 = require("../ventas/ventas.entity");
const estadosVentas_enum_1 = require("../ventas/estadosVentas.enum");
const profiles_enum_1 = require("../users/profiles.enum");
let CajasService = class CajasService {
    constructor() {
        this.notFoundMessage = 'caja no encontrada';
    }
    async create(caja, usuario) {
        if (!usuario.sucursal) {
            throw new common_1.HttpException('El usuario no pertenece a una sucursal', common_1.HttpStatus.BAD_REQUEST);
        }
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: usuario.sucursal.id,
        });
        const cajaToCreate = {
            usuario: usuario,
            sucursal,
            montoApertura: caja.montoApertura,
            notas: caja.notas,
            estatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
            fechaApertura: new Date(),
            createdAt: new Date(),
        };
        const cajaCreada = await typeorm_1.getRepository(cajas_entity_1.CajaEntity).save(cajaToCreate);
        const dataDeposito = {
            monto: cajaCreada.montoApertura,
            notas: 'Apertura de caja',
        };
        await this.crearDeposito(usuario, dataDeposito, true);
        cajaCreada.total = dataDeposito.monto;
        return cajaCreada;
    }
    async setContabilizada(cajaId) {
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set({ estatus: estatusCaja_enum_1.EstatusCaja.CONTABILIZADA })
            .where('id=:cajaId', { cajaId })
            .execute();
    }
    async setEntregada(cajaId, datosCaja) {
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set({
            origenEntrega: datosCaja.entregaOrigen,
            estatus: estatusCaja_enum_1.EstatusCaja.ENTREGADA,
            recibio: datosCaja.recibio || null,
            referencia: datosCaja.referencia || null,
        })
            .where('id=:cajaId', { cajaId })
            .execute();
    }
    async getById(id) {
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoinAndSelect('caja.usuario', 'usuario')
            .leftJoinAndSelect('caja.sucursal', 'sucursal')
            .select([
            'caja.id',
            'caja.fechaApertura',
            'caja.fechaCierre',
            'caja.montoApertura',
            'caja.total',
            'caja.notas',
            'caja.estatus',
            'caja.origenEntrega',
            'caja.referencia',
            'caja.recibio',
            'sucursal.id',
            'sucursal.nombre',
            'usuario.profile',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.email',
            'usuario.telefono',
        ])
            .where('caja.id = :id', { id })
            .getOne();
        if (!caja) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const retornar = class_transformer_1.classToPlain(caja);
        const ventasCaja = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('venta.cliente', 'cliente')
            .where('cajaId = :cajaId', {
            cajaId: caja.id,
        })
            .getMany();
        retornar.ventas = ventasCaja;
        return retornar;
    }
    async update(id, caja) {
        const record = await this.getById(id);
        if (!record) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity).update({ id }, caja);
    }
    async delete(id) {
        return typeorm_1.getRepository(cajas_entity_1.CajaEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity).createQueryBuilder();
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'fecha') {
                const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
                const fin = moment(value).format('YYYY-MM-DD 23:59:59');
                dataQuery.andWhere('fechaApertura BETWEEN :inicio AND :fin', {
                    inicio: inicio,
                    fin: fin,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async cajasUsuario(user, options) {
        const dataQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .where('usuario.id=:id', { id: user.id });
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'fecha') {
                const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
                const fin = moment(value).format('YYYY-MM-DD 23:59:59');
                dataQuery.andWhere('fechaApertura BETWEEN :inicio AND :fin', {
                    inicio: inicio,
                    fin: fin,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'caja.createdAt';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async ventasCaja(user, options) {
        const dataQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.caja', 'caja')
            .leftJoin('caja.usuario', 'usuario')
            .where('usuario.id=:usuarioId AND tipoMovimiento=:tipoM', {
            usuarioId: user.id,
            tipoM: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async movimientosCaja(id, movimiento, options) {
        const dataQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.caja', 'caja')
            .leftJoinAndSelect('movimiento.pago', 'pago')
            .leftJoinAndSelect('pago.venta', 'venta')
            .where('caja.id=:cajaId', {
            cajaId: id,
        });
        if (movimiento) {
            dataQuery.andWhere('movimiento.tipoMovimiento=:movimiento', {
                movimiento,
            });
        }
        dataQuery.select(['movimiento', 'pago.id', 'pago.venta', 'venta.folio']);
        const count = await dataQuery.getCount();
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'movimiento.id';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async movimientosCancelados(id) {
        const dataQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.caja', 'caja')
            .where('caja.id=:cajaId', { cajaId: id })
            .andWhere('movimiento.active=:status', {
            status: false,
        })
            .getMany();
        return dataQuery;
    }
    async movimientosRetiros(id) {
        const dataQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.caja', 'caja')
            .where('caja.id=:cajaId', { cajaId: id })
            .andWhere('movimiento.tipoMovimiento=:tipo', {
            tipo: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getMany();
        return dataQuery;
    }
    async movimientosDepositos(id) {
        const dataQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.caja', 'caja')
            .where('caja.id=:cajaId', { cajaId: id })
            .andWhere('movimiento.tipoMovimiento=:tipo', {
            tipo: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
        })
            .getMany();
        return dataQuery;
    }
    async consultarCajaUsuario(user) {
        if (!user.sucursal) {
            throw new common_1.HttpException('El usuario no tiene asignada una sucursal', common_1.HttpStatus.BAD_REQUEST);
        }
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .leftJoin('caja.sucursal', 'sucursal')
            .select([
            'caja.id',
            'caja.usuarioId',
            'caja.sucursalId',
            'caja.montoApertura',
            'caja.total',
            'caja.createdAt',
            'caja.notas',
            'caja.estatus',
            'caja.transferencia',
            'caja.tarjeta',
            'caja.cheque',
            'caja.credito',
            'sucursal.zona',
            'sucursal.seleccionarZona',
        ])
            .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
        })
            .andWhere('estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
        })
            .getOne();
        if (!caja) {
            return null;
        }
        return caja;
    }
    async crearDeposito(user, depositoData, apertura) {
        const cajaQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .leftJoin('caja.sucursal', 'sucursal')
            .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
        })
            .andWhere('estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
        });
        const caja = await cajaQuery.getOne();
        if (!caja) {
            throw new common_1.HttpException('El usuario no tiene una caja abierta', common_1.HttpStatus.NOT_FOUND);
        }
        const movimiento = {
            caja,
            monto: depositoData.monto,
            tipoMovimiento: apertura
                ? tiposMovimientoCaja_enum_1.TiposMovimientoCaja.APERTURA
                : tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
            notas: depositoData.notas,
            createdAt: new Date(),
            estatusMovimiento: estatusMovimiento_enum_1.EstatusMovimientoCancelacionE.INICIAL,
        };
        const movimientoCaja = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity).save(movimiento);
        if (!apertura) {
            const newTotal = Number(caja.total) + Number(movimientoCaja.monto);
            await cajaQuery.update().set({ total: newTotal }).execute();
        }
        return await cajaQuery.select(['caja.total', 'caja.createdAt']).getOne();
    }
    async crearRetiro(user, retiroData) {
        let newTotal = 0;
        const cajaQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .leftJoin('caja.sucursal', 'sucursal')
            .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
        })
            .andWhere('estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
        });
        const caja = await cajaQuery.getOne();
        if (!caja) {
            throw new common_1.HttpException('El usuario no tiene una caja abierta', common_1.HttpStatus.NOT_FOUND);
        }
        const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: caja.id })
            .select('SUM(movimientosCaja.monto)', 'total');
        const retiros = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getRawOne();
        const cajaMovimientoEfectivoQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: caja.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const efectivoDisponible = cajaMovimientoEfectivoQuery.total - retiros.total;
        if (efectivoDisponible === 0) {
            throw new common_1.HttpException('No se cuenta con efectivo suficiente', common_1.HttpStatus.AMBIGUOUS);
        }
        if (Number(retiroData.monto) > Number(efectivoDisponible)) {
            throw new common_1.HttpException('El monto del retiro no debe de exceder el monto de efectivo disponible', common_1.HttpStatus.AMBIGUOUS);
        }
        const movimiento = {
            caja,
            monto: retiroData.monto,
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
            notas: retiroData.notas,
            createdAt: new Date(),
            estatusMovimiento: estatusMovimiento_enum_1.EstatusMovimientoCancelacionE.INICIAL,
        };
        const movimientoCaja = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity).save(movimiento);
        newTotal = Number(caja.total) - Number(movimientoCaja.monto);
        await cajaQuery.update().set({ total: newTotal }).execute();
        return await cajaQuery.select(['caja.total', 'caja.createdAt']).getOne();
    }
    async getTotalMovimientosByCaja(user) {
        const cajaQuery = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .leftJoin('caja.sucursal', 'sucursal')
            .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
        })
            .andWhere('estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
        })
            .getOne();
        if (!cajaQuery) {
            throw new common_1.HttpException('El usuario no tiene una caja abierta', common_1.HttpStatus.NOT_FOUND);
        }
        const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
            .select('SUM(movimientosCaja.monto)', 'total');
        const cajaMovimientoCancelacionesQuery = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
            .select('SUM(movimientosCaja.monto)', 'total')
            .andWhere('movimientosCaja.active = :status', {
            status: false,
        })
            .getRawOne();
        const cajaMovimientoTransferenciasQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TRANSFERENCIA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoEfectivoQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoChequeQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.CHEQUE,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoTarjetaQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TARJETA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const PagosCredito = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .leftJoin('pago.venta', 'venta')
            .leftJoin('pago.caja', 'caja')
            .select('SUM(pago.monto)', 'total')
            .where('caja.id = :cajaId', {
            cajaId: cajaQuery.id,
        })
            .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
            .andWhere('pago.estatus = :activos', { activos: true })
            .getRawOne();
        const depositos = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
        })
            .getRawOne();
        const retiros = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getRawOne();
        const ventas = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
        })
            .getRawOne();
        const creditoVentas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
            .andWhere('venta.saldo > 0')
            .andWhere('venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada', {
            estadoBorrador: estadosVentas_enum_1.EstadosVentas.BORRADOR,
            estadoCancelada: estadosVentas_enum_1.EstadosVentas.CANCELADA,
        })
            .select('SUM(venta.saldo)', 'total')
            .getRawOne();
        const dataResult = {
            depositos: parseFloat(depositos.total),
            retiros: parseFloat(retiros.total),
            ventas: parseFloat(ventas.total),
            cancelaciones: parseFloat(cajaMovimientoCancelacionesQuery.total),
            transferencias: parseFloat(cajaMovimientoTransferenciasQuery.total),
            tarjeta: parseFloat(cajaMovimientoTarjetaQuery.total),
            efectivo: parseFloat(cajaMovimientoEfectivoQuery.total),
            cheque: parseFloat(cajaMovimientoChequeQuery.total),
            credito: parseFloat(PagosCredito.total),
            creditoVentas: parseFloat(creditoVentas.total),
        };
        return dataResult;
    }
    async getTotalMovimientosByCajaCerrada(cajaId) {
        const cajaQuery = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .where('caja.id = :cajaId', {
            cajaId: cajaId,
        })
            .getOne();
        const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
            .select('SUM(movimientosCaja.monto)', 'total');
        const cajaMovimientoCancelacionesQuery = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
            .select('SUM(movimientosCaja.monto)', 'total')
            .andWhere('movimientosCaja.active = :status', {
            status: false,
        })
            .getRawOne();
        const cajaMovimientoTransferenciasQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TRANSFERENCIA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoEfectivoQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: cajaQuery.id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoChequeQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: cajaQuery.id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.CHEQUE,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoTarjetaQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
            cajaId: cajaQuery.id,
            ventaEstado: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TARJETA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const PagosCredito = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .leftJoin('pago.venta', 'venta')
            .leftJoin('pago.caja', 'caja')
            .select('SUM(pago.monto)', 'total')
            .where('caja.id = :cajaId', {
            cajaId: cajaQuery.id,
        })
            .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
            .andWhere('pago.estatus = :activos', { activos: true })
            .getRawOne();
        const depositos = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
        })
            .getRawOne();
        const retiros = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getRawOne();
        const ventas = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
        })
            .getRawOne();
        const dataResult = {
            depositos: parseFloat(depositos.total),
            retiros: parseFloat(retiros.total),
            ventas: parseFloat(ventas.total),
            cancelaciones: parseFloat(cajaMovimientoCancelacionesQuery.total),
            transferencias: parseFloat(cajaMovimientoTransferenciasQuery.total),
            tarjeta: parseFloat(cajaMovimientoTarjetaQuery.total),
            efectivo: parseFloat(cajaMovimientoEfectivoQuery.total),
            cheque: parseFloat(cajaMovimientoChequeQuery.total),
            credito: parseFloat(PagosCredito.total),
        };
        return dataResult;
    }
    async getCajasCerradasPorSucursal(sucursalId, user) {
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursalId);
        if (!sucursal) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.profile === profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS &&
            !sucursal.esForanea) {
            throw new common_1.HttpException('su perfil no tiene acceso para recoger dinero de esta sucursal', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.profile === profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES &&
            sucursal.esForanea) {
            throw new common_1.HttpException('su perfil no tiene acceso para recoger dinero de esta sucursal', common_1.HttpStatus.BAD_REQUEST);
        }
        const cajasPorSucursal = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.sucursal', 'sucursal')
            .leftJoin('caja.usuario', 'usuario')
            .where('sucursal.id = :sucursalId', { sucursalId })
            .andWhere('caja.estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.CERRADA,
        })
            .select([
            'caja',
            'sucursal',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
            'usuario.id',
        ])
            .getMany();
        if (!cajasPorSucursal.length) {
            throw new common_1.HttpException('No hay cajas cerradas en esa sucursal', common_1.HttpStatus.NOT_FOUND);
        }
        const pagosQuery = typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .select('SUM(pagoEntity.monto)', 'total')
            .where('venta.credito = :ventaEstado', { ventaEstado: false })
            .andWhere('pagoEntity.estatus = :activos', { activos: true });
        const cajas = [];
        for (const caja of cajasPorSucursal) {
            const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
                .createQueryBuilder('movimientosCaja')
                .leftJoin('movimientosCaja.caja', 'caja')
                .where('caja.id = :cajaId', { cajaId: caja.id })
                .select('SUM(movimientosCaja.monto)', 'total');
            pagosQuery.andWhere('caja.id = :cajaId', { cajaId: caja.id });
            const ventas = await cajaMovimientoQuery
                .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
                tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
            })
                .getRawOne();
            const retiros = await cajaMovimientoQuery
                .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
                tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
            })
                .getRawOne();
            const depositos = await cajaMovimientoQuery
                .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
                tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
            })
                .getRawOne();
            const transferencias = await pagosQuery
                .andWhere('pagoEntity.tipo = :tipo', {
                tipo: tipoPagos_enum_1.TiposPago.TRANSFERENCIA,
            })
                .getRawOne();
            const tarjeta = await pagosQuery
                .andWhere('pagoEntity.tipo = :tipo', {
                tipo: tipoPagos_enum_1.TiposPago.TARJETA,
            })
                .getRawOne();
            const efectivo = await pagosQuery
                .andWhere('pagoEntity.tipo = :tipo', {
                tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
            })
                .getRawOne();
            const cheque = await pagosQuery
                .andWhere('pagoEntity.tipo = :tipo', {
                tipo: tipoPagos_enum_1.TiposPago.CHEQUE,
            })
                .getRawOne();
            const creditoVentas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
                .createQueryBuilder('venta')
                .leftJoin('venta.caja', 'caja')
                .where('caja.id = :cajaId', { cajaId: caja.id })
                .andWhere('venta.saldo > 0')
                .andWhere('venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada', {
                estadoBorrador: estadosVentas_enum_1.EstadosVentas.BORRADOR,
                estadoCancelada: estadosVentas_enum_1.EstadosVentas.CANCELADA,
            })
                .select('SUM(venta.saldo)', 'total')
                .getRawOne();
            const PagosCredito = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
                .createQueryBuilder('pago')
                .leftJoin('pago.venta', 'venta')
                .leftJoin('pago.caja', 'caja')
                .select('SUM(pago.monto)', 'total')
                .where('caja.id = :cajaId', {
                cajaId: caja.id,
            })
                .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
                .getRawOne();
            const result = {
                id: caja.id,
                montoApertura: caja.montoApertura,
                total: caja.total,
                fechaApertura: caja.fechaApertura,
                fechaCierre: caja.fechaCierre,
                usuario: caja.usuario,
                ventas: ventas.total,
                retiros: retiros.total,
                depositos: depositos.total,
                transferencias: transferencias.total,
                tarjeta: tarjeta.total,
                efectivo: efectivo.total,
                cheque: cheque.total,
                creditoVentas: creditoVentas.total,
                credito: parseFloat(PagosCredito.total),
                faltante: caja.faltante,
                observaciones: caja.observacionTesorero,
            };
            if (efectivo.total > 0) {
                cajas.push(result);
            }
        }
        return cajas;
    }
    async getCortePorCaja(cajaId) {
        console.log(cajaId);
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.sucursal', 'sucursal')
            .leftJoin('caja.usuario', 'usuario')
            .where('caja.id = :cajaId', { cajaId })
            .select([
            'caja',
            'sucursal',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
            'usuario.id',
        ])
            .getOne();
        if (!caja) {
            throw new common_1.HttpException('La caja no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const pagosQuery = typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .select('SUM(pagoEntity.monto)', 'total')
            .where('venta.credito = :ventaEstado', { ventaEstado: false })
            .andWhere('pagoEntity.estatus = :activos', { activos: true });
        const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: caja.id })
            .select('SUM(movimientosCaja.monto)', 'total');
        pagosQuery.andWhere('caja.id = :cajaId', { cajaId: caja.id });
        const ventas = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
        })
            .getRawOne();
        const retiros = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getRawOne();
        const depositos = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
            tipoMovimiento: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
        })
            .getRawOne();
        const transferencias = await pagosQuery
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TRANSFERENCIA,
        })
            .getRawOne();
        const tarjeta = await pagosQuery
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TARJETA,
        })
            .getRawOne();
        const efectivo = await pagosQuery
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
        })
            .getRawOne();
        const cheque = await pagosQuery
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.CHEQUE,
        })
            .getRawOne();
        const creditoVentas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: caja.id })
            .andWhere('venta.saldo > 0')
            .andWhere('venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada', {
            estadoBorrador: estadosVentas_enum_1.EstadosVentas.BORRADOR,
            estadoCancelada: estadosVentas_enum_1.EstadosVentas.CANCELADA,
        })
            .select('SUM(venta.saldo)', 'total')
            .getRawOne();
        const PagosCredito = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .leftJoin('pago.venta', 'venta')
            .leftJoin('pago.caja', 'caja')
            .select('SUM(pago.monto)', 'total')
            .where('caja.id = :cajaId', {
            cajaId: caja.id,
        })
            .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
            .getRawOne();
        const result = {
            id: caja.id,
            montoApertura: caja.montoApertura,
            total: caja.total,
            fechaApertura: caja.fechaApertura,
            fechaCierre: caja.fechaCierre,
            usuario: caja.usuario,
            ventas: ventas.total,
            retiros: retiros.total,
            depositos: depositos.total,
            transferencias: transferencias.total,
            tarjeta: tarjeta.total,
            efectivo: efectivo.total,
            cheque: cheque.total,
            creditoVentas: creditoVentas.total,
            credito: parseFloat(PagosCredito.total),
            faltante: caja.faltante,
            observaciones: caja.observacionTesorero,
        };
        return result;
    }
    async contabilizarCajas(sucursalId, user) {
        const cajas = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.sucursal', 'sucursal')
            .leftJoin('caja.usuario', 'usuario')
            .where('sucursal.id = :sucursalId', { sucursalId })
            .andWhere('caja.estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.CERRADA,
        })
            .getMany();
        const tesorero = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({ id: user.sub });
        const corte = await typeorm_1.getRepository(cortesTesorero_entity_1.CorteTesoreroEntity).save({
            estatus: estatusCorte_enum_1.EstatusCorte.TRANSITO,
            tesorero,
        });
        const ids = cajas.map((e) => e.id);
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set({ estatus: estatusCaja_enum_1.EstatusCaja.CONTABILIZADA, corteTesorero: corte })
            .whereInIds(ids)
            .execute();
    }
    async solicitarCancelacion(idMovimiento, idCaja, cambiarStatus) {
        const cajaQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .where('id = :id', { id: idCaja });
        const movimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .where('id = :id', { id: idMovimiento });
        const caja = await cajaQuery.getOne();
        if (!caja) {
            throw new common_1.HttpException('La caja no existe', common_1.HttpStatus.NOT_FOUND);
        }
        await movimientoQuery
            .update()
            .set({
            motivoCancelacion: cambiarStatus.motivoCancelacion,
            estatusMovimiento: estatusMovimiento_enum_1.EstatusMovimientoCancelacionE.SOLICITUD,
        })
            .execute();
        return await movimientoQuery.getOne();
    }
    async cancelarMovimiento(idMovimiento, estatusMovimiento) {
        const movimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .where('id = :id', { id: idMovimiento });
        const movimiento = await movimientoQuery.getOne();
        const cajaQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .where('id = :id', { id: movimiento.cajaId });
        const caja = await cajaQuery.getOne();
        if (!caja) {
            throw new common_1.HttpException('La caja no existe', common_1.HttpStatus.NOT_FOUND);
        }
        let newTotal;
        switch (movimiento.tipoMovimiento) {
            case tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO:
                newTotal = Number(caja.total) - Number(movimiento.monto);
                break;
            case tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO:
                newTotal = Number(caja.total) + Number(movimiento.monto);
                break;
            case tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA:
                newTotal = Number(caja.total) - Number(movimiento.monto);
                break;
            default:
                throw new common_1.HttpException('Tipo de movimiento no valido', common_1.HttpStatus.CONFLICT);
        }
        await cajaQuery.update().set({ total: newTotal }).execute();
        await movimientoQuery
            .update()
            .set({
            estatusMovimiento,
            active: false,
        })
            .execute();
        return await cajaQuery.select(['caja.total']).getOne();
    }
    async cerrarCaja(user, cerrarCaja) {
        const caja = await this.consultarCajaUsuario(user);
        if (!caja) {
            throw new common_1.HttpException('La caja no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const updateData = Object.assign(Object.assign({}, cerrarCaja), { estatus: estatusCaja_enum_1.EstatusCaja.CERRADA, fechaCierre: new Date() });
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set(updateData)
            .where('id = :idCaja', { idCaja: caja.id })
            .execute();
    }
    async getInfoForDoc(id) {
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .where('caja.id = :id', { id })
            .getOne();
        if (!caja) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const usuarioId = caja.usuarioId;
        const sucursalId = caja.sucursalId;
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('usuario')
            .select(['usuario.firstName', 'usuario.lastName'])
            .where('usuario.id = :usuarioId', { usuarioId })
            .getOne();
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .select(['sucursal.nombre'])
            .where('sucursal.id = :sucursalId', { sucursalId })
            .getOne();
        const cajaMovimientoQuery = typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: id })
            .select('SUM(movimientosCaja.monto)', 'total');
        const cajaMovimientoCancelacionesQuery = await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimientosCaja')
            .leftJoin('movimientosCaja.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: id })
            .select('SUM(movimientosCaja.monto)', 'total')
            .andWhere('movimientosCaja.active = :status', {
            status: false,
        })
            .getRawOne();
        const cajaMovimientoTransferenciasQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TRANSFERENCIA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoEfectivoQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.EFECTIVO,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoChequeQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.CHEQUE,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const cajaMovimientoTarjetaQuery = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pagoEntity')
            .leftJoin('pagoEntity.caja', 'caja')
            .leftJoin('pagoEntity.venta', 'venta')
            .where('caja.id = :cajaId AND venta.credito = :esCredito', {
            cajaId: id,
            esCredito: false,
        })
            .select('SUM(pagoEntity.monto)', 'total')
            .andWhere('pagoEntity.tipo = :tipo', {
            tipo: tipoPagos_enum_1.TiposPago.TARJETA,
        })
            .andWhere('pagoEntity.estatus = :activos', { activos: true })
            .getRawOne();
        const PagosCredito = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .leftJoin('pago.venta', 'venta')
            .leftJoin('pago.caja', 'caja')
            .select('SUM(pago.monto)', 'total')
            .where('caja.id = :cajaId', {
            cajaId: id,
        })
            .andWhere('venta.credito = :esCredito', { esCredito: true })
            .andWhere('pago.estatus = :activos', { activos: true })
            .getRawOne();
        const depositos = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :deposito', {
            deposito: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.DEPOSITO,
        })
            .getRawOne();
        const retiros = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :retiro', {
            retiro: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.RETIRO,
        })
            .getRawOne();
        const ventas = await cajaMovimientoQuery
            .andWhere('movimientosCaja.tipoMovimiento = :venta', {
            venta: tiposMovimientoCaja_enum_1.TiposMovimientoCaja.VENTA,
        })
            .getRawOne();
        const creditoVentas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.caja', 'caja')
            .where('caja.id = :cajaId', { cajaId: id })
            .andWhere('venta.saldo > 0')
            .andWhere('venta.estatus != :borradores AND venta.estatus != :canceladas', {
            borradores: estadosVentas_enum_1.EstadosVentas.BORRADOR,
            canceladas: estadosVentas_enum_1.EstadosVentas.CANCELADA,
        })
            .select('SUM(venta.saldo)', 'total')
            .getRawOne();
        const dataResult = {
            depositos: parseFloat(depositos.total),
            retiros: parseFloat(retiros.total),
            ventas: parseFloat(ventas.total),
            cancelaciones: parseFloat(cajaMovimientoCancelacionesQuery.total),
            transferencias: parseFloat(cajaMovimientoTransferenciasQuery.total),
            tarjeta: parseFloat(cajaMovimientoTarjetaQuery.total),
            efectivo: parseFloat(cajaMovimientoEfectivoQuery.total),
            cheque: parseFloat(cajaMovimientoChequeQuery.total),
            credito: parseFloat(PagosCredito.total),
            creditoVentas: parseFloat(creditoVentas.total),
        };
        const dataDoc = {
            caja,
            usuario,
            sucursal,
            dataResult,
        };
        return dataDoc;
    }
};
CajasService = __decorate([
    common_1.Injectable()
], CajasService);
exports.CajasService = CajasService;
//# sourceMappingURL=cajas.service.js.map