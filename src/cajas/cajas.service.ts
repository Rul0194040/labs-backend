import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { SucursalEntity } from './../sucursales/sucursal.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { forIn } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { CajaEntity } from './cajas.entity';
import { CreateCajaDTO } from './DTO/create-caja.dto';
import { UpdateCajaDTO } from './DTO/update-caja.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { EstatusCaja } from './estatusCaja.enum';
import { MovimientoCajaEntity } from './movimientos-caja.entity';
import { TiposMovimientoCaja } from '../common/enum/tiposMovimientoCaja.enum';
import { MovimientosCajaDTO } from './DTO/movimientos-caja.dto';
import { TotalMovimientosCajaDTO } from './DTO/total-movimientos-caja.dto';
import { CerrarCajaDTO } from './DTO/cerrar-caja.dto';
import { CambiarStatusMovimientoDTO } from './DTO/cambiarStatusMovimiento.dto';
import * as moment from 'moment';
import { EstatusMovimientoCancelacionE } from './estatusMovimiento.enum';
import { PagoEntity } from '../pagos/pagos.entity';
import { TiposPago } from '../pagos/tipoPagos.enum';
import { classToPlain } from 'class-transformer';
import { RecibirDTO } from './DTO/recibirDatos.dto';
import { CajasCerradasSucursalDTO } from './DTO/cajasCerradasSucursal.dto';
import { EstatusCorte } from '@sanfrancisco/tesoreros/cortesTesorero/estatusCorte.enum';
import { CorteTesoreroEntity } from '@sanfrancisco/tesoreros/cortesTesorero/cortesTesorero.entity';
import { VentaEntity } from '../ventas/ventas.entity';
import { EstadosVentas } from '../ventas/estadosVentas.enum';
import { ProfileTypes } from '../users/profiles.enum';

@Injectable()
export class CajasService {
  private readonly notFoundMessage = 'caja no encontrada';

  async create(caja: CreateCajaDTO, usuario: UsersEntity): Promise<CajaEntity> {
    if (!usuario.sucursal) {
      throw new HttpException(
        'El usuario no pertenece a una sucursal',
        HttpStatus.BAD_REQUEST,
      );
    }
    const sucursal = await getRepository(SucursalEntity).findOne({
      id: usuario.sucursal.id,
    });
    const cajaToCreate = {
      usuario: usuario,
      sucursal,
      montoApertura: caja.montoApertura,
      notas: caja.notas,
      estatus: EstatusCaja.ABIERTA,
      fechaApertura: new Date(),
      createdAt: new Date(),
    };

    const cajaCreada = await getRepository(CajaEntity).save(cajaToCreate);

    const dataDeposito: MovimientosCajaDTO = {
      monto: cajaCreada.montoApertura,
      notas: 'Apertura de caja',
    };

    await this.crearDeposito(usuario, dataDeposito, true);

    cajaCreada.total = dataDeposito.monto;
    return cajaCreada;
  }

  async setContabilizada(cajaId: number): Promise<UpdateResult> {
    return await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set({ estatus: EstatusCaja.CONTABILIZADA })
      .where('id=:cajaId', { cajaId })
      .execute();
  }

  async setEntregada(
    cajaId: number,
    datosCaja: RecibirDTO,
  ): Promise<UpdateResult> {
    return await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set({
        origenEntrega: datosCaja.entregaOrigen,
        estatus: EstatusCaja.ENTREGADA,
        recibio: datosCaja.recibio || null,
        referencia: datosCaja.referencia || null,
      })
      .where('id=:cajaId', { cajaId })
      .execute();
  }

  async getById(id: number): Promise<CajaEntity> {
    const caja = await getRepository(CajaEntity)
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
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const retornar: any = classToPlain(caja);
    const ventasCaja = await getRepository(VentaEntity)
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
  async update(id: number, caja: UpdateCajaDTO): Promise<UpdateResult> {
    const record = await this.getById(id);

    if (!record) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(CajaEntity).update({ id }, caja);
  }

  async delete(id: number): Promise<DeleteResult> {
    return getRepository(CajaEntity).delete({ id });
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(CajaEntity).createQueryBuilder();
    forIn(options.filters, (value, key) => {
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

  async cajasUsuario(
    user: LoginIdentityDTO,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.usuario', 'usuario')
      .where('usuario.id=:id', { id: user.id });

    forIn(options.filters, (value, key) => {
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

  async ventasCaja(
    user: LoginIdentityDTO,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.caja', 'caja')
      .leftJoin('caja.usuario', 'usuario')
      .where('usuario.id=:usuarioId AND tipoMovimiento=:tipoM', {
        usuarioId: user.id,
        tipoM: TiposMovimientoCaja.VENTA,
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

  async movimientosCaja(
    id: number,
    movimiento: string,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientoCajaEntity)
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

  async movimientosCancelados(id: number): Promise<MovimientoCajaEntity[]> {
    const dataQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.caja', 'caja')
      .where('caja.id=:cajaId', { cajaId: id })
      .andWhere('movimiento.active=:status', {
        status: false,
      })
      .getMany();

    return dataQuery;
  }

  async movimientosRetiros(id: number): Promise<MovimientoCajaEntity[]> {
    const dataQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.caja', 'caja')
      .where('caja.id=:cajaId', { cajaId: id })
      .andWhere('movimiento.tipoMovimiento=:tipo', {
        tipo: TiposMovimientoCaja.RETIRO,
      })
      .getMany();

    return dataQuery;
  }

  async movimientosDepositos(id: number): Promise<MovimientoCajaEntity[]> {
    const dataQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .leftJoin('movimiento.caja', 'caja')
      .where('caja.id=:cajaId', { cajaId: id })
      .andWhere('movimiento.tipoMovimiento=:tipo', {
        tipo: TiposMovimientoCaja.DEPOSITO,
      })
      .getMany();

    return dataQuery;
  }

  /**
   * Retorna el estado de una caja por usuario en sesión
   *
   * @param user Usuario en sesión
   * @returns {CajaEntity | null} resultados
   */
  async consultarCajaUsuario(
    user: LoginIdentityDTO,
  ): Promise<CajaEntity | null> {
    if (!user.sucursal) {
      throw new HttpException(
        'El usuario no tiene asignada una sucursal',
        HttpStatus.BAD_REQUEST,
      );
    }
    const caja = await getRepository(CajaEntity)
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
        cajaEstatus: EstatusCaja.ABIERTA,
      })
      .getOne();
    if (!caja) {
      return null;
    }
    return caja;
  }

  /**
   * Crea un deposito en caja
   *
   * @param user usuario en sesion
   * @param depositoData datos del deposito
   * @returns {MovimientoCajaEntity} detalle del movimiento
   */
  async crearDeposito(
    user: UsersEntity,
    depositoData: MovimientosCajaDTO,
    apertura: boolean,
  ): Promise<CajaEntity> {
    const cajaQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.usuario', 'usuario')
      .leftJoin('caja.sucursal', 'sucursal')
      .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
        usuarioId: user.id,
        sucursalId: user.sucursal.id,
      })
      .andWhere('estatus = :cajaEstatus', {
        cajaEstatus: EstatusCaja.ABIERTA,
      });

    const caja = await cajaQuery.getOne();

    if (!caja) {
      throw new HttpException(
        'El usuario no tiene una caja abierta',
        HttpStatus.NOT_FOUND,
      );
    }

    const movimiento = {
      caja,
      monto: depositoData.monto,
      tipoMovimiento: apertura
        ? TiposMovimientoCaja.APERTURA
        : TiposMovimientoCaja.DEPOSITO,
      notas: depositoData.notas,
      createdAt: new Date(),
      estatusMovimiento: EstatusMovimientoCancelacionE.INICIAL,
    };
    const movimientoCaja = await getRepository(MovimientoCajaEntity).save(
      movimiento,
    );

    if (!apertura) {
      const newTotal = Number(caja.total) + Number(movimientoCaja.monto);
      await cajaQuery.update().set({ total: newTotal }).execute();
    }

    return await cajaQuery.select(['caja.total', 'caja.createdAt']).getOne();
  }

  async crearRetiro(
    user: UsersEntity,
    retiroData: MovimientosCajaDTO,
  ): Promise<CajaEntity> {
    let newTotal = 0;
    const cajaQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.usuario', 'usuario')
      .leftJoin('caja.sucursal', 'sucursal')
      .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
        usuarioId: user.id,
        sucursalId: user.sucursal.id,
      })
      .andWhere('estatus = :cajaEstatus', {
        cajaEstatus: EstatusCaja.ABIERTA,
      });

    const caja = await cajaQuery.getOne();

    if (!caja) {
      throw new HttpException(
        'El usuario no tiene una caja abierta',
        HttpStatus.NOT_FOUND,
      );
    }

    const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: caja.id })
      .select('SUM(movimientosCaja.monto)', 'total');

    const retiros = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.RETIRO,
      })
      .getRawOne();

    const cajaMovimientoEfectivoQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: caja.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.EFECTIVO,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const efectivoDisponible =
      cajaMovimientoEfectivoQuery.total - retiros.total;

    if (efectivoDisponible === 0) {
      throw new HttpException(
        'No se cuenta con efectivo suficiente',
        HttpStatus.AMBIGUOUS,
      );
    }

    if (Number(retiroData.monto) > Number(efectivoDisponible)) {
      throw new HttpException(
        'El monto del retiro no debe de exceder el monto de efectivo disponible',
        HttpStatus.AMBIGUOUS,
      );
    }

    const movimiento = {
      caja,
      monto: retiroData.monto,
      tipoMovimiento: TiposMovimientoCaja.RETIRO,
      notas: retiroData.notas,
      createdAt: new Date(),
      estatusMovimiento: EstatusMovimientoCancelacionE.INICIAL,
    };
    const movimientoCaja = await getRepository(MovimientoCajaEntity).save(
      movimiento,
    );

    newTotal = Number(caja.total) - Number(movimientoCaja.monto);

    await cajaQuery.update().set({ total: newTotal }).execute();

    return await cajaQuery.select(['caja.total', 'caja.createdAt']).getOne();
  }

  /**
   * obtiene el total de movimientos por caja abierta
   *
   * @param user usuario en sesión
   * @returns { TotalMovimientosCajaDTO } total de movimientos
   */
  async getTotalMovimientosByCaja(
    user: UsersEntity,
  ): Promise<TotalMovimientosCajaDTO> {
    const cajaQuery = await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.usuario', 'usuario')
      .leftJoin('caja.sucursal', 'sucursal')
      .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
        usuarioId: user.id,
        sucursalId: user.sucursal.id,
      })
      .andWhere('estatus = :cajaEstatus', {
        cajaEstatus: EstatusCaja.ABIERTA,
      })
      .getOne();

    if (!cajaQuery) {
      throw new HttpException(
        'El usuario no tiene una caja abierta',
        HttpStatus.NOT_FOUND,
      );
    }

    const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
      .select('SUM(movimientosCaja.monto)', 'total');

    const cajaMovimientoCancelacionesQuery = await getRepository(
      MovimientoCajaEntity,
    )
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
      .select('SUM(movimientosCaja.monto)', 'total')
      .andWhere('movimientosCaja.active = :status', {
        status: false,
      })
      .getRawOne();

    const cajaMovimientoTransferenciasQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TRANSFERENCIA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoEfectivoQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.EFECTIVO,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoChequeQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.CHEQUE,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoTarjetaQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TARJETA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    //Seleccionar los pagos de la venta cuando la caja tenga credito true
    const PagosCredito = await getRepository(PagoEntity)
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
        tipoMovimiento: TiposMovimientoCaja.DEPOSITO,
      })
      .getRawOne();

    const retiros = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.RETIRO,
      })
      .getRawOne();

    const ventas = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.VENTA,
      })
      .getRawOne();

    const creditoVentas = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
      .andWhere('venta.saldo > 0')
      .andWhere(
        'venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada',
        {
          estadoBorrador: EstadosVentas.BORRADOR,
          estadoCancelada: EstadosVentas.CANCELADA,
        },
      )
      .select('SUM(venta.saldo)', 'total')
      .getRawOne();

    const dataResult: TotalMovimientosCajaDTO = {
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
  /**
   * obtiene el total de movimientos por caja cerrada
   *
   * @param user usuario en sesión
   * @returns { TotalMovimientosCajaDTO } total de movimientos
   */
  async getTotalMovimientosByCajaCerrada(
    cajaId,
  ): Promise<TotalMovimientosCajaDTO> {
    const cajaQuery = await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .where('caja.id = :cajaId', {
        cajaId: cajaId,
      })
      .getOne();

    const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
      .select('SUM(movimientosCaja.monto)', 'total');

    const cajaMovimientoCancelacionesQuery = await getRepository(
      MovimientoCajaEntity,
    )
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: cajaQuery.id })
      .select('SUM(movimientosCaja.monto)', 'total')
      .andWhere('movimientosCaja.active = :status', {
        status: false,
      })
      .getRawOne();

    const cajaMovimientoTransferenciasQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TRANSFERENCIA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoEfectivoQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: cajaQuery.id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.EFECTIVO,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoChequeQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: cajaQuery.id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.CHEQUE,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoTarjetaQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :ventaEstado', {
        cajaId: cajaQuery.id,
        ventaEstado: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TARJETA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    //Seleccionar los pagos de la venta cuando la caja tenga credito true
    const PagosCredito = await getRepository(PagoEntity)
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
        tipoMovimiento: TiposMovimientoCaja.DEPOSITO,
      })
      .getRawOne();

    const retiros = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.RETIRO,
      })
      .getRawOne();

    const ventas = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.VENTA,
      })
      .getRawOne();

    const dataResult: TotalMovimientosCajaDTO = {
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

  async getCajasCerradasPorSucursal(
    sucursalId: number,
    user: LoginIdentityDTO,
  ): Promise<CajasCerradasSucursalDTO[]> {
    const sucursal = await getRepository(SucursalEntity).findOne(sucursalId);

    if (!sucursal) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }

    if (
      user.profile === ProfileTypes.TESORERO_SUCURSALES_FORANEAS &&
      !sucursal.esForanea
    ) {
      throw new HttpException(
        'su perfil no tiene acceso para recoger dinero de esta sucursal',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      user.profile === ProfileTypes.TESORERO_SUCURSALES_CENTRALES &&
      sucursal.esForanea
    ) {
      throw new HttpException(
        'su perfil no tiene acceso para recoger dinero de esta sucursal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cajasPorSucursal = await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.sucursal', 'sucursal')
      .leftJoin('caja.usuario', 'usuario')
      .where('sucursal.id = :sucursalId', { sucursalId })
      .andWhere('caja.estatus = :cajaEstatus', {
        cajaEstatus: EstatusCaja.CERRADA,
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
      throw new HttpException(
        'No hay cajas cerradas en esa sucursal',
        HttpStatus.NOT_FOUND,
      );
    }

    const pagosQuery = getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .select('SUM(pagoEntity.monto)', 'total')
      .where('venta.credito = :ventaEstado', { ventaEstado: false })
      .andWhere('pagoEntity.estatus = :activos', { activos: true });

    const cajas = [];

    for (const caja of cajasPorSucursal) {
      const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
        .createQueryBuilder('movimientosCaja')
        .leftJoin('movimientosCaja.caja', 'caja')
        .where('caja.id = :cajaId', { cajaId: caja.id })
        .select('SUM(movimientosCaja.monto)', 'total');

      pagosQuery.andWhere('caja.id = :cajaId', { cajaId: caja.id });

      const ventas = await cajaMovimientoQuery
        .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
          tipoMovimiento: TiposMovimientoCaja.VENTA,
        })
        .getRawOne();

      const retiros = await cajaMovimientoQuery
        .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
          tipoMovimiento: TiposMovimientoCaja.RETIRO,
        })
        .getRawOne();

      const depositos = await cajaMovimientoQuery
        .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
          tipoMovimiento: TiposMovimientoCaja.DEPOSITO,
        })
        .getRawOne();

      const transferencias = await pagosQuery
        .andWhere('pagoEntity.tipo = :tipo', {
          tipo: TiposPago.TRANSFERENCIA,
        })
        .getRawOne();

      const tarjeta = await pagosQuery
        .andWhere('pagoEntity.tipo = :tipo', {
          tipo: TiposPago.TARJETA,
        })
        .getRawOne();

      const efectivo = await pagosQuery
        .andWhere('pagoEntity.tipo = :tipo', {
          tipo: TiposPago.EFECTIVO,
        })
        .getRawOne();

      const cheque = await pagosQuery
        .andWhere('pagoEntity.tipo = :tipo', {
          tipo: TiposPago.CHEQUE,
        })
        .getRawOne();

      const creditoVentas = await getRepository(VentaEntity)
        .createQueryBuilder('venta')
        .leftJoin('venta.caja', 'caja')
        .where('caja.id = :cajaId', { cajaId: caja.id })
        .andWhere('venta.saldo > 0')
        .andWhere(
          'venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada',
          {
            estadoBorrador: EstadosVentas.BORRADOR,
            estadoCancelada: EstadosVentas.CANCELADA,
          },
        )
        .select('SUM(venta.saldo)', 'total')
        .getRawOne();

      //Seleccionar los pagos de la venta cuando la caja tenga credito true
      const PagosCredito = await getRepository(PagoEntity)
        .createQueryBuilder('pago')
        .leftJoin('pago.venta', 'venta')
        .leftJoin('pago.caja', 'caja')
        .select('SUM(pago.monto)', 'total')
        .where('caja.id = :cajaId', {
          cajaId: caja.id,
        })
        .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
        .getRawOne();

      const result: CajasCerradasSucursalDTO = {
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

  async getCortePorCaja(cajaId: number): Promise<CajasCerradasSucursalDTO> {
    console.log(cajaId);
    const caja = await getRepository(CajaEntity)
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
      throw new HttpException('La caja no existe', HttpStatus.NOT_FOUND);
    }

    const pagosQuery = getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .select('SUM(pagoEntity.monto)', 'total')
      .where('venta.credito = :ventaEstado', { ventaEstado: false })
      .andWhere('pagoEntity.estatus = :activos', { activos: true });

    const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: caja.id })
      .select('SUM(movimientosCaja.monto)', 'total');

    pagosQuery.andWhere('caja.id = :cajaId', { cajaId: caja.id });

    const ventas = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.VENTA,
      })
      .getRawOne();

    const retiros = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.RETIRO,
      })
      .getRawOne();

    const depositos = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento: TiposMovimientoCaja.DEPOSITO,
      })
      .getRawOne();

    const transferencias = await pagosQuery
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TRANSFERENCIA,
      })
      .getRawOne();

    const tarjeta = await pagosQuery
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TARJETA,
      })
      .getRawOne();

    const efectivo = await pagosQuery
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.EFECTIVO,
      })
      .getRawOne();

    const cheque = await pagosQuery
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.CHEQUE,
      })
      .getRawOne();

    const creditoVentas = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: caja.id })
      .andWhere('venta.saldo > 0')
      .andWhere(
        'venta.estatus != :estadoBorrador AND venta.estatus != :estadoCancelada',
        {
          estadoBorrador: EstadosVentas.BORRADOR,
          estadoCancelada: EstadosVentas.CANCELADA,
        },
      )
      .select('SUM(venta.saldo)', 'total')
      .getRawOne();

    //Seleccionar los pagos de la venta cuando la caja tenga credito true
    const PagosCredito = await getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .leftJoin('pago.venta', 'venta')
      .leftJoin('pago.caja', 'caja')
      .select('SUM(pago.monto)', 'total')
      .where('caja.id = :cajaId', {
        cajaId: caja.id,
      })
      .andWhere('venta.credito = :ventaEstado', { ventaEstado: true })
      .getRawOne();

    const result: CajasCerradasSucursalDTO = {
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

  async contabilizarCajas(
    sucursalId: number,
    user: LoginIdentityDTO,
  ): Promise<UpdateResult> {
    const cajas = await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoin('caja.sucursal', 'sucursal')
      .leftJoin('caja.usuario', 'usuario')
      .where('sucursal.id = :sucursalId', { sucursalId })
      .andWhere('caja.estatus = :cajaEstatus', {
        cajaEstatus: EstatusCaja.CERRADA,
      })
      .getMany();

    const tesorero = await getRepository(UsersEntity).findOne({ id: user.sub });

    const corte = await getRepository(CorteTesoreroEntity).save({
      estatus: EstatusCorte.TRANSITO,
      tesorero,
    });

    const ids = cajas.map((e) => e.id);

    return await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set({ estatus: EstatusCaja.CONTABILIZADA, corteTesorero: corte })
      .whereInIds(ids)
      .execute();
  }

  async solicitarCancelacion(
    idMovimiento: number,
    idCaja: number,
    cambiarStatus: CambiarStatusMovimientoDTO,
  ): Promise<MovimientoCajaEntity> {
    const cajaQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .where('id = :id', { id: idCaja });

    const movimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .where('id = :id', { id: idMovimiento });

    const caja = await cajaQuery.getOne();

    if (!caja) {
      throw new HttpException('La caja no existe', HttpStatus.NOT_FOUND);
    }
    await movimientoQuery
      .update()
      .set({
        motivoCancelacion: cambiarStatus.motivoCancelacion,
        estatusMovimiento: EstatusMovimientoCancelacionE.SOLICITUD,
      })
      .execute();

    return await movimientoQuery.getOne();
  }

  /**
   * acepta o rechaza una cancelacion de movimiento
   *
   * @param estatusMovimiento APROBADA - RECHAZADA
   * @param id id del movimiento
   * @returns {UpdateResult}
   */
  async cancelarMovimiento(
    idMovimiento: number,
    estatusMovimiento: EstatusMovimientoCancelacionE,
  ): Promise<CajaEntity> {
    const movimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .where('id = :id', { id: idMovimiento });

    const movimiento = await movimientoQuery.getOne();

    const cajaQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .where('id = :id', { id: movimiento.cajaId });

    const caja = await cajaQuery.getOne();

    if (!caja) {
      throw new HttpException('La caja no existe', HttpStatus.NOT_FOUND);
    }

    let newTotal: number;

    switch (movimiento.tipoMovimiento) {
      case TiposMovimientoCaja.DEPOSITO:
        newTotal = Number(caja.total) - Number(movimiento.monto);
        break;
      case TiposMovimientoCaja.RETIRO:
        newTotal = Number(caja.total) + Number(movimiento.monto);
        break;
      case TiposMovimientoCaja.VENTA:
        newTotal = Number(caja.total) - Number(movimiento.monto);
        break;
      default:
        throw new HttpException(
          'Tipo de movimiento no valido',
          HttpStatus.CONFLICT,
        );
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

  /**
   * Proceso de cerrar una caja
   *
   * @param user Usuario en sesión que pertenece a una caja
   * @param cerrarCaja datos del cierre de caja
   * @returns {UpdateResult} resultado de la actualizacion
   */
  async cerrarCaja(
    user: LoginIdentityDTO,
    cerrarCaja: CerrarCajaDTO,
  ): Promise<UpdateResult> {
    const caja = await this.consultarCajaUsuario(user);
    if (!caja) {
      throw new HttpException('La caja no existe', HttpStatus.NOT_FOUND);
    }
    const updateData = {
      ...cerrarCaja,
      estatus: EstatusCaja.CERRADA,
      fechaCierre: new Date(),
    };
    return await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set(updateData)
      .where('id = :idCaja', { idCaja: caja.id })
      .execute();
  }

  async getInfoForDoc(id: number): Promise<any | null> {
    const caja = await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .where('caja.id = :id', { id })
      .getOne();

    if (!caja) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const usuarioId = caja.usuarioId;
    const sucursalId = caja.sucursalId;

    const usuario = await getRepository(UsersEntity)
      .createQueryBuilder('usuario')
      .select(['usuario.firstName', 'usuario.lastName'])
      .where('usuario.id = :usuarioId', { usuarioId })
      .getOne();

    const sucursal = await getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .select(['sucursal.nombre'])
      .where('sucursal.id = :sucursalId', { sucursalId })
      .getOne();

    // Consultas de movimientos
    const cajaMovimientoQuery = getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: id })
      .select('SUM(movimientosCaja.monto)', 'total');

    const cajaMovimientoCancelacionesQuery = await getRepository(
      MovimientoCajaEntity,
    )
      .createQueryBuilder('movimientosCaja')
      .leftJoin('movimientosCaja.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: id })
      .select('SUM(movimientosCaja.monto)', 'total')
      .andWhere('movimientosCaja.active = :status', {
        status: false,
      })
      .getRawOne();

    const cajaMovimientoTransferenciasQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TRANSFERENCIA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoEfectivoQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.EFECTIVO,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoChequeQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.CHEQUE,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    const cajaMovimientoTarjetaQuery = await getRepository(PagoEntity)
      .createQueryBuilder('pagoEntity')
      .leftJoin('pagoEntity.caja', 'caja')
      .leftJoin('pagoEntity.venta', 'venta')
      .where('caja.id = :cajaId AND venta.credito = :esCredito', {
        cajaId: id,
        esCredito: false,
      })
      .select('SUM(pagoEntity.monto)', 'total')
      .andWhere('pagoEntity.tipo = :tipo', {
        tipo: TiposPago.TARJETA,
      })
      .andWhere('pagoEntity.estatus = :activos', { activos: true })
      .getRawOne();

    //Seleccionar los pagos de la venta cuando la caja tenga credito true
    const PagosCredito = await getRepository(PagoEntity)
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
        deposito: TiposMovimientoCaja.DEPOSITO,
      })
      .getRawOne();

    const retiros = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :retiro', {
        retiro: TiposMovimientoCaja.RETIRO,
      })
      .getRawOne();

    const ventas = await cajaMovimientoQuery
      .andWhere('movimientosCaja.tipoMovimiento = :venta', {
        venta: TiposMovimientoCaja.VENTA,
      })
      .getRawOne();

    const creditoVentas = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.caja', 'caja')
      .where('caja.id = :cajaId', { cajaId: id })
      .andWhere('venta.saldo > 0')
      .andWhere(
        'venta.estatus != :borradores AND venta.estatus != :canceladas',
        {
          borradores: EstadosVentas.BORRADOR,
          canceladas: EstadosVentas.CANCELADA,
        },
      )
      .select('SUM(venta.saldo)', 'total')
      .getRawOne();

    const dataResult: TotalMovimientosCajaDTO = {
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
}
