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
exports.AlmacenService = void 0;
const sucursalesInsumos_entity_1 = require("./../sucursales/sucursalesInsumos.entity");
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
const estatusMovimiento_enum_1 = require("./estatusMovimiento.enum");
const detalleMovimientos_entity_1 = require("./detalleMovimientos.entity");
const sucursal_entity_1 = require("./../sucursales/sucursal.entity");
const users_entity_1 = require("./../users/users.entity");
const typeorm_1 = require("typeorm");
const movimientosAlmacen_entity_1 = require("./movimientosAlmacen.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const insumo_entity_1 = require("../insumos/insumo.entity");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const tiposMovimiento_enum_1 = require("./tiposMovimiento.enum");
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const profiles_enum_1 = require("../users/profiles.enum");
const lotes_entity_1 = require("../lotes/lotes.entity");
const lodash_1 = require("lodash");
const sucursalesInsumos_service_1 = require("../sucursales/services/sucursalesInsumos.service");
const moment = require("moment");
const node_excel_export_1 = require("node-excel-export");
let AlmacenService = class AlmacenService {
    constructor(_sucursalservice, _sucursalesInsumosService) {
        this._sucursalservice = _sucursalservice;
        this._sucursalesInsumosService = _sucursalesInsumosService;
        this.notFoundMessage = 'Movimiento no encontrado';
    }
    async waitMovimiento(movimiento, data, sucursalOrigen, sucursalDestino) {
        switch (movimiento) {
            case tiposMovimiento_enum_1.TiposMovimiento.ALTA:
                this._sucursalesInsumosService.altaInsumo(sucursalOrigen, data);
                break;
            case tiposMovimiento_enum_1.TiposMovimiento.BAJA:
                this._sucursalesInsumosService.bajaInsumo(sucursalOrigen, data);
                break;
            case tiposMovimiento_enum_1.TiposMovimiento.TRANSFERENCIA:
                if (sucursalDestino) {
                    this._sucursalesInsumosService.transferencia(sucursalDestino, sucursalOrigen, data);
                }
                break;
            default:
                throw new common_1.HttpException('movimiento, no existe', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async create(movimiento, detalle, user) {
        const sucursalOrigen = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: movimiento.sucursalOrigen,
        });
        const sucursalDestino = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
            id: movimiento.sucursalDestino,
        });
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
            id: user.id,
        });
        const movimientoToSave = {
            sucursalOrigen: sucursalOrigen,
            sucursalDestino: sucursalDestino,
            usuario: usuario,
            estatus: movimiento.tipoMovimiento === tiposMovimiento_enum_1.TiposMovimiento.TRANSFERENCIA
                ? estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO
                : estatusMovimiento_enum_1.EstatusMovimiento.FINALIZADO,
            fecha: movimiento.fecha,
            notas: movimiento.notas,
            tipoMovimiento: movimiento.tipoMovimiento,
        };
        if (movimiento.tipoMovimiento === tiposMovimiento_enum_1.TiposMovimiento.REQUISICION) {
            movimientoToSave.estatus = estatusMovimiento_enum_1.EstatusMovimiento.SOLICITADO;
        }
        const savedMovimiento = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).save(movimientoToSave);
        const queryMovimiento = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).findOne({
            id: savedMovimiento.id,
        });
        for (let i = 0; i < detalle.length; i++) {
            const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne({
                id: detalle[i].insumo,
            });
            const insumoData = {
                insumo: detalle[i].insumo,
                cantidad: detalle[i].cantidad,
                lote: null,
            };
            if (detalle[i].loteId) {
                const loteEntity = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).findOne({
                    id: detalle[i].loteId,
                });
                insumoData.lote = loteEntity;
            }
            if (queryMovimiento.tipoMovimiento !== tiposMovimiento_enum_1.TiposMovimiento.REQUISICION) {
                await this.waitMovimiento(movimiento.tipoMovimiento, insumoData, movimiento.sucursalOrigen, movimiento.sucursalDestino);
            }
            const proveedor = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
                id: detalle[i].proveedor,
            });
            const movimientoDetalle = {
                movimiento: queryMovimiento,
                insumo: insumo,
                cantidad: detalle[i].cantidad,
                costo: detalle[i].costo,
                lote: insumoData.lote,
                fechaCaducidad: detalle[i].fechaCaducidad,
                numeroDocumento: detalle[i].numeroDocumento,
                proveedor: proveedor,
            };
            await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity).save(movimientoDetalle);
            insumoData.lote = null;
        }
        const queryDetalle = await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
            .createQueryBuilder('detalle')
            .leftJoin('detalle.movimiento', 'movimiento')
            .leftJoin('detalle.insumo', 'insumo')
            .select(['detalle', 'insumo.id', 'insumo.nombre', 'insumo.descripcion'])
            .where('movimiento.id=:movimientoId', {
            movimientoId: savedMovimiento.id,
        })
            .getMany();
        const queryMov = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('mov')
            .leftJoinAndSelect('mov.sucursalOrigen', 'sucursalOrigen')
            .leftJoinAndSelect('mov.sucursalDestino', 'sucursalDestino')
            .select([
            'mov',
            'sucursalOrigen.id',
            'sucursalOrigen.nombre',
            'sucursalDestino.id',
            'sucursalDestino.nombre',
        ])
            .where('mov.id = :id', { id: savedMovimiento.id })
            .getOne();
        const query = {
            movimiento: queryMov,
            detalle: queryDetalle,
        };
        return query;
    }
    async getAlmacenesAltasBySucursal(idSucursal, options) {
        const sucursal = await this._sucursalservice.getById(idSucursal);
        if (!sucursal) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientosAlmacen')
            .leftJoin('movimientosAlmacen.sucursalOrigen', 'sucursalOrigen')
            .where('sucursalOrigen.id =:idSucursal', { idSucursal })
            .andWhere('movimientosAlmacen.tipoMovimiento=:tipoMovimiento', {
            tipoMovimiento: tiposMovimiento_enum_1.TiposMovimiento.ALTA,
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getInsumosByRequisicion(movimientoId) {
        const requisicion = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .select(['movimiento', 'sucursalOrigen.id', 'sucursalOrigen.nombre'])
            .andWhere('movimiento.id=:movimientoId', { movimientoId })
            .getOne();
        const sucursalOrigenId = requisicion.sucursalOrigenId;
        const insumos = await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
            .createQueryBuilder('detalle')
            .leftJoin('detalle.insumo', 'insumo')
            .select(['insumo.id', 'insumo.nombre', 'detalle.cantidad'])
            .where('detalle.movimiento=:id', { id: requisicion.id })
            .getMany();
        const dataResult = insumos.map((p) => class_transformer_1.classToPlain(p));
        for (let index = 0; index < dataResult.length; index++) {
            const sucInsumosMatriz = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder('sucIns')
                .leftJoin('sucIns.sucursal', 'sucursal')
                .leftJoin('sucIns.insumo', 'insumo')
                .leftJoin('sucIns.lote', 'lote')
                .where('insumo.id =:insumoId AND sucursal.esMatriz=:esMatriz AND sucIns.existencia > 0', {
                insumoId: dataResult[index].insumo.id,
                esMatriz: true,
            })
                .getMany();
            const existenciaMatriz = lodash_1.sumBy(sucInsumosMatriz, 'existencia');
            const sucInsumos = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder('sucIns')
                .leftJoin('sucIns.sucursal', 'sucursal')
                .leftJoin('sucIns.insumo', 'insumo')
                .where('sucursal.id=:origenId AND insumo.id =:insumoId AND sucIns.existencia > 0', {
                origenId: sucursalOrigenId,
                insumoId: dataResult[index].insumo.id,
            })
                .getMany();
            const existenciaOrigen = lodash_1.sumBy(sucInsumos, 'existencia');
            dataResult[index].existenciaMatriz = existenciaMatriz
                ? existenciaMatriz
                : null;
            dataResult[index].minimo = sucInsumos[0].minimo;
            dataResult[index].maximo = sucInsumos[0].maximo;
            dataResult[index].existenciaOrigen = existenciaOrigen;
        }
        const data = {
            requisicion,
            insumos: dataResult,
        };
        return data;
    }
    async getAlmacenesAltasBajasBySucursal(idSucursal, options) {
        const sucursal = await this._sucursalservice.getById(idSucursal);
        if (!sucursal) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientosAlmacen')
            .leftJoin('movimientosAlmacen.sucursalOrigen', 'sucursalOrigen')
            .where('sucursalOrigen.id =:idSucursal', { idSucursal })
            .andWhere('(movimientosAlmacen.tipoMovimiento=:tipoMovimientoBaja OR movimientosAlmacen.tipoMovimiento=:tipoMovimientoAlta)', {
            tipoMovimientoBaja: tiposMovimiento_enum_1.TiposMovimiento.BAJA,
            tipoMovimientoAlta: tiposMovimiento_enum_1.TiposMovimiento.ALTA,
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getAlmacenesTransferenciaBySucursal(idSucursal, options) {
        const sucursal = await this._sucursalservice.getById(idSucursal);
        if (!sucursal) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientosAlmacen')
            .leftJoinAndSelect('movimientosAlmacen.sucursalDestino', 'sucursalDestino')
            .leftJoinAndSelect('movimientosAlmacen.sucursalOrigen', 'sucursalOrigen')
            .select([
            'movimientosAlmacen',
            'sucursalDestino.id',
            'sucursalDestino.nombre',
            'sucursalOrigen.id',
            'sucursalOrigen.nombre',
        ])
            .where('sucursalDestino.id =:idSucursal', { idSucursal })
            .andWhere('movimientosAlmacen.tipoMovimiento=:tipoMovimiento', {
            tipoMovimiento: tiposMovimiento_enum_1.TiposMovimiento.TRANSFERENCIA,
        })
            .andWhere('movimientosAlmacen.estatus = :estatus', {
            estatus: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO,
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy('movimientosAlmacen.createdAt', 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getById(id) {
        const movimiento = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select([
            'movimiento',
            'sucursalOrigen.id',
            'sucursalOrigen.nombre',
            'sucursalDestino.id',
            'sucursalDestino.nombre',
        ])
            .where('movimiento.id=:movimientoId', { movimientoId: id })
            .getOne();
        if (!movimiento) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const seleccion = movimiento.tipoMovimiento === tiposMovimiento_enum_1.TiposMovimiento.ALTA
            ? [
                'detalle',
                'insumo.id',
                'insumo.nombre',
                'insumo.descripcion',
                'insumo.descuentaEn',
                'tipoInsumo.id',
                'lote.id',
                'lote.numero',
                'lote.descripcion',
                'lote.caducidad',
                'tipoInsumo.nombre',
                'tipoUnidad.id',
                'tipoUnidad.nombre',
                'proveedor.id',
                'proveedor.nombre',
            ]
            : [
                'detalle',
                'insumo.id',
                'insumo.nombre',
                'insumo.descripcion',
                'insumo.descuentaEn',
                'tipoInsumo.id',
                'tipoInsumo.nombre',
                'tipoUnidad.id',
                'tipoUnidad.nombre',
                'lote.id',
                'lote.numero',
                'lote.descripcion',
                'lote.caducidad',
            ];
        const detalle = await typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
            .createQueryBuilder('detalle')
            .leftJoin('detalle.movimiento', 'movimiento')
            .leftJoin('detalle.insumo', 'insumo')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .leftJoin('detalle.lote', 'lote')
            .leftJoin('detalle.proveedor', 'proveedor')
            .select(seleccion)
            .where('detalle.movimientoId=:movimientoId', { movimientoId: id })
            .getMany();
        if (!detalle) {
            throw new common_1.HttpException('detalle no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const query = {
            movimiento: movimiento,
            detalle: detalle,
        };
        return query;
    }
    async update(id, movimiento) {
        const Field = await this.getById(id);
        if (!Field) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).update({ id }, movimiento);
    }
    async setStatus(id, status) {
        const field = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).findOne({ id });
        if (!field) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        let dataResult;
        switch (status) {
            case 'SOLICITADO':
                if (field.estatus != 'SOLICITADO') {
                    dataResult = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                        .createQueryBuilder()
                        .update(field)
                        .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.SOLICITADO })
                        .where({ id: field.id })
                        .execute();
                }
                break;
            case 'APROBADO':
                if (field.estatus != 'APROBADO') {
                    dataResult = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                        .createQueryBuilder()
                        .update(field)
                        .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.APROBADO })
                        .where({ id: field.id })
                        .execute();
                }
                break;
            case 'FINALIZADO':
                if (field.estatus != 'FINALIZADO') {
                    dataResult = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                        .createQueryBuilder()
                        .update(field)
                        .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.FINALIZADO })
                        .where({ id: field.id })
                        .execute();
                }
                break;
            case 'TRANSITO_PARCIAL':
                if (field.estatus != 'TRANSITO_PARCIAL') {
                    dataResult = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                        .createQueryBuilder()
                        .update(field)
                        .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO_PARCIAL })
                        .where({ id: field.id })
                        .execute();
                }
                break;
            case 'TRANSITO':
                if (field.estatus != 'TRANSITO') {
                    dataResult = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
                        .createQueryBuilder()
                        .update(field)
                        .set({ estatus: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO })
                        .where({ id: field.id })
                        .execute();
                }
                break;
            default:
                throw new common_1.HttpException('estatus no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        return dataResult;
    }
    async delete(id) {
        return typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
        lodash_1.forIn(options.filters, (value, key) => {
            switch (key) {
                case 'buscar':
                    const term = '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
                    dataQuery.orWhere('movimiento.notas like :term', { term });
                    dataQuery.orWhere('sucursalOrigen.nombre like :term', { term });
                    dataQuery.orWhere('sucursalDestino.nombre like :term', { term });
                    dataQuery.orWhere('movimiento.estatus like :term', { term });
                    break;
                case 'fecha':
                    const fecha = value.split('*');
                    const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
                    const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
                    dataQuery.andWhere('movimiento.fecha BETWEEN :inicio AND :fin', {
                        inicio,
                        fin,
                    });
                    break;
                case 'status':
                    dataQuery.andWhere('movimiento.estatus = :estatus', {
                        estatus: value,
                    });
                    break;
                case 'sucursalOrigenId':
                    dataQuery.andWhere('movimiento.sucursalOrigenId = :sucursalOrigenId', {
                        sucursalOrigenId: value,
                    });
                    break;
                case 'sucursalDestinoId':
                    dataQuery.andWhere('movimiento.sucursalDestinoId = :sucursalDestinoId', {
                        sucursalDestinoId: value,
                    });
                    break;
                case 'tipoMovimiento':
                    dataQuery.andWhere('movimiento.tipoMovimiento = :tipoMovimiento', {
                        tipoMovimiento: value,
                    });
                    break;
                default:
                    break;
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'movimiento.createdAt';
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
    async paginateRequisicion(options) {
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
            .where('movimiento.tipoMovimiento =:tipo', { tipo: 'REQUISICION' });
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'filter') {
                dataQuery.andWhere('sucursalOrigen.nombre like :term', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('movimiento.notas like :term', {
                    term: `%${value.split(' ').join('%')}%`,
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
    async paginateRequisicionbySucursal(options, sucursal, user) {
        const sucursalOrigen = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursal);
        if (!sucursalOrigen) {
            throw new common_1.HttpException('la sucursal de destino no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(user.id);
        if (!usuario) {
            throw new common_1.HttpException('el usuario no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
            .where('movimiento.tipoMovimiento =:tipo AND sucursalOrigen.id=:origenId', { tipo: 'REQUISICION', origenId: sucursalOrigen.id });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        if (usuario.profile === 'sucursal') {
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
        else {
            throw new common_1.HttpException('no esta autorizado a ver esta informacion', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async paginateTransferencia(options, user) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(user.id);
        if (!usuario) {
            throw new common_1.HttpException('el usuario no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
            .where('movimiento.tipoMovimiento =:tipo', { tipo: 'TRANSFERENCIA' });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        if (usuario.profile === 'compras' ||
            usuario.profile === 'almacen_general') {
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
        else {
            throw new common_1.HttpException('no esta autorizado a ver esta informacion', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async paginateRecibidosMatriz(options, user) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(user.id);
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .where('movimiento.tipoMovimiento =:tipo AND movimiento.estatus =:status AND sucursalOrigen.esMatriz=true', { status: 'FINALIZADO', tipo: 'TRANSFERENCIA' })
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
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
        if (usuario.profile === 'almacen_general' ||
            usuario.profile === profiles_enum_1.ProfileTypes.COMPRAS) {
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
    }
    async paginateTransitoParcial(options) {
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .where('movimiento.estatus =:status', {
            status: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO_PARCIAL,
        })
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
        if (options.filters.buscar) {
            const term = '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
            dataQuery.andWhere('movimiento.tipoMovimiento like :term', { term });
        }
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
    async paginateTransito(options, user) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(user.id);
        const dataQuery = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .where('movimiento.tipoMovimiento=:tipo AND movimiento.estatus =:status AND sucursalOrigen.esMatriz=true', {
            tipo: 'TRANSFERENCIA',
            status: 'TRANSITO',
        })
            .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
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
        if (usuario.profile === 'almacen_general' ||
            usuario.profile === profiles_enum_1.ProfileTypes.COMPRAS) {
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
    }
    async filtroMovimientos(start, end) {
        const query = typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity).createQueryBuilder('movimientos');
        query.leftJoinAndSelect('movimientos.detalle', 'detalle');
        query.leftJoinAndSelect('detalle.insumo', 'insumo');
        query.where('movimientos.tipoMovimiento=:tipo', {
            tipo: tiposMovimiento_enum_1.TiposMovimiento.TRANSFERENCIA,
        });
        if (start && end) {
            const ini = moment(start).format('YYYY-MM-DD') + ' 00:00:00';
            const fin = moment(end).format('YYYY-MM-DD') + ' 23:59:59';
            query.andWhere('(movimientos.fecha BETWEEN :ini AND :fin)', {
                ini,
                fin,
            });
        }
        query.andWhere('(movimientos.estatus=:estatus1 OR movimientos.estatus=:estatus2)', {
            estatus1: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO,
            estatus2: estatusMovimiento_enum_1.EstatusMovimiento.FINALIZADO,
        });
        query.groupBy('detalle.insumo.id');
        query.select([
            'insumo.id AS id',
            'insumo.nombre AS nombre',
            'SUM(detalle.cantidad) AS total',
        ]);
        const result = await query.getRawMany();
        const styles = {
            header: {
                font: { color: { rgb: 'FF000000' }, sz: 12, bold: true },
                alignment: { horizontal: 'center' },
                height: 50,
            },
            header2: {
                font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
                alignment: { horizontal: 'center' },
            },
            cellHeader: {
                font: {
                    color: { rgb: 'FF000000' },
                    sz: 10,
                    bold: true,
                },
                alignment: { horizontal: 'center' },
            },
            cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
            cellCenter: {
                alignment: { horizontal: 'center' },
                font: { sz: 10 },
            },
            cellNumber: {
                alignment: { horizontal: 'right' },
                font: { sz: 10 },
            },
        };
        const heading = [
            [{ value: 'Laboratorio San Francisco', style: styles.header }],
            [{ value: 'Movimientos por Insumo', style: styles.header2 }],
            [
                {
                    value: `En Tránsito y Finalizados entre ${start} y ${end}`,
                    style: styles.header2,
                },
            ],
            [''],
        ];
        const specification = {
            id: {
                displayName: 'Id',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 50,
            },
            nombre: {
                displayName: 'Nombre',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 200,
            },
            total: {
                displayName: 'Total',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellNumber,
                width: 100,
            },
        };
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 3 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 3 } },
            { start: { row: 3, column: 1 }, end: { row: 3, column: 3 } },
        ];
        const report = node_excel_export_1.buildExport([
            {
                name: 'Reporte Movimientos por insumo',
                heading: heading,
                merges: merges,
                specification: specification,
                data: result,
            },
        ]);
        return report;
    }
};
AlmacenService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sucursales_service_1.SucursalesService,
        sucursalesInsumos_service_1.SucursalesInsumosService])
], AlmacenService);
exports.AlmacenService = AlmacenService;
//# sourceMappingURL=almacen.service.js.map