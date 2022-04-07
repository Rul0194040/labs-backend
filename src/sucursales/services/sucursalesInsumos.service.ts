import { EstatusPresupuesto } from '../../presupuestos/EstatusPresupuesto.enum';
import { PresupuestoDetalleEntity } from '../../presupuestos/presupuestosDetalle.entity';
import { PaginationPrimeNgResult } from '../../common/DTO/pagination-prime-Ng-result.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SucursalEntity } from '../sucursal.entity';
import { getConnection, getRepository, UpdateResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { groupBy, sumBy } from 'lodash';
import { SucursalesInsumosEntity } from '../sucursalesInsumos.entity';
import { CreateSucursalesInsumosDTO } from '../dto/createSucursalInsumo.dto';
import { InsumoEntity } from '../../insumos/insumo.entity';
import { UpdateSucursalesInsumosDTO } from '../dto/updateSucursalInsumo.dto';
import { CreateMovimientoDTO } from '@sanfrancisco/almacen/DTOs/create-movimiento.dto';
import { DetalleMovimientosEntity } from '../../almacen/detalleMovimientos.entity';
import { MovimientosAlmacenEntity } from '../../almacen/movimientosAlmacen.entity';
import { EstatusMovimiento } from '@sanfrancisco/almacen/estatusMovimiento.enum';
import { MinimoAlcanzadoEvent } from '@sanfrancisco/notificaciones/events/minimoAlcanzado.event';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
import { EstatusCompra } from '@sanfrancisco/compras/EstatusCompra.enum';
import { DetalleCompraEntity } from '@sanfrancisco/compras/detallesCompras.entity';
import * as readXlsxFile from 'read-excel-file/node';
import * as moment from 'moment';
import { MyLogger } from '@sanfrancisco/logger';
@Injectable()
export class SucursalesInsumosService {
  constructor(private readonly notificacionesService: NotificacionesService) {}
  private readonly notFoundMessage = 'Sucursal no encontrada';
  private readonly logger = new MyLogger(SucursalesInsumosService.name);
  /**
   * Agregar insumos a una sucursal
   *
   * @param insumoData informacion para crear el insumo por sucursal
   * @returns {SucursalesInsumosEntity} registro creado en la tabla
   */
  async transferencia(
    destinoId: number,
    origenId: number,
    insumoData: CreateSucursalesInsumosDTO,
  ): Promise<any> {
    let updateResult: any;

    const sucursalDestino = await getRepository(SucursalEntity).findOne({
      id: destinoId,
    });

    const sucursalOrigen = await getRepository(SucursalEntity).findOne({
      id: origenId,
    });

    if (!sucursalDestino || !sucursalOrigen) {
      throw new HttpException(
        'La transferencia es imposible',
        HttpStatus.NOT_FOUND,
      );
    }

    const insumo = await getRepository(InsumoEntity)
      .createQueryBuilder()
      .where('id=:id', { id: insumoData.insumo })
      .getOne();
    if (!insumo) {
      throw new HttpException('El insumo no existe', HttpStatus.NOT_FOUND);
    }

    if (sucursalDestino && sucursalOrigen && insumo) {
      const insumoEnEmisor = getRepository(SucursalesInsumosEntity)
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
      } else {
        insumoEnEmisor.andWhere('lote.id IS null');
      }
      const resultInsumosEmisor = await insumoEnEmisor.getOne(); //getmany, la verdadera existencia es la suma de esos registros

      if (resultInsumosEmisor) {
        const newCantidadOrigen =
          resultInsumosEmisor.existencia - insumoData.cantidad;
        const updateQuery = getRepository(SucursalesInsumosEntity)
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
        } else {
          updateQuery.andWhere('lote.id IS null');
        }
        updateResult = await updateQuery
          .update()
          .set({ existencia: newCantidadOrigen })
          .execute();
        //llegamos al minimo?
        if (
          resultInsumosEmisor.minimo &&
          newCantidadOrigen <= resultInsumosEmisor.minimo
        ) {
          //!hemos llegado al minimo, notificar
          this.notificacionesService.emitMinimoAlcanzado(
            new MinimoAlcanzadoEvent(
              resultInsumosEmisor.sucursal,
              resultInsumosEmisor.insumo,
              /** usuario */
            ),
          );
        }
      } else {
        const sucursalInsumotoCreate = {
          sucursal: sucursalOrigen,
          insumo: insumo,
          existencia: insumoData.cantidad,
        };

        updateResult = await getRepository(SucursalesInsumosEntity).save(
          sucursalInsumotoCreate,
        );
      }
    }

    return updateResult;
  }

  async cancelarTransferencia(movimientoId: number): Promise<UpdateResult> {
    //Voy por el objeto movimiento-almacen que se creo concecuencia de la transferencia erronea
    const movimiento = await getRepository(MovimientosAlmacenEntity).findOne(
      movimientoId,
    );

    if (
      movimiento.estatus !== EstatusMovimiento.TRANSITO // y si esta en transito
    ) {
      throw new HttpException(
        'La cancelación de la transferencia es imposible',
        HttpStatus.NOT_FOUND,
      );
    }

    //buscar sus detallesmovimiento con un for y por cada detmov {suc, insum, lote}
    //buscamos en sucursales insumos insumos, lotes
    //si trae lote lo buscamos, esa cantidad que trae se la sumamos a la sucursal matriz

    const queryDetMov = await getRepository(DetalleMovimientosEntity)
      .createQueryBuilder('det')
      .leftJoin('det.movimiento', 'mov')
      .where('mov.id=:movimientoId', { movimientoId })
      .getMany();

    if (queryDetMov.length) {
      for (let idx = 0; idx < queryDetMov.length; idx++) {
        const detMov = queryDetMov[idx];
        const sucIns = getRepository(SucursalesInsumosEntity)
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
        } else {
          sucIns.andWhere('lote.id IS null');
        }

        const queryResult = await sucIns.getOne();

        if (queryResult) {
          const newCantidad =
            Number(detMov.cantidad) + Number(queryResult.existencia);
          await getRepository(SucursalesInsumosEntity)
            .createQueryBuilder()
            .update()
            .set({ existencia: Number(newCantidad) })
            .where('id=:id', { id: queryResult.id })
            .execute();
        }
      }

      return await getRepository(MovimientosAlmacenEntity)
        .createQueryBuilder()
        .update()
        .set({ estatus: EstatusMovimiento.CANCELADO })
        .where('id=:id', { id: movimiento.id })
        .execute();
    }
  }

  /**
   * verifica las cantidades recibidas producto de una transferencia y actualiza la
   * informacion correspondiente
   * @param movimiento {CreateMovimientoDTO}
   * @param detalle any
   * @returns {MovimientosAlmacenEntity}
   */
  async verificarTransferencia(
    movimiento: CreateMovimientoDTO,
    detalle: any[],
  ): Promise<MovimientosAlmacenEntity> {
    let transitoParcial = false;
    const sucursalDestino = await getRepository(SucursalEntity).findOne({
      id: movimiento.sucursalDestino,
    });

    let lote: LoteEntity = null;
    for (let index = 0; index < detalle.length; index++) {
      // si la cantidad recibida es igual a la cantidad enviada se actualiza los insumos de la sucursal
      const insumoEnSucursalDestinoQuery = getRepository(
        SucursalesInsumosEntity,
      )
        .createQueryBuilder('SucursalesInsumos')
        .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
        .leftJoin('SucursalesInsumos.insumo', 'insumo')
        .leftJoin('SucursalesInsumos.lote', 'lote')
        .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
          idSucursal: sucursalDestino.id,
          idInsumo: detalle[index].insumo,
        });

      if (detalle[index].loteId) {
        lote = await getRepository(LoteEntity).findOne({
          id: detalle[index].loteId,
        });
        insumoEnSucursalDestinoQuery.andWhere('lote.id = :loteId', {
          loteId: lote.id,
        });
      } else {
        insumoEnSucursalDestinoQuery.andWhere('lote.id IS null');
      }

      const insumoEnSucursalDestino =
        await insumoEnSucursalDestinoQuery.getOne();

      if (insumoEnSucursalDestino) {
        const newCantidadDestino =
          insumoEnSucursalDestino.existencia + detalle[index].cantidadRecibida;
        await insumoEnSucursalDestinoQuery
          .update()
          .set({ existencia: newCantidadDestino })
          .execute();
      } else {
        const insumoNuevo = await getRepository(InsumoEntity).findOne({
          id: detalle[index].insumo,
        });
        const sucursalInsumotoCreate = {
          sucursal: sucursalDestino,
          insumo: insumoNuevo,
          lote,
          existencia: detalle[index].cantidadRecibida,
        };

        await getRepository(SucursalesInsumosEntity).save(
          sucursalInsumotoCreate,
        );
      }

      // si las cantidadad recibida es menor a la enviada se actualiza el detalle movimiento
      if (detalle[index].cantidadRecibida < detalle[index].cantidad) {
        transitoParcial = true;
      }
      await getRepository(DetalleMovimientosEntity)
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
    const queryMovimiento = await getRepository(
      MovimientosAlmacenEntity,
    ).createQueryBuilder();
    if (transitoParcial) {
      await queryMovimiento
        .update()
        .set({ estatus: EstatusMovimiento.TRANSITO_PARCIAL })
        .where('id=:id', { id: movimiento.id })
        .execute();
    } else {
      await queryMovimiento
        .update()
        .set({ estatus: EstatusMovimiento.FINALIZADO })
        .where('id=:id', { id: movimiento.id })
        .execute();
    }

    const response = await getRepository(MovimientosAlmacenEntity).findOne({
      id: movimiento.id,
    });

    return response;
  }

  /**
   * Actualiza la cantidad de insumos por sucursal
   *
   * @param data cantidad de insumos por sucursal a modificar
   * @param idSucursal id de la sucursal
   * @param idInsumo id del insumo
   * @returns {UpdateResult} resultados de la actualizacion
   */
  async updateMinMaxSucursalInsumo(
    data: UpdateSucursalesInsumosDTO,
    idSucursal: number,
    idInsumo: number,
  ): Promise<UpdateResult> {
    const sucursalInsumo = getRepository(SucursalesInsumosEntity)
      .createQueryBuilder('SucursalesInsumos')
      .leftJoin('SucursalesInsumos.sucursal', 'sucursal')
      .leftJoin('SucursalesInsumos.insumo', 'insumo')
      .where('sucursal.id=:idSucursal AND insumo.id=:idInsumo', {
        idSucursal,
        idInsumo,
      });

    const existeSucursalInsumo = await sucursalInsumo.getOne();
    if (!existeSucursalInsumo) {
      throw new HttpException(
        'El insumo no existe en esa sucursal',
        HttpStatus.NOT_FOUND,
      );
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

  async paginateInsumosBySucursalSinExistencias(
    idSucursal: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const idsSinExistencia = await getConnection().query(
      `select sum(existencia) as existencia, insumoId from sucursalesInsumos where sucursalId = ${idSucursal} and existencia = 0 group by insumoId ;`,
    );
    const ids = idsSinExistencia.map((i) => i.insumoId);
    const rows: SucursalesInsumosEntity[] = [];
    const insumosEnSucursalQuery = getRepository(SucursalesInsumosEntity)
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

    //obtener un registro de cada uno de esos ids.
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      rows.push(
        await insumosEnSucursalQuery
          .where('sucursal.id = :idSucursal', { idSucursal })
          .andWhere('sucIns.insumoId = :id', { id })
          .getOne(),
      );
    }

    return {
      data: rows,
      skip: options.skip,
      totalItems: rows.length,
    };
  }
  /**
   * Busca insumos por sucursal y los pagina
   *
   * @param idSucursal id de la sucursal
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  async paginateInsumosBySucursal(
    idSucursal: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const insumosEnSucursalQuery = getRepository(SucursalesInsumosEntity)
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

    const porInsumo = groupBy(insumosEnSucursal, 'insumo.id');
    const keysInsumos = Object.keys(porInsumo);
    const respuesta: any[] = [];
    for (let idx = 0; idx < keysInsumos.length; idx++) {
      const grupoInsumo = porInsumo[keysInsumos[idx]];
      const totalGrupo = sumBy(grupoInsumo, 'existencia');
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

  /**
   * Busca todos los insumos de un tipo de insumo en minimo
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  async minimosBytipoInsumo(
    tipoInsumoId: number,
  ): Promise<SucursalesInsumosEntity[]> {
    return getRepository(SucursalesInsumosEntity)
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

  /**
   * Retorna los elementos de sucursalesInsumos en donde la existencia
   * sea menor o igual al minimo
   *
   * @returns {SucursalesInsumosEntity} resultados
   */
  async insumosExistentes(): Promise<SucursalesInsumosEntity[]> {
    const insumosConMinimosQuery = await getRepository(SucursalesInsumosEntity)
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
    //agrupar por insumo y sucursal
    const grupos = groupBy(insumosConMinimosQuery, (i) => {
      return i.sucursal.id + '_' + i.insumo.id;
    });
    const keysInsumos = Object.keys(grupos);
    const respuesta: any[] = [];
    for (let idx = 0; idx < keysInsumos.length; idx++) {
      const grupoInsumo = grupos[keysInsumos[idx]];
      const totalGrupo = sumBy(grupoInsumo, 'existencia');
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

  /**
   * Retorna los minimos de matriz
   *con dos subconsultas a insumos presupuestados y en compras
   * @param options
   * @returns paginate
   */
  async paginateMinimosMatriz(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(SucursalesInsumosEntity)
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

    const porInsumo = groupBy(insumosEnMatriz, 'insumo.id');
    const keysInsumos = Object.keys(porInsumo);
    const respuesta: any[] = [];
    for (let idx = 0; idx < keysInsumos.length; idx++) {
      const grupoInsumo = porInsumo[keysInsumos[idx]];
      const totalGrupo = sumBy(grupoInsumo, 'existencia');
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

    //extraer los ids de insumos que estan en minimos
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
    const enPresupuesto = await getRepository(PresupuestoDetalleEntity)
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
      .where(
        'insumo.id IN (:...ids) AND (presupuesto.estatus != :status AND presupuesto.estatus != :statusCancelado)',
        {
          ids,
          status: EstatusPresupuesto.GENERADO,
          statusCancelado: EstatusPresupuesto.CANCELADO,
        },
      )
      .getMany();

    const enCompras = await getRepository(DetalleCompraEntity)
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
      .where(
        'insumo.id IN (:...ids) AND (compra.estatus != :status AND compra.estatus != :statusCancelado)',
        {
          ids,
          status: EstatusCompra.RECIBIDO,
          statusCancelado: EstatusCompra.CANCELADO,
        },
      )
      .getMany();

    return {
      data: respuesta,
      skip: options.skip,
      totalItems: count,
      insumosPresupuestados: enPresupuesto,
      insumosCompras: enCompras,
    };
  }

  /**
   * Retorna los insumos de sucursalesInsumos en donde la existencia
   * sea menor o igual al minimo de una sucursal
   *
   * @param idSucursal id de la sucursal
   * @returns {SucursalesInsumosEntity} añadiendo propiedad existenciaMatriz
   */
  async insumosExistentesBySucursal(idSucursal: number): Promise<any> {
    const sucursalInsumoQuery = getRepository(SucursalesInsumosEntity)
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

    const porInsumo = groupBy(dataSucursal, 'insumo.id');
    const keysInsumos = Object.keys(porInsumo);
    const respuesta: any[] = [];
    for (let idx = 0; idx < keysInsumos.length; idx++) {
      const grupoInsumo = porInsumo[keysInsumos[idx]];
      const totalGrupo = sumBy(grupoInsumo, 'existencia');
      if (totalGrupo <= grupoInsumo[0].minimo) {
        // se calcula la existencia en matriz del insumo
        const dataMatriz = await sucursalInsumoQuery
          .where('sucIns.existencia > 0')
          .andWhere('insumo.id =:insumoId', {
            insumoId: grupoInsumo[0].insumo.id,
          })
          .andWhere('sucursal.esMatriz =:esMatriz', { esMatriz: true })
          .getMany();
        const existenciaMatriz = sumBy(dataMatriz, 'existencia');

        // se agrega todo a la respuesta
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

  /**
   * Agregar insumos a una sucursal
   *
   * @param insumoData informacion para crear el insumo por sucursal
   * @returns {SucursalesInsumosEntity} registro creado en la tabla
   */
  async altaInsumo(
    id: number,
    insumoData: CreateSucursalesInsumosDTO,
  ): Promise<SucursalesInsumosEntity | UpdateResult> {
    const sucursal = await getRepository(SucursalEntity)
      .createQueryBuilder()
      .where('id=:id', { id })
      .getOne();
    if (!sucursal) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }

    const insumo = await getRepository(InsumoEntity)
      .createQueryBuilder()
      .where('id=:id', { id: insumoData.insumo })
      .getOne();
    if (!insumo) {
      throw new HttpException('El insumo no existe', HttpStatus.NOT_FOUND);
    }

    if (sucursal && insumo) {
      const sucursalInsumo = getRepository(SucursalesInsumosEntity)
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
      } else {
        sucursalInsumo.andWhere('lote.id IS null');
      }

      const existeInsumoEnSucursal = await sucursalInsumo.getOne();
      // si existe el insumo en la sucursal se actualiza solamente la cantidad existente
      if (existeInsumoEnSucursal) {
        const newCantidadInsumo =
          insumoData.cantidad + existeInsumoEnSucursal.existencia;
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

    return await getRepository(SucursalesInsumosEntity).save(
      sucursalInsumotoCreate,
    );
  }

  /**
   * Descuenta insumos a las sucursales correspondientes
   *
   * @param idSucursal id de la sucursal
   * @param data informacion del insumo y la cantidad a descontar
   * @returns {UpdateResult} informacion de la actualizacion
   */
  async bajaInsumo(
    idSucursal: number,
    data: CreateSucursalesInsumosDTO,
  ): Promise<UpdateResult> {
    const insumo = await getRepository(InsumoEntity)
      .createQueryBuilder()
      .where('id=:id', { id: data.insumo })
      .getOne();

    if (!insumo) {
      throw new HttpException('El insumo no existe', HttpStatus.BAD_REQUEST);
    }

    const sucursalInsumosQuery = getRepository(SucursalesInsumosEntity)
      .createQueryBuilder('sucursalesInsumos')
      .leftJoinAndSelect('sucursalesInsumos.insumo', 'insumo')
      .leftJoinAndSelect('sucursalesInsumos.sucursal', 'sucursal')
      .leftJoinAndSelect('sucursalesInsumos.lote', 'lote');
    if (data.lote) {
      sucursalInsumosQuery.where('lote.id = :loteId', {
        loteId: data.lote.id,
      });
    } else {
      sucursalInsumosQuery.where('lote.id IS null');
    }

    let dataResult: UpdateResult;

    // Evaluar de donde se descuenta el insumo
    sucursalInsumosQuery.andWhere(
      'sucursal.id=:idSucursal AND insumo.id =:idInsumo',
      {
        idSucursal,
        idInsumo: data.insumo,
      },
    );
    // .andWhere('sucursal.esMatriz=:esMatriz ', { esMatriz: false });

    const dataSucursal = await sucursalInsumosQuery.getOne();

    if (dataSucursal.existencia < data.cantidad) {
      throw new HttpException(
        'La cantidad solicitada no esta disponible en la sucursal',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newData = dataSucursal.existencia - data.cantidad;
    await sucursalInsumosQuery
      .update()
      .set({ existencia: newData })
      .where('id=:id', { id: dataSucursal.id })
      .execute();

    if (dataSucursal.minimo && newData <= dataSucursal.minimo) {
      //!hemos llegado al minimo, notificar (verificar que no exista la notificacion)
      this.notificacionesService.emitMinimoAlcanzado(
        new MinimoAlcanzadoEvent(dataSucursal.sucursal, dataSucursal.insumo),
      );
    }
    return dataResult;
  }

  /**
   * Modifica los minimos y maximos con los numeros del archivo xlsx
   *
   * @param xlsFile archivo con estructura definida.
   * @returns
   */
  async procesarMinimosMaximos(xlsFile: string) {
    const rows = await readXlsxFile(xlsFile);

    //obtener los 7 insumos (encabezados)
    const insumosIds = [];
    const rowInsumos = rows[2];
    insumosIds.push(parseInt(rowInsumos[1].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[4].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[7].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[10].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[13].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[16].split('|')[0]));
    insumosIds.push(parseInt(rowInsumos[19].split('|')[0]));

    //row inicial de datos
    const rowStart = 4;
    const rowEnd = 22; //ultimo dato de la tabla con sucursal
    const totales = [
      { min: 0, max: 0 },
      { min: 0, max: 0 },
      { min: 0, max: 0 },
      { min: 0, max: 0 },
      { min: 0, max: 0 },
      { min: 0, max: 0 },
      { min: 0, max: 0 },
    ];
    //por cada row de datos
    for (let r = rowStart; r <= rowEnd; r++) {
      const row = rows[r];
      const sucursalId = parseInt(row[0].split('|')[0]);
      //obtener los minimos y maximos
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

      //por cada insumo...
      for (let i = 0; i <= 6; i++) {
        const insumoId = insumosIds[i];
        //solamente cuando hay minimo y maximo expresado en el xsl del insumo...
        if (minMax[i].min && minMax[i].max) {
          //el dato origen es mensual, se requiere semanal
          const preMin = minMax[i].min / 4;
          const preMax = minMax[i].max / 4;

          //el minimo debe ser minimo 1
          let min = parseInt(preMin.toFixed(0));
          min = min < 1 ? 1 : min;

          //el maximo debe ser minimo 2
          let max = parseInt(preMax.toFixed(0));
          max = max <= 1 ? 2 : max;

          //hacer el update al insumo en sucursal
          await getRepository(SucursalesInsumosEntity)
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

    //afectar los inusmos de matriz
    const matriz = await getRepository(SucursalEntity).findOne({
      where: { esMatriz: true },
    });
    //por cada insumo...
    for (let i = 0; i <= 6; i++) {
      const insumoId = insumosIds[i];
      //solamente cuando hay minimo y maximo expresado en el total del insumo...
      if (totales[i].min && totales[i].max) {
        //el dato origen es mensual, se requiere mensual
        const preMin = totales[i].min;
        const preMax = totales[i].max;

        //el minimo debe ser minimo 1
        let min = parseInt(preMin.toFixed(0));
        min = min < 1 ? 4 : min;

        //el maximo debe ser minimo 2
        let max = parseInt(preMax.toFixed(0));
        max = max <= 1 ? 8 : max;

        //hacer el update al insumo en sucursal
        await getRepository(SucursalesInsumosEntity)
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

  async importarInsumosSucursal(xlsFile: string, sucursalId: number) {
    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' insumos');
    //const sucursalId = parseInt(xlsFile.split(' ')[0]);
    this.logger.verbose('Para la Sucursal ' + sucursalId);
    const sucursal = await getRepository(SucursalEntity).findOne(sucursalId);
    if (!sucursal) {
      throw new HttpException(
        `No existe la sucursal ${sucursalId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    //por cada row de datos
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
      //es un insumo existente y trae cantidad
      if (insumoId && existencia) {
        this.logger.verbose('Procesando insumoId ' + insumoId);
        const insumo = await getRepository(InsumoEntity).findOne(insumoId);

        if (!insumo) {
          throw new HttpException(
            `No existe el insumo ${insumoId}`,
            HttpStatus.NOT_FOUND,
          );
        }
        if (loteNumero && typeof loteNumero === 'number') {
          loteNumero = loteNumero.toString();
        }
        // si trae lote, buscarlo
        let lote: LoteEntity | null = null;
        if (loteNumero && loteNumero.trim()) {
          lote = await getRepository(LoteEntity).findOne({
            where: { numero: loteNumero.trim() },
          });
          // si no existe el lote crearlo con la caducidad especificada (si es que viene)
          if (!lote) {
            lote = await getRepository(LoteEntity).save({
              numero: loteNumero.trim(),
              caducidad: fechaOrig,
            });
          }
        }
        //dar de alta la existencia o modificarla si ya existe con ese lote.
        const existeQuery = getRepository(SucursalesInsumosEntity)
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
        } else {
          existeQuery.andWhere('l.id IS null');
        }
        const existe = await existeQuery.getOne();

        //si no existe, crearlo
        if (!existe) {
          const creado = await getRepository(SucursalesInsumosEntity).save({
            lote,
            sucursal,
            insumo,
            existencia,
            ubicacion,
          });
          this.logger.verbose('Agregada existencia a sucursal ' + creado.id);
        } else {
          const updated = await getRepository(SucursalesInsumosEntity).update(
            { id: existe.id },
            {
              existencia,
              ubicacion,
            },
          );
          this.logger.verbose('Actualizada existencia: ' + updated.affected);
        }
      } else if (!insumoId && existencia) {
        //crear el insumo
        const insumo = await getRepository(InsumoEntity).save({
          nombre,
          descripcion,
          tipoUnidadId,
          tipoInsumoId: 14, //por default en la categoria de pruebas
        });
        //buscar el lote
        // si trae lote, buscarlo
        let lote: LoteEntity;
        if (loteNumero) {
          lote = await getRepository(LoteEntity).findOne({
            where: { numero: loteNumero },
          });

          if (!lote) {
            lote = await getRepository(LoteEntity).save({
              numero: loteNumero,
              caducidad: fechaOrig,
            });
          }
        }
        const creado = await getRepository(SucursalesInsumosEntity).save({
          lote,
          sucursal,
          insumo,
          existencia,
          ubicacion,
        });
        this.logger.verbose(
          'Agregada existencia a sucursal, insumo nuevo ' + creado.id,
        );
      }
    }
    return rows;
  }

  async importarInsumosTodas(xlsFile: string) {
    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' insumos');
    //por cada row de datos
    for (let r = 6; r <= rows.length - 1; r++) {
      const row = rows[r];
      const sucursalId = row[0] ? parseInt(row[0]) : null;
      const insumoId = row[1] ? parseInt(row[1]) : null;
      const minimo = row[2] ? parseInt(row[2]) : 0;
      const maximo = row[3] ? parseInt(row[3]) : 0;

      //es un insumo existente
      if (insumoId && sucursalId) {
        const sucursal = await getRepository(SucursalEntity).findOne(
          sucursalId,
        );

        if (!sucursal) {
          throw new HttpException(
            `No existe la sucursal ${sucursalId}`,
            HttpStatus.NOT_FOUND,
          );
        }

        this.logger.verbose('Procesando insumoId ' + insumoId);
        const insumo = await getRepository(InsumoEntity).findOne(insumoId);

        if (!insumo) {
          throw new HttpException(
            `No existe el insumo ${insumoId}`,
            HttpStatus.NOT_FOUND,
          );
        }

        //dar de alta la existencia o modificarla si ya existe
        const existen = await getRepository(SucursalesInsumosEntity)
          .createQueryBuilder('si')
          .leftJoin('si.sucursal', 's')
          .leftJoin('si.insumo', 'i')
          .where('s.id = :sId AND i.id = :iId', {
            sId: sucursal.id,
            iId: insumo.id,
          })
          .getCount();

        //si no existe, crearlo
        if (!existen) {
          const creado = await getRepository(SucursalesInsumosEntity).save({
            sucursal,
            insumo,
            existencia: 0,
            minimo,
            maximo,
          });
          this.logger.verbose('Agregada existencia a sucursal ' + creado.id);
        } else {
          const updated = await getRepository(SucursalesInsumosEntity).update(
            { insumo, sucursal },
            {
              minimo,
              maximo,
            },
          );
          this.logger.verbose('Actualizada existencia: ' + updated.affected);
        }
      }
    }
    return rows;
  }

  async importarMinMaxSucursal(xlsFile: string, sucursalId: number) {
    const sucursal = await getRepository(SucursalEntity).findOne(sucursalId);

    if (!sucursal) {
      throw new HttpException(
        `No existe la sucursal ${sucursalId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' insumos');
    //console.log('rows____________________', rows);
    //por cada row de datos
    for (let r = 5; r <= rows.length - 1; r++) {
      const row = rows[r];
      const insumoId = row[0] ? parseInt(row[0]) : null;
      const promedio = row[2] ? parseInt(row[2]) : 0;
      const minimo = row[3] ? parseInt(row[3]) : 0;
      const maximo = row[4] ? parseInt(row[4]) : 0;

      //es un insumo existente
      if (insumoId && promedio) {
        this.logger.verbose('Procesando insumoId ' + insumoId);
        const insumo = await getRepository(InsumoEntity).findOne(insumoId);

        if (insumo) {
          //dar de alta la existencia o modificarla si ya existe
          const existen = await getRepository(SucursalesInsumosEntity)
            .createQueryBuilder('si')
            .leftJoin('si.sucursal', 's')
            .leftJoin('si.insumo', 'i')
            .where('s.id = :sId AND i.id = :iId', {
              sId: sucursal.id,
              iId: insumo.id,
            })
            .getCount();

          //si no existe, crearlo
          if (!existen) {
            const creado = await getRepository(SucursalesInsumosEntity).save({
              sucursal,
              insumo,
              existencia: 0,
              promedio,
              minimo,
              maximo,
            });
            this.logger.verbose('Agregada relación con sucursal ' + creado.id);
          } else {
            const updated = await getRepository(SucursalesInsumosEntity).update(
              { insumo, sucursal },
              {
                promedio,
                minimo,
                maximo,
              },
            );
            if (updated.affected) {
              this.logger.verbose(
                `Actualizados promedio(${promedio}), min(${minimo}), max(${maximo}) `,
              );
            } else {
              this.logger.verbose(
                `No se pudo actualizar el insumo ${insumo.id} de la sucursal ${sucursal.nombre}`,
              );
            }
          }
        }
      }
    }
    return rows;
  }

  /**
   * Calcular los minimos y maximos de matriz a base de la suma
   * de las demas sucursales.
   */
  async calcularMinimosMaximosMatriz(): Promise<
    { insumo: number; minimo: number; maximo: number }[]
  > {
    // obtener los insumos donde hay un maximo establecido, solo ids
    const insumosIds = await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder()
      .select('insumoId')
      .distinct(true)
      .where('maximo >= 1')
      .getRawMany();

    //obtener la matriz
    const matriz = await getRepository(SucursalEntity).findOne({
      esMatriz: true,
    });

    //formato de salida
    const salida: { insumo: number; minimo: number; maximo: number }[] = [];

    //recorrer los insumos por id, calculando su suma de minimos y maximos de todas las
    //sucursales que no son matriz
    for (let i = 0; i < insumosIds.length; i++) {
      const insumoId = insumosIds[i].insumoId;

      const minMax = await getRepository(SucursalesInsumosEntity).query(`
        SELECT 
          SUM(maximo) AS maximo,
          SUM(minimo) AS minimo
        FROM sucursalesInsumos
        WHERE insumoId = ${insumoId} 
          AND sucursalId != ${matriz.id};
      `);

      const minimo = minMax[0].minimo;
      const maximo = minMax[0].maximo;
      //actualizar en matriz esos numeros
      await getRepository(SucursalesInsumosEntity).update(
        { sucursal: matriz, insumo: insumoId },
        { minimo, maximo },
      );

      //agregar a salida
      salida.push({ insumo: insumoId, minimo, maximo });
    }

    return salida;
  }
}
