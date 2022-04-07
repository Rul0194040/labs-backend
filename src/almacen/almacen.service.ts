import { SucursalesInsumosEntity } from './../sucursales/sucursalesInsumos.entity';
import { CreateSucursalesInsumosDTO } from './../sucursales/dto/createSucursalInsumo.dto';
import { SucursalesService } from '../sucursales/services/sucursales.service';
import { EstatusMovimiento } from './estatusMovimiento.enum';
import { DetalleMovimientosEntity } from './detalleMovimientos.entity';
import { SucursalEntity } from './../sucursales/sucursal.entity';
import { UsersEntity } from './../users/users.entity';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { MovimientosAlmacenEntity } from './movimientosAlmacen.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { CreateMovimientoDTO } from './DTOs/create-movimiento.dto';
import { UpdateMovimientoDTO } from './DTOs/update-movimiento.dto';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { CreateInformeDTO } from './DTOs/create-informe.dto';
import { TiposMovimiento } from './tiposMovimiento.enum';
import { ProveedorEntity } from '../catalogos/proveedores/proveedores.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { classToPlain } from 'class-transformer';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
import { forIn, sumBy } from 'lodash';
import { SucursalesInsumosService } from '@sanfrancisco/sucursales/services/sucursalesInsumos.service';
import * as moment from 'moment';
import { buildExport } from 'node-excel-export';

@Injectable()
export class AlmacenService {
  private readonly notFoundMessage = 'Movimiento no encontrado';
  constructor(
    private readonly _sucursalservice: SucursalesService,
    private readonly _sucursalesInsumosService: SucursalesInsumosService,
  ) {}

  async waitMovimiento(
    movimiento: TiposMovimiento,
    data: CreateSucursalesInsumosDTO,
    sucursalOrigen: number,
    sucursalDestino?: number,
  ): Promise<any> {
    switch (movimiento) {
      case TiposMovimiento.ALTA:
        this._sucursalesInsumosService.altaInsumo(sucursalOrigen, data);
        break;
      case TiposMovimiento.BAJA:
        this._sucursalesInsumosService.bajaInsumo(sucursalOrigen, data);
        break;
      case TiposMovimiento.TRANSFERENCIA:
        if (sucursalDestino) {
          this._sucursalesInsumosService.transferencia(
            sucursalDestino,
            sucursalOrigen,
            data,
          );
        }
        break;
      default:
        throw new HttpException('movimiento, no existe', HttpStatus.NOT_FOUND);
    }
  }

  async create(
    movimiento: CreateMovimientoDTO,
    detalle: any[],
    user: LoginIdentityDTO,
  ): Promise<CreateInformeDTO> {
    //busco la sucursal de origen
    const sucursalOrigen = await getRepository(SucursalEntity).findOne({
      id: movimiento.sucursalOrigen,
    });
    //busco la sucursal de origen
    const sucursalDestino = await getRepository(SucursalEntity).findOne({
      id: movimiento.sucursalDestino,
    });
    //Busco al usuario con los datos de la sesion
    const usuario = await getRepository(UsersEntity).findOne({
      id: user.id,
    });
    //contruyo el movimiento a guardar
    const movimientoToSave = {
      sucursalOrigen: sucursalOrigen,
      sucursalDestino: sucursalDestino,
      usuario: usuario,
      estatus:
        movimiento.tipoMovimiento === TiposMovimiento.TRANSFERENCIA
          ? EstatusMovimiento.TRANSITO
          : EstatusMovimiento.FINALIZADO,
      fecha: movimiento.fecha,
      notas: movimiento.notas,
      tipoMovimiento: movimiento.tipoMovimiento,
    };
    if (movimiento.tipoMovimiento === TiposMovimiento.REQUISICION) {
      movimientoToSave.estatus = EstatusMovimiento.SOLICITADO;
    }
    //en la variable savedMovimiento guardo el movimiento que acabo de crear ya guardado
    const savedMovimiento = await getRepository(MovimientosAlmacenEntity).save(
      movimientoToSave,
    );
    //busco el movimiento en la base de datos
    const queryMovimiento = await getRepository(
      MovimientosAlmacenEntity,
    ).findOne({
      id: savedMovimiento.id,
    });
    //Recorremos el detalle para insertar los registros en detalle movimiento
    for (let i = 0; i < detalle.length; i++) {
      const insumo = await getRepository(InsumoEntity).findOne({
        id: detalle[i].insumo,
      });

      const insumoData: CreateSucursalesInsumosDTO = {
        insumo: detalle[i].insumo,
        cantidad: detalle[i].cantidad,
        lote: null,
      };
      if (detalle[i].loteId) {
        const loteEntity = await getRepository(LoteEntity).findOne({
          id: detalle[i].loteId,
        });
        insumoData.lote = loteEntity;
      }

      if (queryMovimiento.tipoMovimiento !== TiposMovimiento.REQUISICION) {
        await this.waitMovimiento(
          movimiento.tipoMovimiento,
          insumoData,
          movimiento.sucursalOrigen,
          movimiento.sucursalDestino,
        );
      }

      // busca el proveedor
      const proveedor = await getRepository(ProveedorEntity).findOne({
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

      await getRepository(DetalleMovimientosEntity).save(movimientoDetalle);
      insumoData.lote = null;
    }

    const queryDetalle = await getRepository(DetalleMovimientosEntity)
      .createQueryBuilder('detalle')
      .leftJoin('detalle.movimiento', 'movimiento')
      .leftJoin('detalle.insumo', 'insumo')
      .select(['detalle', 'insumo.id', 'insumo.nombre', 'insumo.descripcion'])
      .where('movimiento.id=:movimientoId', {
        movimientoId: savedMovimiento.id,
      })
      .getMany();
    const queryMov = await getRepository(MovimientosAlmacenEntity)
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

    const query: CreateInformeDTO = {
      movimiento: queryMov,
      detalle: queryDetalle,
    };
    return query;
  }

  /**
   * obtiene los almacenes de una sucursal que sea de tipo alta
   *
   * @param idSucursal id de la sucursal
   * @returns {MovimientosAlmacenEntity[]} lista de los almacenes de altas de una sucursal
   */
  async getAlmacenesAltasBySucursal(
    idSucursal: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const sucursal = await this._sucursalservice.getById(idSucursal);
    if (!sucursal) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientosAlmacen')
      .leftJoin('movimientosAlmacen.sucursalOrigen', 'sucursalOrigen')
      .where('sucursalOrigen.id =:idSucursal', { idSucursal })
      .andWhere('movimientosAlmacen.tipoMovimiento=:tipoMovimiento', {
        tipoMovimiento: TiposMovimiento.ALTA,
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

  /**
   *Devuelve el movimiento Requisicion y los insumos en minimo en matriz
   *
   * @returns {any} insumos en la requisicion
   */
  async getInsumosByRequisicion(movimientoId: number): Promise<any> {
    //vamos por el movimiento de requisicon que buscamos

    const requisicion = await getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .select(['movimiento', 'sucursalOrigen.id', 'sucursalOrigen.nombre'])
      .andWhere('movimiento.id=:movimientoId', { movimientoId })
      .getOne();

    const sucursalOrigenId = requisicion.sucursalOrigenId;

    const insumos = await getRepository(DetalleMovimientosEntity)
      .createQueryBuilder('detalle')
      .leftJoin('detalle.insumo', 'insumo')
      .select(['insumo.id', 'insumo.nombre', 'detalle.cantidad'])
      .where('detalle.movimiento=:id', { id: requisicion.id })
      .getMany();

    const dataResult = insumos.map((p) => classToPlain(p));

    for (let index = 0; index < dataResult.length; index++) {
      const sucInsumosMatriz = await getRepository(SucursalesInsumosEntity)
        .createQueryBuilder('sucIns')
        .leftJoin('sucIns.sucursal', 'sucursal')
        .leftJoin('sucIns.insumo', 'insumo')
        .leftJoin('sucIns.lote', 'lote')
        .where(
          'insumo.id =:insumoId AND sucursal.esMatriz=:esMatriz AND sucIns.existencia > 0',
          {
            insumoId: dataResult[index].insumo.id,
            esMatriz: true,
          },
        )
        .getMany();
      const existenciaMatriz = sumBy(sucInsumosMatriz, 'existencia');

      const sucInsumos = await getRepository(SucursalesInsumosEntity)
        .createQueryBuilder('sucIns')
        .leftJoin('sucIns.sucursal', 'sucursal')
        .leftJoin('sucIns.insumo', 'insumo')
        .where(
          'sucursal.id=:origenId AND insumo.id =:insumoId AND sucIns.existencia > 0',
          {
            origenId: sucursalOrigenId,
            insumoId: dataResult[index].insumo.id,
          },
        )
        .getMany();
      const existenciaOrigen = sumBy(sucInsumos, 'existencia');
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

  /**
   * obtiene los almacenes de una sucursal que sea de tipo alta y baja
   *
   * @param idSucursal id de la sucursal
   * @returns {MovimientosAlmacenEntity[]} lista de los almacenes de altas y bajas de una sucursal
   */
  async getAlmacenesAltasBajasBySucursal(
    idSucursal: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const sucursal = await this._sucursalservice.getById(idSucursal);
    if (!sucursal) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientosAlmacen')
      .leftJoin('movimientosAlmacen.sucursalOrigen', 'sucursalOrigen')
      .where('sucursalOrigen.id =:idSucursal', { idSucursal })
      .andWhere(
        '(movimientosAlmacen.tipoMovimiento=:tipoMovimientoBaja OR movimientosAlmacen.tipoMovimiento=:tipoMovimientoAlta)',
        {
          tipoMovimientoBaja: TiposMovimiento.BAJA,
          tipoMovimientoAlta: TiposMovimiento.ALTA,
        },
      );

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

  async getAlmacenesTransferenciaBySucursal(
    idSucursal: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const sucursal = await this._sucursalservice.getById(idSucursal);
    if (!sucursal) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientosAlmacen')
      .leftJoinAndSelect(
        'movimientosAlmacen.sucursalDestino',
        'sucursalDestino',
      )
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
        tipoMovimiento: TiposMovimiento.TRANSFERENCIA,
      })
      .andWhere('movimientosAlmacen.estatus = :estatus', {
        estatus: EstatusMovimiento.TRANSITO,
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

  async getById(id: number): Promise<CreateInformeDTO> {
    const movimiento = await getRepository(MovimientosAlmacenEntity)
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
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    const seleccion =
      movimiento.tipoMovimiento === TiposMovimiento.ALTA
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
    const detalle = await getRepository(DetalleMovimientosEntity)
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
      throw new HttpException('detalle no encontrado', HttpStatus.NOT_FOUND);
    }

    const query: CreateInformeDTO = {
      movimiento: movimiento,
      detalle: detalle,
    };
    return query;
  }

  async update(
    id: number,
    movimiento: UpdateMovimientoDTO,
  ): Promise<UpdateResult> {
    const Field = await this.getById(id);

    if (!Field) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(MovimientosAlmacenEntity).update(
      { id },
      movimiento,
    );
  }

  async setStatus(id: number, status: string): Promise<UpdateResult> {
    const field = await getRepository(MovimientosAlmacenEntity).findOne({ id });

    if (!field) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    let dataResult: UpdateResult;

    switch (status) {
      case 'SOLICITADO':
        if (field.estatus != 'SOLICITADO') {
          dataResult = await getRepository(MovimientosAlmacenEntity)
            .createQueryBuilder()
            .update(field)
            .set({ estatus: EstatusMovimiento.SOLICITADO })
            .where({ id: field.id })
            .execute();
        }

        break;
      case 'APROBADO':
        if (field.estatus != 'APROBADO') {
          dataResult = await getRepository(MovimientosAlmacenEntity)
            .createQueryBuilder()
            .update(field)
            .set({ estatus: EstatusMovimiento.APROBADO })
            .where({ id: field.id })
            .execute();
        }

        break;
      case 'FINALIZADO':
        if (field.estatus != 'FINALIZADO') {
          dataResult = await getRepository(MovimientosAlmacenEntity)
            .createQueryBuilder()
            .update(field)
            .set({ estatus: EstatusMovimiento.FINALIZADO })
            .where({ id: field.id })
            .execute();
        }

        break;
      case 'TRANSITO_PARCIAL':
        if (field.estatus != 'TRANSITO_PARCIAL') {
          dataResult = await getRepository(MovimientosAlmacenEntity)
            .createQueryBuilder()
            .update(field)
            .set({ estatus: EstatusMovimiento.TRANSITO_PARCIAL })
            .where({ id: field.id })
            .execute();
        }

        break;
      case 'TRANSITO':
        if (field.estatus != 'TRANSITO') {
          dataResult = await getRepository(MovimientosAlmacenEntity)
            .createQueryBuilder()
            .update(field)
            .set({ estatus: EstatusMovimiento.TRANSITO })
            .where({ id: field.id })
            .execute();
        }

        break;

      default:
        throw new HttpException('estatus no existe', HttpStatus.BAD_REQUEST);
    }

    return dataResult;
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(MovimientosAlmacenEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);

    forIn(options.filters, (value, key) => {
      switch (key) {
        case 'buscar':
          const term =
            '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
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
          dataQuery.andWhere(
            'movimiento.sucursalOrigenId = :sucursalOrigenId',
            {
              sucursalOrigenId: value,
            },
          );
          break;
        case 'sucursalDestinoId':
          dataQuery.andWhere(
            'movimiento.sucursalDestinoId = :sucursalDestinoId',
            {
              sucursalDestinoId: value,
            },
          );
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

  /**
   * Pagina las requisiciones
   * @param options opciones de paginacion de los registros
   */
  async paginateRequisicion(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
      .where('movimiento.tipoMovimiento =:tipo', { tipo: 'REQUISICION' });

    forIn(options.filters, (value, key) => {
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

  /**
   * Pagina las requisiciones por sucursal
   * @param options opciones de paginacion de los registros
   */
  async paginateRequisicionbySucursal(
    options: PaginationOptions,
    sucursal: number,
    user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    const sucursalOrigen = await getRepository(SucursalEntity).findOne(
      sucursal,
    );

    if (!sucursalOrigen) {
      throw new HttpException(
        'la sucursal de destino no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    const usuario = await getRepository(UsersEntity).findOne(user.id);

    if (!usuario) {
      throw new HttpException('el usuario no existe', HttpStatus.NOT_FOUND);
    }

    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
      .where(
        'movimiento.tipoMovimiento =:tipo AND sucursalOrigen.id=:origenId',
        { tipo: 'REQUISICION', origenId: sucursalOrigen.id },
      );

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
    } else {
      throw new HttpException(
        'no esta autorizado a ver esta informacion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Pagina las transferencias a perfil compras y almacen general
   * @param options opciones de paginacion de los registros
   */
  async paginateTransferencia(
    options: PaginationOptions,
    user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    const usuario = await getRepository(UsersEntity).findOne(user.id);

    if (!usuario) {
      throw new HttpException('el usuario no existe', HttpStatus.NOT_FOUND);
    }

    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino'])
      .where('movimiento.tipoMovimiento =:tipo', { tipo: 'TRANSFERENCIA' });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'createdAt';
    }

    if (
      usuario.profile === 'compras' ||
      usuario.profile === 'almacen_general'
    ) {
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
    } else {
      throw new HttpException(
        'no esta autorizado a ver esta informacion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Pagina las transferencias para almacen
   * @param options opciones de paginacion de los registros
   */
  async paginateRecibidosMatriz(
    options: PaginationOptions,
    user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    const usuario = await getRepository(UsersEntity).findOne(user.id);

    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .where(
        'movimiento.tipoMovimiento =:tipo AND movimiento.estatus =:status AND sucursalOrigen.esMatriz=true',
        { status: 'FINALIZADO', tipo: 'TRANSFERENCIA' },
      )
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
    if (options.filters.buscar) {
      const term =
        '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
      dataQuery.orWhere('movimiento.notas like :term', { term });
      dataQuery.orWhere('sucursalOrigen.nombre like :term', { term });
      dataQuery.orWhere('sucursalDestino.nombre like :term', { term });
      dataQuery.orWhere('movimiento.estatus like :term', { term });
    }

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'createdAt';
    }
    if (
      usuario.profile === 'almacen_general' ||
      usuario.profile === ProfileTypes.COMPRAS
    ) {
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

  /**
   * Pagina los movimientos transito parcial
   * @param options opciones de paginacion de los registros
   */
  async paginateTransitoParcial(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .where('movimiento.estatus =:status', {
        status: EstatusMovimiento.TRANSITO_PARCIAL,
      })
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
    if (options.filters.buscar) {
      const term =
        '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
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

  /**
   * Pagina los moviminetos en transito para almacen
   * @param options opciones de paginacion de los registros
   */
  async paginateTransito(
    options: PaginationOptions,
    user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    const usuario = await getRepository(UsersEntity).findOne(user.id);

    const dataQuery = getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
      .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
      .where(
        'movimiento.tipoMovimiento=:tipo AND movimiento.estatus =:status AND sucursalOrigen.esMatriz=true',
        {
          tipo: 'TRANSFERENCIA',
          status: 'TRANSITO',
        },
      )
      .select(['movimiento', 'sucursalOrigen', 'sucursalDestino']);
    if (options.filters.buscar) {
      const term =
        '%' + options.filters.buscar.trim().split(' ').join('%') + '%';
      dataQuery.orWhere('movimiento.notas like :term', { term });
      dataQuery.orWhere('sucursalOrigen.nombre like :term', { term });
      dataQuery.orWhere('sucursalDestino.nombre like :term', { term });
      dataQuery.orWhere('movimiento.estatus like :term', { term });
    }

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'createdAt';
    }
    if (
      usuario.profile === 'almacen_general' ||
      usuario.profile === ProfileTypes.COMPRAS
    ) {
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

  async filtroMovimientos(start: string, end: string): Promise<Uint8Array> {
    const query = getRepository(MovimientosAlmacenEntity).createQueryBuilder(
      'movimientos',
    );

    query.leftJoinAndSelect('movimientos.detalle', 'detalle');
    query.leftJoinAndSelect('detalle.insumo', 'insumo');
    //query.leftJoinAndSelect('detalle.lote', 'lote');

    query.where('movimientos.tipoMovimiento=:tipo', {
      tipo: TiposMovimiento.TRANSFERENCIA,
    });

    //entre fechas
    if (start && end) {
      const ini = moment(start).format('YYYY-MM-DD') + ' 00:00:00';
      const fin = moment(end).format('YYYY-MM-DD') + ' 23:59:59';
      query.andWhere('(movimientos.fecha BETWEEN :ini AND :fin)', {
        ini,
        fin,
      });
    }

    //Filtrar movimientos en transito y/o recibidos
    query.andWhere(
      '(movimientos.estatus=:estatus1 OR movimientos.estatus=:estatus2)',
      {
        estatus1: EstatusMovimiento.TRANSITO,
        estatus2: EstatusMovimiento.FINALIZADO,
      },
    );

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

    const report = buildExport([
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
}
