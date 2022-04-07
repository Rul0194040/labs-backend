import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AgregarPago } from './dtos/agregar-pago.dto';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { PagoEntity } from './pagos.entity';
import { VentaEntity } from '../ventas/ventas.entity';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { CajaEntity } from '../cajas/cajas.entity';
import { EstatusCaja } from '@sanfrancisco/cajas/estatusCaja.enum';
import { TiposMovimientoCaja } from '@sanfrancisco/common/enum/tiposMovimientoCaja.enum';
import { MovimientoCajaEntity } from '@sanfrancisco/cajas/movimientos-caja.entity';
import { InformePagosDTO } from './dtos/informe-pagos.dto';
import { EstadosVentas } from '@sanfrancisco/ventas/estadosVentas.enum';
import { ReciboPagosDTO } from './dtos/recibo-pagos.dto';
import * as moment from 'moment';
import * as convertidor from 'numero-a-letras';
import { VentaServiciosDTO } from '../ventas/DTOs/venta-servicios.dto';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { VentasService } from '@sanfrancisco/ventas/ventas.service';
import { DetalleVentasEntity } from '@sanfrancisco/ventas/ventasDetalle.entity';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';

@Injectable()
export class PagosService {
  constructor(
    private readonly pxService: PxlabService,
    private readonly ventasService: VentasService,
  ) {}
  /**
   * Crea un pago
   *
   * @param pago agrega un pago
   * @param user usuairo en sesión para verificar la caja
   * @returns {PagoEntity}
   */
  async create(
    pago: AgregarPago,
    user: LoginIdentityDTO,
  ): Promise<InformePagosDTO> {
    const venta = await getRepository(VentaEntity).findOne(pago.ventaId);

    if (!pago.fechaHora) {
      pago.fechaHora = moment().toDate(); //si no se especifica fecha y hora, usar la actual
    }
    if (!venta) {
      throw new HttpException('La venta no existe', HttpStatus.NOT_FOUND);
    }

    // si la venta ya esta pagada ya no puede hacer pagos
    if (venta.pagado) {
      throw new HttpException(
        'La venta ya esta pagada',
        HttpStatus.BAD_REQUEST,
      );
    }

    let caja: CajaEntity;
    let cajaQuery;
    let enviadoPx = false;
    if (user?.profile === ProfileTypes.SUCURSAL) {
      cajaQuery = getRepository(CajaEntity)
        .createQueryBuilder('caja')
        .leftJoin('caja.usuario', 'usuario')
        .leftJoin('caja.sucursal', 'sucursal')
        .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
          usuarioId: user.id,
          sucursalId: user.sucursal?.id,
        })
        .andWhere('estatus = :cajaEstatus', {
          cajaEstatus: EstatusCaja.ABIERTA,
        });
      caja = await cajaQuery.getOne();

      if (!caja) {
        throw new HttpException(
          'El usuario no tiene una caja abierta',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (venta.estatus === EstadosVentas.BORRADOR) {
      await getRepository(VentaEntity).update(
        { id: venta.id },
        { estatus: EstadosVentas.EN_PROCESO },
      );

      //enviar a px lab las ventas a credito, que no han sido enviadas.
      if (!venta.folioPxLab && venta.credito && pago.pagos.length === 0) {
        await this.pxService.enviarVenta(
          //obtenemos la venta por folio y la pasamos al service de px
          await this.ventasService.getventaByFolio(venta.folio),
          'N', //nuevo
        );
        enviadoPx = true;
      }
    }
    //ir por los servicios y calcular el total
    const sumVenta = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('dVenta')
      .select('SUM(dVenta.precio)', 'sum')
      .where('dVenta.ventaId = :ventaId', { ventaId: venta.id })
      .getRawOne();
    console.log('sumVenta', sumVenta.total);
    let totalVenta = sumVenta.sum;
    if (pago.descuento > 0) {
      totalVenta = sumVenta.sum - (sumVenta.sum * pago.descuento) / 100;
      pago.descuentoPesos = (sumVenta.sum * pago.descuento) / 100;
    } else if (pago.descuentoPesos > 0) {
      totalVenta = totalVenta - pago.descuentoPesos;
      pago.descuento = (pago.descuentoPesos * 100) / sumVenta.sum;
    }

    await getRepository(VentaEntity).update(
      { id: venta.id },
      {
        total: totalVenta,
        descuento: pago.descuento ? pago.descuento : 0,
        descuentoPesos: pago.descuentoPesos ? pago.descuentoPesos : 0,
        fechaUltimaRegla: pago.fechaUltimaRegla ? pago.fechaUltimaRegla : null,
        observaciones: pago.observaciones ? pago.observaciones : null,
        diagnostico: pago.diagnostico ? pago.diagnostico : null,
      },
    );

    // verificar si ya se han realizado pagos anteriormente
    const pagosAnteriores = await getRepository(PagoEntity)
      .createQueryBuilder('pagos')
      .leftJoin('pagos.venta', 'venta')
      .where('venta.id = :ventaId && pagos.estatus = :estatus', {
        ventaId: venta.id,
        estatus: true,
      })
      .getMany();
    const esPrimerPago = pagosAnteriores.length === 0;
    // si no existen pagos anteriores actualizar el saldo de la venta
    if (!pagosAnteriores.length) {
      // se calcula el descuento
      const nuevoSaldo = totalVenta;
      await getRepository(VentaEntity).update(
        { id: venta.id },
        {
          saldo: totalVenta,
        },
      );
      venta.saldo = nuevoSaldo;
    }

    const pagos: PagoEntity[] = pagosAnteriores;
    let suma = 0;

    const pagosNuevos: PagoEntity[] = [];
    for (let i = 0; i < pago.pagos.length; i++) {
      // guardar el pago
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
      const savedPago = await getRepository(PagoEntity).save(createPago);

      if (user?.profile === ProfileTypes.SUCURSAL) {
        // crear el movimiento de caja tipo venta
        const cajaMov = {
          caja,
          pago: savedPago,
          monto: pago.pagos[i].monto,
          tipoMovimiento: TiposMovimientoCaja.VENTA,
          notas: pago.pagos[i].notas !== null ? pago.pagos[i].notas : '',
        };

        await getRepository(MovimientoCajaEntity).save(cajaMov);
      }

      delete savedPago.venta;
      delete savedPago.caja;

      // sumar la cantidad de los pagos
      suma += pago.pagos[i].monto;
      pagos.push(savedPago);
      pagosNuevos.push(savedPago);
    }

    // actualiza el saldo de la venta restando la suma de los pagos
    const newSaldo = parseFloat(venta.saldo.toString()) - suma;
    await getRepository(VentaEntity).update(
      { id: venta.id },
      {
        saldo: newSaldo,
      },
    );

    // comprobar si el monto llegó a 0
    // si llegó a 0 la venta esta pagada
    const ventaCompr = await getRepository(VentaEntity).findOne(pago.ventaId);
    if (ventaCompr.saldo <= 0) {
      await getRepository(VentaEntity).update(
        { id: venta.id },
        {
          pagado: true,
        },
      );
    }

    //en el primer pago, pasar a la cola de entrega de pxlab
    if (!venta.folioPxLab && esPrimerPago && !enviadoPx) {
      //crear las tareas para enviar a px de sucursal
      //const responseTareas =
      await this.pxService.enviarVenta(
        //obtenemos la venta por folio y la pasamos al service de px
        await this.ventasService.getventaByFolio(venta.folio),
        'N',
      );
    }

    if (user.profile === ProfileTypes.SUCURSAL) {
      // actualiza el total que existe en caja
      const newTotal = parseFloat(caja.total.toString()) + suma;
      await cajaQuery.update().set({ total: newTotal }).execute();
    }

    const informePagos: InformePagosDTO = {
      venta: await getRepository(VentaEntity).findOne(pago.ventaId),
      pagos,
      pagosNuevos,
    };

    return informePagos;
  }

  /**
   * obtiene un pago por id
   *
   * @param id obtiene un pago por id
   * @returns {PagoEntity}
   */
  async getById(id: number): Promise<PagoEntity> {
    const pago = await getRepository(PagoEntity).findOne(id);
    if (!pago) {
      throw new HttpException('El pago no existe', HttpStatus.NOT_FOUND);
    }
    return pago;
  }

  /**
   * Elimina un pago
   *
   * @param id id del pago
   * @returns {DeleteResult}
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(PagoEntity).delete(id);
  }

  /**
   * Actualiza el estatus de un pago
   *
   * @param id id del pago
   * @param estatus estatus del pago
   * @returns {UpdateResult}
   */
  async updateStatus(id: number, estatus: number): Promise<UpdateResult> {
    return await getRepository(PagoEntity).update({ id }, { estatus });
  }

  /**
   * Cancela el pago
   *
   * @param id id del pago
   * @param motivo motivo de cancelacion
   * @returns {UpdateResult}
   */
  async cancelacionPago(id: number, motivo: string): Promise<UpdateResult> {
    const pago = await getRepository(PagoEntity).findOne(id);
    if (!pago) {
      throw new HttpException('El pago no existe', HttpStatus.NOT_FOUND);
    }

    if (pago.estatus === 0) {
      throw new HttpException(
        'El pago ya ha sido cancelado',
        HttpStatus.BAD_REQUEST,
      );
    }

    // actualiza el estatus del pago a cancelado
    const result = await getRepository(PagoEntity).update(
      { id },
      { estatus: 0 },
    );

    // actualiza el total de la venta con el monto del pago cancelado
    const venta = await getRepository(VentaEntity).findOne({
      id: pago.ventaId,
    });
    await getRepository(VentaEntity).update(
      { id: venta.id },
      { saldo: venta.saldo + pago.monto },
    );

    // cambia el estatus de movimiento de caja y motivoCancelacion si existe el pago
    const movimientoCaja = await getRepository(MovimientoCajaEntity).findOne({
      pagoId: pago.id,
    });

    if (movimientoCaja) {
      await getRepository(MovimientoCajaEntity)
        .createQueryBuilder()
        .update()
        .set({ estatus: 0, motivoCancelacion: motivo })
        .where('id = :movimientoId', { movimientoId: movimientoCaja.id })
        .execute();
    }
    return result;
  }

  /**
   * Obtiene la información para el recibo por pagos
   *
   * @param id id de la venta a imprimir el recibo
   * @param data Ids de los pagos a imprimir
   */
  async getReciboPagos(
    detalleVenta: VentaServiciosDTO,
    pagosId: number[],
  ): Promise<ReciboPagosDTO> {
    const pagos = await getRepository(PagoEntity)
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: pagosId })
      .getMany();
    let totalAbono = 0;
    pagos.forEach((pago) => {
      totalAbono += pago.monto;
    });
    const ticket: ReciboPagosDTO = {
      ...detalleVenta,
      pagos,
      sucursal: {
        direccion: `${detalleVenta.venta.sucursal?.calle} No. ${detalleVenta.venta.sucursal?.numExt}. Colonia ${detalleVenta.venta.sucursal?.colonia}, ${detalleVenta.venta.sucursal?.municipio}. CP. ${detalleVenta.venta.sucursal?.cp}.`,
        telefono: detalleVenta.venta.sucursal?.telefono,
        nombre: detalleVenta.venta.sucursal?.nombre,
      },
      cajero: `${detalleVenta.venta.caja?.usuario?.firstName} ${detalleVenta.venta.caja?.usuario?.lastName}`,
      fechaVenta: moment(detalleVenta.venta.fecha).format(
        'DD-MM-YYYY hh:mm:ss',
      ),
      totalAbonoVenta: convertidor.NumerosALetras(totalAbono),
      totalAbono,
    };

    return ticket;
  }

  /**
   * Abonar pagos al cliente
   *
   * @param clienteId id del cliente
   * @param monto monto a abonar
   * @returns {UpdateResult}
   */
  async abonarPagoCliente(
    clienteId: number,
    monto: number,
  ): Promise<UpdateResult> {
    const ventasQuery = getRepository(VentaEntity)
      .createQueryBuilder('ventas')
      .leftJoin('ventas.cliente', 'cliente')
      .where('cliente.id = :clienteId', { clienteId })
      .andWhere('ventas.pagado = :estaPagada', { estaPagada: false })
      .andWhere('ventas.saldo > 0');

    const ventas = await ventasQuery
      .orderBy('ventas.createdAt', 'DESC')
      .getMany();

    if (!ventas.length) {
      throw new HttpException(
        'El cliente no tiene pagos pendiente',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cantidad = ventas.map((e) => e.saldo).reduce((ac, cv) => ac + cv);

    if (monto === cantidad) {
      return await ventasQuery
        .update()
        .set({ saldo: 0, pagado: true })
        .execute();
    } else if (monto > cantidad) {
      const result = monto - cantidad;
      throw new HttpException(
        `El monto es superior al adeudo por $${result}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let result: UpdateResult;

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
        } else {
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
}
