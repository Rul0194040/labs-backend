import { CajasService } from './../cajas/cajas.service';
import { Injectable } from '@nestjs/common';
import { getRepository, UpdateResult } from 'typeorm';
import { VentaEntity } from '../ventas/ventas.entity';
import { EstadosCancelacionVenta } from '@sanfrancisco/ventas/estadosCancelacion.enum';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { CajaEntity } from '../cajas/cajas.entity';
import { ProfileTypes } from '../users/profiles.enum';
import { MovimientoCajaEntity } from '@sanfrancisco/cajas/movimientos-caja.entity';
import { EstatusMovimientoCancelacionE } from '@sanfrancisco/cajas/estatusMovimiento.enum';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';
import { PaginationPrimeNgResult } from '../common/DTO/pagination-prime-Ng-result.dto';
import * as moment from 'moment';
import { CorteTesoreroEntity } from './cortesTesorero/cortesTesorero.entity';
import { EstatusCorte } from './cortesTesorero/estatusCorte.enum';
import { EstatusCaja } from '@sanfrancisco/cajas/estatusCaja.enum';
import { FaltanteDTO } from './cortesTesorero/faltante.dto';

@Injectable()
export class TesorerosService {
  constructor(private readonly cajaService: CajasService) {}

  async verSolicitudesCancelacion(): Promise<VentaEntity[]> {
    return await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.cliente', 'cliente')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.medico', 'medico')
      .select([
        'venta',
        'sucursal.id',
        'sucursal.nombre',
        'cliente.id',
        'cliente.nombre',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'medico.id',
        'medico.nombre',
      ])
      .where('venta.estatusCancelacion = :estatusCancelacion', {
        estatusCancelacion: EstadosCancelacionVenta.SOLICITUD,
      })
      .getMany();
  }

  async setObservaciones(
    cajaId: number,
    data: FaltanteDTO,
  ): Promise<UpdateResult> {
    return await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set({ faltante: data.faltante, observacionTesorero: data.observaciones })
      .where('id = :cajaId', {
        cajaId: cajaId,
      })
      .execute();
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(CorteTesoreroEntity)
      .createQueryBuilder('cortes')
      .leftJoin('cortes.cajas', 'cajas')
      .leftJoin('cajas.sucursal', 'sucursal')
      .leftJoin('cajas.usuario', 'usuario')
      .select([
        'cortes',
        'cajas',
        'sucursal.id',
        'sucursal.nombre',
        'usuario.id',
        'usuario.firstName',
        'usuario.lastName',
      ])
      .where('cortes.active = :active', {
        active: true,
      });

    forIn(options.filters, (value, key) => {
      switch (key) {
        case 'fecha':
          const fecha = value.split('*');
          const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
          const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
          dataQuery.andWhere('cortes.createdAt BETWEEN :inicio AND :fin', {
            inicio,
            fin,
          });
          break;

        case 'estatus':
          dataQuery.andWhere('cortes.estatus = :estatus', {
            estatus: value,
          });
          break;
        default:
          break;
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
    const dataR: any = data;
    if (dataR.length) {
      for (let idx = 0; idx < dataR.length; idx++) {
        const cajas: any = dataR[idx].cajas;
        const cajasR = [];

        if (cajas.length) {
          for (let j = 0; j < cajas.length; j++) {
            const caja =
              await this.cajaService.getTotalMovimientosByCajaCerrada(
                cajas[j].id,
              );

            cajas[j].depositos = caja.depositos || 0;
            cajas[j].retiros = caja.retiros || 0;
            cajas[j].ventas = caja.ventas || 0;
            cajas[j].cancelaciones = caja.cancelaciones || 0;
            cajas[j].transferencias = caja.transferencias || 0;
            cajas[j].tarjeta = caja.tarjeta || 0;
            cajas[j].efectivo = caja.efectivo || 0;
            cajas[j].cheque = caja.cheque || 0;
            cajas[j].credito = caja.credito || 0;
            cajasR.push(cajas[j]);
          }
          dataR[idx].cajas = cajasR;
        }
      }
    }

    return {
      data: dataR,
      skip: options.skip,
      totalItems: count,
    };
  }

  async verVentasCanceladas(): Promise<VentaEntity[]> {
    return await getRepository(VentaEntity)
      .createQueryBuilder('ventas')
      .leftJoin('ventas.usuarioCancelo', 'usuario')
      .select([
        'ventas',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ])
      .where('estatusCancelacion = :estatusCancelacion', {
        estatusCancelacion: EstadosCancelacionVenta.APROBADA,
      })
      .getMany();
  }

  async obtenerCajasAbiertas(
    user: LoginIdentityDTO,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const cajasQuery = getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoinAndSelect('caja.sucursal', 'sucursal')
      .leftJoinAndSelect('caja.usuario', 'usuario')
      .select([
        'sucursal.id',
        'sucursal.nombre',
        'sucursal.esMatriz',
        'sucursal.esLaboratorio',
        'sucursal.esForanea',
        'sucursal.responsable',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
        'caja.id',
        'caja.active',
        'caja.sucursalId',
        'caja.usuarioId',
        'caja.fechaApertura',
        'caja.fechaCierre',
        'caja.notas',
        'caja.estatus',
        'caja.total',
      ]);

    if (user.profile === ProfileTypes.TESORERO_SUCURSALES_CENTRALES) {
      cajasQuery.andWhere('sucursal.esForanea = :esForanea', {
        esForanea: false,
      });
    }
    if (user.profile === ProfileTypes.TESORERO_SUCURSALES_FORANEAS) {
      cajasQuery.andWhere('sucursal.esForanea = :esForanea', {
        esForanea: true,
      });
    }

    forIn(options.filters, (value, key) => {
      if (key === 'estatus') {
        cajasQuery.andWhere('caja.estatus = :estatus', {
          estatus: value,
        });
      }
      if (key === 'sucursal') {
        cajasQuery.andWhere('( sucursal.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'fecha') {
        const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
        const fin = moment(value).format('YYYY-MM-DD 23:59:59');
        cajasQuery.andWhere('fechaApertura BETWEEN :inicio AND :fin', {
          inicio: inicio,
          fin: fin,
        });
      }
    });

    const count = await cajasQuery.getCount();

    const data = await cajasQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }

  async movimientosSolicitudCancelacion(): Promise<MovimientoCajaEntity[]> {
    return await getRepository(MovimientoCajaEntity)
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.caja', 'caja')
      .leftJoinAndSelect('caja.sucursal', 'sucursal')
      .leftJoinAndSelect('caja.usuario', 'usuario')
      .select([
        'movimiento',
        'sucursal.id',
        'sucursal.nombre',
        'sucursal.esMatriz',
        'sucursal.esLaboratorio',
        'sucursal.esForanea',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
        'caja.id',
        'caja.active',
        'caja.sucursalId',
        'caja.usuarioId',
        'caja.fechaApertura',
        'caja.notas',
        'caja.estatus',
      ])
      .where('movimiento.estatusMovimiento = :status', {
        status: EstatusMovimientoCancelacionE.SOLICITUD,
      })
      .getMany();
  }

  async finalizarCorte(corteId: number): Promise<UpdateResult> {
    // Actualizar a "ENTREGADA" las cajas que pertenezcan al CorteTesoreroEntity
    await getRepository(CajaEntity)
      .createQueryBuilder()
      .update()
      .set({ estatus: EstatusCaja.ENTREGADA })
      .where('corteTesoreroId = :corteId', {
        corteId: corteId,
      })
      .execute();

    return await getRepository(CorteTesoreroEntity)
      .createQueryBuilder()
      .update()
      .set({
        estatus: EstatusCorte.ENTREGADO,
      })
      .where('id = :corteId', { corteId })
      .execute();
  }
}
