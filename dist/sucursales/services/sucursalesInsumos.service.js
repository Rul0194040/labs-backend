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
var SucursalesInsumosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucursalesInsumosService = void 0;
const EstatusPresupuesto_enum_1 = require("../../presupuestos/EstatusPresupuesto.enum");
const presupuestosDetalle_entity_1 = require("../../presupuestos/presupuestosDetalle.entity");
const common_1 = require("@nestjs/common");
const sucursal_entity_1 = require("../sucursal.entity");
const typeorm_1 = require("typeorm");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
const sucursalesInsumos_entity_1 = require("../sucursalesInsumos.entity");
const insumo_entity_1 = require("../../insumos/insumo.entity");
const create_movimiento_dto_1 = require("../../almacen/DTOs/create-movimiento.dto");
const detalleMovimientos_entity_1 = require("../../almacen/detalleMovimientos.entity");
const movimientosAlmacen_entity_1 = require("../../almacen/movimientosAlmacen.entity");
const estatusMovimiento_enum_1 = require("../../almacen/estatusMovimiento.enum");
const minimoAlcanzado_event_1 = require("../../notificaciones/events/minimoAlcanzado.event");
const notificaciones_service_1 = require("../../notificaciones/notificaciones.service");
const lotes_entity_1 = require("../../lotes/lotes.entity");
const EstatusCompra_enum_1 = require("../../compras/EstatusCompra.enum");
const detallesCompras_entity_1 = require("../../compras/detallesCompras.entity");
const readXlsxFile = require("read-excel-file/node");
const moment = require("moment");
const logger_1 = require("../../logger");
let SucursalesInsumosService = SucursalesInsumosService_1 = class SucursalesInsumosService {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
        this.notFoundMessage = 'Sucursal no encontrada';
        this.logger = new logger_1.MyLogger(SucursalesInsumosService_1.name);
    }
    async transferencia(destinoId, origenId, insumoData) {
        let updateResult;
        const sucursalDestino = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: destinoId,
        });
        const sucursalOrigen = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: origenId,
        });
        if (!sucursalDestino || !sucursalOrigen) {
            throw new common_1.HttpException('La transferencia es imposible', common_1.HttpStatus.NOT_FOUND);
        }
        const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .where('id=:id', { id: insumoData.insumo })
            .getOne();
        if (!insumo) {
            throw new common_1.HttpException('El insumo no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (sucursalDestino && sucursalOrigen && insumo) {
            const insumoEnEmisor = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder('SucursalesInsumos')
                .leftJoinAndSelect('SucursalesInsumos.sucursal', 'sucursal')
                .leftJoinAndSelect('SucursalesInsumos.insumo', 'insumo')
                .leftJoinAndSelect('SucursalesInsumos.lote', 'lote')
                .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
                idSucursal: sucursalOrigen.id,
                idInsumo: insumo.id,
            });
            if (insumoData.lote) {
                insumoEnEmisor.andWhere('lote.id=:elLote', {
                    elLote: insumoData.lote.id,
                });
            }
            else {
                insumoEnEmisor.andWhere('lote.id IS null');
            }
            const resultInsumosEmisor = await insumoEnEmisor.getOne();
            if (resultInsumosEmisor) {
                const newCantidadOrigen = resultInsumosEmisor.existencia - insumoData.cantidad;
                const updateQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                    .createQueryBuilder('sucursal')
                    .leftJoin('sucursal.sucursal', 'sucursal')
                    .leftJoin('sucursal.insumo', 'insumo')
                    .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
                    idSucursal: sucursalOrigen.id,
                    idInsumo: insumo.id,
                });
                if (insumoData.lote) {
                    updateQuery.andWhere('lote.id=:elLote', {
                        elLote: insumoData.lote.id,
                    });
                }
                else {
                    updateQuery.andWhere('lote.id IS null');
                }
                updateResult = await updateQuery
                    .update()
                    .set({ existencia: newCantidadOrigen })
                    .execute();
                if (resultInsumosEmisor.minimo &&
                    newCantidadOrigen <= resultInsumosEmisor.minimo) {
                    this.notificacionesService.emitMinimoAlcanzado(new minimoAlcanzado_event_1.MinimoAlcanzadoEvent(resultInsumosEmisor.sucursal, resultInsumosEmisor.insumo));
                }
            }
            else {
                const sucursalInsumotoCreate = {
                    sucursal: sucursalOrigen,
                    insumo: insumo,
                    existencia: insumoData.cantidad,
                };
                updateResult = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save(sucursalInsumotoCreate);
            }
        }
        return updateResult;
    }
    async cancelarTransferencia(movimientoId) {
        const movimiento = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).findOne(movimientoId);
        if (movimiento.estatus !== estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO) {
            throw new common_1.HttpException('La cancelación de la transferencia es imposible', common_1.HttpStatus.NOT_FOUND);
        }
        const queryDetMov = await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
            .createQueryBuilder('det')
            .leftJoin('det.movimiento', 'mov')
            .where('mov.id=:movimientoId', { movimientoId })
            .getMany();
        if (queryDetMov.length) {
            for (let idx = 0; idx < queryDetMov.length; idx++) {
                const detMov = queryDetMov[idx];
                const sucIns = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                    .createQueryBuilder('sucIn')
                    .leftJoinAndSelect('sucIn.insumo', 'insumo')
                    .leftJoinAndSelect('sucIn.lote', 'lote')
                    .leftJoinAndSelect('sucIn.sucursal', 'sucursal')
                    .where('insumo.id=:insumoId AND sucursal.esMatriz=:esMatriz', {
                    insumoId: detMov.insumoId,
                    esMatriz: true,
                });
                if (detMov.loteId) {
                    sucIns.andWhere('lote.id=:elLote', {
                        elLote: detMov.loteId,
                    });
                }
                else {
                    sucIns.andWhere('lote.id IS null');
                }
                const queryResult = await sucIns.getOne();
                if (queryResult) {
                    const newCantidad = Number(detMov.cantidad) + Number(queryResult.existencia);
                    await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                        .createQueryBuilder()
                        .update()
                        .set({ existencia: Number(newCantidad) })
                        .where('id=:id', { id: queryResult.id })
                        .execute();
                }
            }
            return await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                .createQueryBuilder()
                .update()
                .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.CANCELADO })
                .where('id=:id', { id: movimiento.id })
                .execute();
        }
    }
    async verificarTransferencia(movimiento, detalle) {
        let transitoParcial = false;
        const sucursalDestino = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: movimiento.sucursalDestino,
        });
        let lote = null;
        for (let index = 0; index < detalle.length; index++) {
            const insumoEnSucursalDestinoQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder('SucursalesInsumos')
                .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
                .leftJoin('SucursalesInsumos.insumo', 'insumo')
                .leftJoin('SucursalesInsumos.lote', 'lote')
                .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
                idSucursal: sucursalDestino.id,
                idInsumo: detalle[index].insumo,
            });
            if (detalle[index].loteId) {
                lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).findOne({
                    id: detalle[index].loteId,
                });
                insumoEnSucursalDestinoQuery.andWhere('lote.id = :loteId', {
                    loteId: lote.id,
                });
            }
            else {
                insumoEnSucursalDestinoQuery.andWhere('lote.id IS null');
            }
            const insumoEnSucursalDestino = await insumoEnSucursalDestinoQuery.getOne();
            if (insumoEnSucursalDestino) {
                const newCantidadDestino = insumoEnSucursalDestino.existencia + detalle[index].cantidadRecibida;
                await insumoEnSucursalDestinoQuery
                    .update()
                    .set({ existencia: newCantidadDestino })
                    .execute();
            }
            else {
                const insumoNuevo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne({
                    id: detalle[index].insumo,
                });
                const sucursalInsumotoCreate = {
                    sucursal: sucursalDestino,
                    insumo: insumoNuevo,
                    lote,
                    existencia: detalle[index].cantidadRecibida,
                };
                await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save(sucursalInsumotoCreate);
            }
            if (detalle[index].cantidadRecibida < detalle[index].cantidad) {
                transitoParcial = true;
            }
            await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
                .createQueryBuilder()
                .update()
                .set({
                cantidadRecibida: detalle[index].cantidadRecibida,
                nota: detalle[index].nota,
            })
                .where('id=:id', { id: detalle[index].id })
                .execute();
            lote = null;
        }
        const queryMovimiento = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).createQueryBuilder();
        if (transitoParcial) {
            await queryMovimiento
                .update()
                .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO_PARCIAL })
                .where('id=:id', { id: movimiento.id })
                .execute();
        }
        else {
            await queryMovimiento
                .update()
                .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.FINALIZADO })
                .where('id=:id', { id: movimiento.id })
                .execute();
        }
        const response = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).findOne({
            id: movimiento.id,
        });
        return response;
    }
    async updateMinMaxSucursalInsumo(data, idSucursal, idInsumo) {
        const sucursalInsumo = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('SucursalesInsumos')
            .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
            .leftJoin('SucursalesInsumos.insumo', 'insumo')
            .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
            idSucursal,
            idInsumo,
        });
        const existeSucursalInsumo = await sucursalInsumo.getOne();
        if (!existeSucursalInsumo) {
            throw new common_1.HttpException('El insumo no existe en esa sucursal', common_1.HttpStatus.NOT_FOUND);
        }
        return await sucursalInsumo
            .update()
            .set({
            minimo: data.minimo,
            maximo: data.maximo,
            promedio: data.promedio,
        })
            .execute();
    }
    async paginateInsumosBySucursalSinExistencias(idSucursal, options) {
        const idsSinExistencia = await typeorm_1.getConnection().query(`select sum(existencia) as existencia, insumoId from sucursalesInsumos where sucursalId = ${idSucursal} and existencia = 0 group by insumoId ;`);
        const ids = idsSinExistencia.map((i) => i.insumoId);
        const rows = [];
        const insumosEnSucursalQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .leftJoin('sucIns.insumo', 'insumo')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'sucIns',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.descripcion',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucIns.minimo',
            'sucIns.maximo',
            'sucIns.promedio',
            'sucIns.existencia',
            'sucIns.ubicacion',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.descuentaEn',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
        ]);
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            rows.push(await insumosEnSucursalQuery
                .where('sucursal.id = :idSucursal', { idSucursal })
                .andWhere('sucIns.insumoId = :id', { id })
                .getOne());
        }
        return {
            data: rows,
            skip: options.skip,
            totalItems: rows.length,
        };
    }
    async paginateInsumosBySucursal(idSucursal, options) {
        const insumosEnSucursalQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .leftJoin('sucIns.insumo', 'insumo')
            .leftJoin('sucIns.lote', 'lote')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'sucIns',
            'lote',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.descripcion',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucIns.minimo',
            'sucIns.maximo',
            'sucIns.promedio',
            'sucIns.existencia',
            'sucIns.ubicacion',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.descuentaEn',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
        ]);
        const insumosEnSucursal = await insumosEnSucursalQuery
            .where('sucursal.id = :idSucursal', { idSucursal })
            .andWhere('sucIns.existencia > 0')
            .getMany();
        const porInsumo = lodash_1.groupBy(insumosEnSucursal, 'insumo.id');
        const keysInsumos = Object.keys(porInsumo);
        const respuesta = [];
        for (let idx = 0; idx < keysInsumos.length; idx++) {
            const grupoInsumo = porInsumo[keysInsumos[idx]];
            const totalGrupo = lodash_1.sumBy(grupoInsumo, 'existencia');
            respuesta.push({
                existencia: totalGrupo,
                minimo: grupoInsumo[0].minimo,
                maximo: grupoInsumo[0].maximo,
                promedio: grupoInsumo[0].promedio,
                insumo: grupoInsumo[0].insumo,
                lotes: grupoInsumo.map((sucInsumo) => {
                    return {
                        sucInsId: sucInsumo.id,
                        lote: sucInsumo.lote,
                        ubicacion: sucInsumo.ubicacion,
                        existencia: sucInsumo.existencia,
                    };
                }),
            });
        }
        const count = 0;
        return {
            data: respuesta,
            skip: options.skip,
            totalItems: count,
        };
    }
    async minimosBytipoInsumo(tipoInsumoId) {
        return typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('SucursalesInsumos')
            .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
            .leftJoin('SucursalesInsumos.insumo', 'insumo')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'SucursalesInsumos',
            'sucursal',
            'insumo',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
        ])
            .where('sucursal.esMatriz=true AND insumo.tipoInsumo=:id', {
            id: tipoInsumoId,
        })
            .andWhere('SucursalesInsumos.existencia <= SucursalesInsumos.minimo')
            .getMany();
    }
    async insumosExistentes() {
        const insumosConMinimosQuery = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .leftJoin('sucIns.insumo', 'insumo')
            .leftJoin('sucIns.lote', 'lote')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'sucIns',
            'sucIns.minimo',
            'sucIns.maximo',
            'sucIns.existencia',
            'lote.id',
            'lote.numero',
            'lote.descripcion',
            'lote.caducidad',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.descripcion',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.descuentaEn',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
        ])
            .where('sucIns.existencia > 0')
            .andWhere('sucursal.esMatriz = :esMatriz', { esMatriz: false })
            .getMany();
        if (!insumosConMinimosQuery.length) {
            return [];
        }
        const grupos = lodash_1.groupBy(insumosConMinimosQuery, (i) => {
            return i.sucursal.id + '_' + i.insumo.id;
        });
        const keysInsumos = Object.keys(grupos);
        const respuesta = [];
        for (let idx = 0; idx < keysInsumos.length; idx++) {
            const grupoInsumo = grupos[keysInsumos[idx]];
            const totalGrupo = lodash_1.sumBy(grupoInsumo, 'existencia');
            if (totalGrupo <= grupoInsumo[0].minimo) {
                respuesta.push({
                    existencia: totalGrupo,
                    minimo: grupoInsumo[0].minimo,
                    maximo: grupoInsumo[0].maximo,
                    promedio: grupoInsumo[0].promedio,
                    sucursal: grupoInsumo[0].sucursal,
                    insumo: grupoInsumo[0].insumo,
                    lotes: grupoInsumo.map((sucInsumo) => {
                        return {
                            sucInsId: sucInsumo.id,
                            lote: sucInsumo.lote ? sucInsumo.lote : null,
                            existencia: sucInsumo.existencia,
                        };
                    }),
                });
            }
        }
        return respuesta;
    }
    async paginateMinimosMatriz(options) {
        const dataQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .leftJoin('sucIns.insumo', 'insumo')
            .leftJoin('sucIns.lote', 'lote')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'sucIns',
            'lote.id',
            'lote.caducidad',
            'lote.numero',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.descripcion',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.descuentaEn',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
        ]);
        const insumosEnMatriz = await dataQuery
            .where('sucIns.existencia > 0  AND sucursal.esMatriz=:esMatriz', {
            esMatriz: true,
        })
            .getMany();
        if (!dataQuery) {
            return {
                data: [],
                skip: options.skip,
                totalItems: 0,
                insumosPresupuestados: [],
                insumosCompras: [],
            };
        }
        const porInsumo = lodash_1.groupBy(insumosEnMatriz, 'insumo.id');
        const keysInsumos = Object.keys(porInsumo);
        const respuesta = [];
        for (let idx = 0; idx < keysInsumos.length; idx++) {
            const grupoInsumo = porInsumo[keysInsumos[idx]];
            const totalGrupo = lodash_1.sumBy(grupoInsumo, 'existencia');
            if (totalGrupo <= grupoInsumo[0].minimo) {
                respuesta.push({
                    existencia: totalGrupo,
                    minimo: grupoInsumo[0].minimo,
                    maximo: grupoInsumo[0].maximo,
                    insumo: grupoInsumo[0].insumo,
                    lotes: grupoInsumo.map((sucInsumo) => {
                        return {
                            sucInsId: sucInsumo.id,
                            lote: sucInsumo.lote,
                            existencia: sucInsumo.existencia,
                        };
                    }),
                });
            }
        }
        if (options.filters.buscar) {
            const term = '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
            dataQuery.orWhere('movimiento.notas like :term', { term });
            dataQuery.orWhere('sucursalOrigen.nombre like :term', { term });
            dataQuery.orWhere('sucursalDestino.nombre like :term', { term });
            dataQuery.orWhere('movimiento.estatus like :term', { term });
        }
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        const ids = insumosEnMatriz.map((itms) => {
            if (itms.existencia < itms.minimo) {
                return itms.insumo.id;
            }
        });
        if (!ids.length) {
            return {
                data: [],
                skip: options.skip,
                totalItems: 0,
                insumosPresupuestados: [],
                insumosCompras: [],
            };
        }
        const enPresupuesto = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
            .createQueryBuilder('detPres')
            .leftJoin('detPres.insumo', 'insumo')
            .leftJoin('detPres.tipoUnidad', 'detPresTipoUnidad')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .leftJoin('detPres.presupuesto', 'presupuesto')
            .select([
            'detPres.id',
            'detPres.cantidad',
            'detPres.tipoUnidad',
            'detPresTipoUnidad.id',
            'detPresTipoUnidad.nombre',
            'presupuesto.id',
            'presupuesto.fecha',
            'presupuesto.estatus',
            'insumo.id',
            'insumo.nombre',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
        ])
            .where('insumo.id IN (:...ids) AND (presupuesto.estatus != :status AND presupuesto.estatus != :statusCancelado)', {
            ids,
            status: EstatusPresupuesto_enum_1.EstatusPresupuesto.GENERADO,
            statusCancelado: EstatusPresupuesto_enum_1.EstatusPresupuesto.CANCELADO,
        })
            .getMany();
        const enCompras = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
            .createQueryBuilder('detCompra')
            .leftJoin('detCompra.insumo', 'insumo')
            .leftJoin('detCompra.tipoUnidad', 'compraTipoUnidad')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .leftJoin('detCompra.compra', 'compra')
            .select([
            'detCompra.id',
            'detCompra.cantidad',
            'detCompra.tipoUnidad',
            'compraTipoUnidad.id',
            'compraTipoUnidad.nombre',
            'compra.id',
            'compra.fecha',
            'compra.estatus',
            'insumo.id',
            'insumo.nombre',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
        ])
            .where('insumo.id IN (:...ids) AND (compra.estatus != :status AND compra.estatus != :statusCancelado)', {
            ids,
            status: EstatusCompra_enum_1.EstatusCompra.RECIBIDO,
            statusCancelado: EstatusCompra_enum_1.EstatusCompra.CANCELADO,
        })
            .getMany();
        return {
            data: respuesta,
            skip: options.skip,
            totalItems: count,
            insumosPresupuestados: enPresupuesto,
            insumosCompras: enCompras,
        };
    }
    async insumosExistentesBySucursal(idSucursal) {
        const sucursalInsumoQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .leftJoin('sucIns.insumo', 'insumo')
            .leftJoin('sucIns.lote', 'lote')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'sucIns',
            'lote.id',
            'lote.numero',
            'lote.descripcion',
            'lote.caducidad',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.descripcion',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.descuentaEn',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
        ]);
        const dataSucursal = await sucursalInsumoQuery
            .where('sucIns.existencia > 0')
            .andWhere('sucursal.id =:idSucursal', { idSucursal })
            .getMany();
        const porInsumo = lodash_1.groupBy(dataSucursal, 'insumo.id');
        const keysInsumos = Object.keys(porInsumo);
        const respuesta = [];
        for (let idx = 0; idx < keysInsumos.length; idx++) {
            const grupoInsumo = porInsumo[keysInsumos[idx]];
            const totalGrupo = lodash_1.sumBy(grupoInsumo, 'existencia');
            if (totalGrupo <= grupoInsumo[0].minimo) {
                const dataMatriz = await sucursalInsumoQuery
                    .where('sucIns.existencia > 0')
                    .andWhere('insumo.id =:insumoId', {
                    insumoId: grupoInsumo[0].insumo.id,
                })
                    .andWhere('sucursal.esMatriz =:esMatriz', { esMatriz: true })
                    .getMany();
                const existenciaMatriz = lodash_1.sumBy(dataMatriz, 'existencia');
                respuesta.push({
                    existencia: totalGrupo,
                    sucursal: dataSucursal[0].sucursal,
                    minimo: grupoInsumo[0].minimo,
                    maximo: grupoInsumo[0].maximo,
                    promedio: grupoInsumo[0].promedio,
                    insumo: grupoInsumo[0].insumo,
                    existenciaMatriz,
                    lotes: grupoInsumo.map((sucInsumo) => {
                        return {
                            sucInsId: sucInsumo.id,
                            lote: sucInsumo.lote,
                            existencia: sucInsumo.existencia,
                        };
                    }),
                    lotesMatriz: dataMatriz.map((mtzInsumo) => {
                        return {
                            sucInsId: mtzInsumo.id,
                            lote: mtzInsumo.lote,
                            existencia: mtzInsumo.existencia,
                        };
                    }),
                });
            }
        }
        return respuesta;
    }
    async altaInsumo(id, insumoData) {
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder()
            .where('id=:id', { id })
            .getOne();
        if (!sucursal) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .where('id=:id', { id: insumoData.insumo })
            .getOne();
        if (!insumo) {
            throw new common_1.HttpException('El insumo no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (sucursal && insumo) {
            const sucursalInsumo = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder('SucursalesInsumos')
                .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
                .leftJoin('SucursalesInsumos.insumo', 'insumo')
                .leftJoin('SucursalesInsumos.lote', 'lote')
                .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
                idSucursal: sucursal.id,
                idInsumo: insumo.id,
            });
            if (insumoData.lote) {
                sucursalInsumo.andWhere('lote.id = :loteId', {
                    loteId: insumoData.lote.id,
                });
            }
            else {
                sucursalInsumo.andWhere('lote.id IS null');
            }
            const existeInsumoEnSucursal = await sucursalInsumo.getOne();
            if (existeInsumoEnSucursal) {
                const newCantidadInsumo = insumoData.cantidad + existeInsumoEnSucursal.existencia;
                return sucursalInsumo
                    .update()
                    .set({ existencia: newCantidadInsumo })
                    .execute();
            }
        }
        const sucursalInsumotoCreate = {
            sucursal: sucursal,
            insumo: insumo,
            existencia: insumoData.cantidad,
            lote: insumoData.lote,
        };
        return await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save(sucursalInsumotoCreate);
    }
    async bajaInsumo(idSucursal, data) {
        const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .where('id=:id', { id: data.insumo })
            .getOne();
        if (!insumo) {
            throw new common_1.HttpException('El insumo no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const sucursalInsumosQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucursalesInsumos')
            .leftJoinAndSelect('sucursalesInsumos.insumo', 'insumo')
            .leftJoinAndSelect('sucursalesInsumos.sucursal', 'sucursal')
            .leftJoinAndSelect('sucursalesInsumos.lote', 'lote');
        if (data.lote) {
            sucursalInsumosQuery.where('lote.id = :loteId', {
                loteId: data.lote.id,
            });
        }
        else {
            sucursalInsumosQuery.where('lote.id IS null');
        }
        let dataResult;
        sucursalInsumosQuery.andWhere('sucursal.id=:idSucursal AND insumo.id =:idInsumo', {
            idSucursal,
            idInsumo: data.insumo,
        });
        const dataSucursal = await sucursalInsumosQuery.getOne();
        if (dataSucursal.existencia < data.cantidad) {
            throw new common_1.HttpException('La cantidad solicitada no esta disponible en la sucursal', common_1.HttpStatus.BAD_REQUEST);
        }
        const newData = dataSucursal.existencia - data.cantidad;
        await sucursalInsumosQuery
            .update()
            .set({ existencia: newData })
            .where('id=:id', { id: dataSucursal.id })
            .execute();
        if (dataSucursal.minimo && newData <= dataSucursal.minimo) {
            this.notificacionesService.emitMinimoAlcanzado(new minimoAlcanzado_event_1.MinimoAlcanzadoEvent(dataSucursal.sucursal, dataSucursal.insumo));
        }
        return dataResult;
    }
    async procesarMinimosMaximos(xlsFile) {
        const rows = await readXlsxFile(xlsFile);
        const insumosIds = [];
        const rowInsumos = rows[2];
        insumosIds.push(parseInt(rowInsumos[1].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[4].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[7].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[10].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[13].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[16].split('|')[0]));
        insumosIds.push(parseInt(rowInsumos[19].split('|')[0]));
        const rowStart = 4;
        const rowEnd = 22;
        const totales = [
            { min: 0, max: 0 },
            { min: 0, max: 0 },
            { min: 0, max: 0 },
            { min: 0, max: 0 },
            { min: 0, max: 0 },
            { min: 0, max: 0 },
            { min: 0, max: 0 },
        ];
        for (let r = rowStart; r <= rowEnd; r++) {
            const row = rows[r];
            const sucursalId = parseInt(row[0].split('|')[0]);
            const minMax = [];
            minMax.push({ min: parseInt(row[1]), max: parseInt(row[3]) });
            totales[0].min += parseInt(row[1]);
            totales[0].max += parseInt(row[3]);
            minMax.push({ min: parseInt(row[4]), max: parseInt(row[6]) });
            totales[1].min += parseInt(row[4]);
            totales[1].max += parseInt(row[6]);
            minMax.push({ min: parseInt(row[7]), max: parseInt(row[9]) });
            totales[2].min += parseInt(row[7]);
            totales[2].max += parseInt(row[9]);
            minMax.push({ min: parseInt(row[10]), max: parseInt(row[12]) });
            totales[3].min += parseInt(row[10]);
            totales[3].max += parseInt(row[12]);
            minMax.push({ min: parseInt(row[13]), max: parseInt(row[15]) });
            totales[4].min += parseInt(row[13]);
            totales[4].max += parseInt(row[15]);
            minMax.push({ min: parseInt(row[16]), max: parseInt(row[18]) });
            totales[5].min += parseInt(row[16]);
            totales[5].max += parseInt(row[18]);
            minMax.push({ min: parseInt(row[19]), max: parseInt(row[21]) });
            totales[6].min += parseInt(row[19]);
            totales[6].max += parseInt(row[21]);
            for (let i = 0; i <= 6; i++) {
                const insumoId = insumosIds[i];
                if (minMax[i].min && minMax[i].max) {
                    const preMin = minMax[i].min / 4;
                    const preMax = minMax[i].max / 4;
                    let min = parseInt(preMin.toFixed(0));
                    min = min < 1 ? 1 : min;
                    let max = parseInt(preMax.toFixed(0));
                    max = max <= 1 ? 2 : max;
                    await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                        .createQueryBuilder('si')
                        .leftJoin('sucursal', 'sucursal')
                        .leftJoin('insumo', 'insumo')
                        .update()
                        .set({
                        minimo: min,
                        maximo: max,
                    })
                        .where('insumo.id=:insumoId AND sucursal.id=:sucursalId', {
                        insumoId,
                        sucursalId,
                    })
                        .execute();
                }
            }
        }
        const matriz = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            where: { esMatriz: true },
        });
        for (let i = 0; i <= 6; i++) {
            const insumoId = insumosIds[i];
            if (totales[i].min && totales[i].max) {
                const preMin = totales[i].min;
                const preMax = totales[i].max;
                let min = parseInt(preMin.toFixed(0));
                min = min < 1 ? 4 : min;
                let max = parseInt(preMax.toFixed(0));
                max = max <= 1 ? 8 : max;
                await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                    .createQueryBuilder('si')
                    .leftJoin('sucursal', 'sucursal')
                    .leftJoin('insumo', 'insumo')
                    .update()
                    .set({
                    minimo: min,
                    maximo: max,
                })
                    .where('insumo.id=:insumoId AND sucursal.id = :matrizId', {
                    insumoId,
                    matrizId: matriz.id,
                })
                    .execute();
            }
        }
        return rows;
    }
    async importarInsumosSucursal(xlsFile, sucursalId) {
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' insumos');
        this.logger.verbose('Para la Sucursal ' + sucursalId);
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursalId);
        if (!sucursal) {
            throw new common_1.HttpException(`No existe la sucursal ${sucursalId}`, common_1.HttpStatus.NOT_FOUND);
        }
        for (let r = 1; r <= rows.length - 1; r++) {
            const row = rows[r];
            const insumoId = row[0] ? parseInt(row[0]) : null;
            const existencia = row[3] ? parseInt(row[3]) : null;
            let loteNumero = row[4];
            let fechaOrig = row[5] || null;
            const ubicacion = row[6];
            const nombre = row[1];
            const descripcion = row[2];
            const tipoUnidadId = row[7] ? parseInt(row[7]) : null;
            if (fechaOrig) {
                fechaOrig = moment('1900-01-01')
                    .add(fechaOrig, 'days')
                    .format('YYYY-MM-DD');
            }
            if (insumoId && existencia) {
                this.logger.verbose('Procesando insumoId ' + insumoId);
                const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(insumoId);
                if (!insumo) {
                    throw new common_1.HttpException(`No existe el insumo ${insumoId}`, common_1.HttpStatus.NOT_FOUND);
                }
                if (loteNumero && typeof loteNumero === 'number') {
                    loteNumero = loteNumero.toString();
                }
                let lote = null;
                if (loteNumero && loteNumero.trim()) {
                    lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).findOne({
                        where: { numero: loteNumero.trim() },
                    });
                    if (!lote) {
                        lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).save({
                            numero: loteNumero.trim(),
                            caducidad: fechaOrig,
                        });
                    }
                }
                const existeQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                    .createQueryBuilder('si')
                    .leftJoin('si.sucursal', 's')
                    .leftJoin('si.lote', 'l')
                    .leftJoin('si.insumo', 'i')
                    .where('s.id = :sId AND i.id = :iId', {
                    sId: sucursal.id,
                    iId: insumo.id,
                });
                if (lote && lote.id) {
                    existeQuery.andWhere('l.id = :lId', { lId: lote.id });
                }
                else {
                    existeQuery.andWhere('l.id IS null');
                }
                const existe = await existeQuery.getOne();
                if (!existe) {
                    const creado = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save({
                        lote,
                        sucursal,
                        insumo,
                        existencia,
                        ubicacion,
                    });
                    this.logger.verbose('Agregada existencia a sucursal ' + creado.id);
                }
                else {
                    const updated = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).update({ id: existe.id }, {
                        existencia,
                        ubicacion,
                    });
                    this.logger.verbose('Actualizada existencia: ' + updated.affected);
                }
            }
            else if (!insumoId && existencia) {
                const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).save({
                    nombre,
                    descripcion,
                    tipoUnidadId,
                    tipoInsumoId: 14,
                });
                let lote;
                if (loteNumero) {
                    lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).findOne({
                        where: { numero: loteNumero },
                    });
                    if (!lote) {
                        lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).save({
                            numero: loteNumero,
                            caducidad: fechaOrig,
                        });
                    }
                }
                const creado = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save({
                    lote,
                    sucursal,
                    insumo,
                    existencia,
                    ubicacion,
                });
                this.logger.verbose('Agregada existencia a sucursal, insumo nuevo ' + creado.id);
            }
        }
        return rows;
    }
    async importarInsumosTodas(xlsFile) {
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' insumos');
        for (let r = 6; r <= rows.length - 1; r++) {
            const row = rows[r];
            const sucursalId = row[0] ? parseInt(row[0]) : null;
            const insumoId = row[1] ? parseInt(row[1]) : null;
            const minimo = row[2] ? parseInt(row[2]) : 0;
            const maximo = row[3] ? parseInt(row[3]) : 0;
            if (insumoId && sucursalId) {
                const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursalId);
                if (!sucursal) {
                    throw new common_1.HttpException(`No existe la sucursal ${sucursalId}`, common_1.HttpStatus.NOT_FOUND);
                }
                this.logger.verbose('Procesando insumoId ' + insumoId);
                const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(insumoId);
                if (!insumo) {
                    throw new common_1.HttpException(`No existe el insumo ${insumoId}`, common_1.HttpStatus.NOT_FOUND);
                }
                const existen = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                    .createQueryBuilder('si')
                    .leftJoin('si.sucursal', 's')
                    .leftJoin('si.insumo', 'i')
                    .where('s.id = :sId AND i.id = :iId', {
                    sId: sucursal.id,
                    iId: insumo.id,
                })
                    .getCount();
                if (!existen) {
                    const creado = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save({
                        sucursal,
                        insumo,
                        existencia: 0,
                        minimo,
                        maximo,
                    });
                    this.logger.verbose('Agregada existencia a sucursal ' + creado.id);
                }
                else {
                    const updated = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).update({ insumo, sucursal }, {
                        minimo,
                        maximo,
                    });
                    this.logger.verbose('Actualizada existencia: ' + updated.affected);
                }
            }
        }
        return rows;
    }
    async importarMinMaxSucursal(xlsFile, sucursalId) {
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursalId);
        if (!sucursal) {
            throw new common_1.HttpException(`No existe la sucursal ${sucursalId}`, common_1.HttpStatus.NOT_FOUND);
        }
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' insumos');
        for (let r = 5; r <= rows.length - 1; r++) {
            const row = rows[r];
            const insumoId = row[0] ? parseInt(row[0]) : null;
            const promedio = row[2] ? parseInt(row[2]) : 0;
            const minimo = row[3] ? parseInt(row[3]) : 0;
            const maximo = row[4] ? parseInt(row[4]) : 0;
            if (insumoId && promedio) {
                this.logger.verbose('Procesando insumoId ' + insumoId);
                const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(insumoId);
                if (insumo) {
                    const existen = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                        .createQueryBuilder('si')
                        .leftJoin('si.sucursal', 's')
                        .leftJoin('si.insumo', 'i')
                        .where('s.id = :sId AND i.id = :iId', {
                        sId: sucursal.id,
                        iId: insumo.id,
                    })
                        .getCount();
                    if (!existen) {
                        const creado = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).save({
                            sucursal,
                            insumo,
                            existencia: 0,
                            promedio,
                            minimo,
                            maximo,
                        });
                        this.logger.verbose('Agregada relación con sucursal ' + creado.id);
                    }
                    else {
                        const updated = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).update({ insumo, sucursal }, {
                            promedio,
                            minimo,
                            maximo,
                        });
                        if (updated.affected) {
                            this.logger.verbose(`Actualizados promedio(${promedio}), min(${minimo}), max(${maximo}) `);
                        }
                        else {
                            this.logger.verbose(`No se pudo actualizar el insumo ${insumo.id} de la sucursal ${sucursal.nombre}`);
                        }
                    }
                }
            }
        }
        return rows;
    }
    async calcularMinimosMaximosMatriz() {
        const insumosIds = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder()
            .select('insumoId')
            .distinct(true)
            .where('maximo >= 1')
            .getRawMany();
        const matriz = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            esMatriz: true,
        });
        const salida = [];
        for (let i = 0; i < insumosIds.length; i++) {
            const insumoId = insumosIds[i].insumoId;
            const minMax = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).query(`
        SELECT 
          SUM(maximo) AS maximo,
          SUM(minimo) AS minimo
        FROM sucursalesInsumos
        WHERE insumoId = ${insumoId} 
          AND sucursalId != ${matriz.id};
      `);
            const minimo = minMax[0].minimo;
            const maximo = minMax[0].maximo;
            await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).update({ sucursal: matriz, insumo: insumoId }, { minimo, maximo });
            salida.push({ insumo: insumoId, minimo, maximo });
        }
        return salida;
    }
};
SucursalesInsumosService = SucursalesInsumosService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], SucursalesInsumosService);
exports.SucursalesInsumosService = SucursalesInsumosService;
//# sourceMappingURL=sucursalesInsumos.service.js.map