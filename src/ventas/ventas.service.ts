import { updateSeguimientoVenta } from './../pagos/dtos/updateSegumientoVenta.dto';
import { InformeFolioDTO } from './DTOs/informe-folio.dto';
import { PagoEntity } from './../pagos/pagos.entity';
import { AsignDetalleDTO } from './DTOs/create-detalle.dto';
import { TipoUnidadEntity } from './../catalogos/tipos-unidades/tipos-unidades.entity';
import { LoginIdentityDTO } from './../auth/dto/loginIdentity.dto';
import { DetalleVentasInsumosEntity } from './ventasDetalleInsumos.entity';
import { PacienteEntity } from './../pacientes/pacientes.entity';
import { ClienteVentaDTO } from './DTOs/cliente-venta.dto';
import { PacienteVentaDTO } from './DTOs/paciente-venta.dto';
import { CreateVentaDTO } from './DTOs/create-venta.dto';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn, groupBy, pick } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { EstadosVentas } from './estadosVentas.enum';

import { InsumosServicioDTO } from './DTOs/insumos-servicio.dto';
import { DetalleVentasEntity } from './ventasDetalle.entity';
import { ServicioEntity } from '@sanfrancisco/servicios/servicio.entity';
import { SucursalesInsumosEntity } from '@sanfrancisco/sucursales/sucursalesInsumos.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { UpdateCreditoDTO } from './DTOs/update-credito.dto';
import { CajaEntity } from '../cajas/cajas.entity';
import { EstatusCaja } from '@sanfrancisco/cajas/estatusCaja.enum';
import { VentaServiciosDTO } from './DTOs/venta-servicios.dto';
import { TicketVentaDTO } from './DTOs/ticket-venta.dto';
import * as moment from 'moment';
import * as convertidor from 'numero-a-letras';
import { TransaccionDTO } from './DTOs/transaccion.dto';
import { VentaDetalleInsumosDTO } from './DTOs/venta-detalle-insumos.dto';
import { EstadosCancelacionVenta } from './estadosCancelacion.enum';

import { ClienteEntity } from '../clientes/clientes.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicoEntity } from '../medicos/medico.entity';
import {
  AutorizarDescuentoDTO,
  AutorizarDescuentoResponseDTO,
} from './DTOs/autorizar-descuento.dto';
import { MuestraEntity } from './muestras/muestras.entity';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { MaquiladorVentaDTO } from './DTOs/maquilador-venta.dto';
import { VendedorVentaDTO } from './DTOs/vendedor-venta.dto';
import { CaptadorVentaDTO } from './DTOs/captador-venta.dto';
import { MyLogger } from '@sanfrancisco/logger';
import {
  PerfilTipoEmpleado,
  ProfileTypes,
} from '@sanfrancisco/users/profiles.enum';

@Injectable()
export class VentasService {
  constructor(
    private readonly pxService: PxlabService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private readonly notFoundMessage = 'Venta no encontrada';
  logger = new MyLogger(VentasService.name);

  /**
   * Crear una venta
   *
   * @param venta datos de la venta
   * @param user Usuario en sesión
   * @returns {VentaEntity}
   */
  async create(
    venta: CreateVentaDTO,
    user: LoginIdentityDTO,
  ): Promise<VentaEntity> {
    const fecha = new Date();
    const caja = await getRepository(CajaEntity)
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

    let ventaToCreate: any = {};

    if (venta.pacienteId) {
      const paciente = await getRepository(PacienteEntity).findOne(
        venta.pacienteId,
      );
      let cliente = null;
      if (paciente && paciente.clienteId) {
        cliente = await getRepository(ClienteEntity).findOne(
          paciente.clienteId,
        );
      } else {
        //buscar al publico
        cliente = await getRepository(ClienteEntity).findOne({
          where: { cuentaPxLab: '1' },
        });
      }

      if (!paciente) {
        throw new HttpException('paciente no encontrado', HttpStatus.NOT_FOUND);
      }
      ventaToCreate = {
        sucursal: user.sucursal,
        caja,
        paciente,
        fecha,
        zona: venta.zona,
      };
      if (cliente) {
        ventaToCreate.cliente = cliente;
      }
    } else {
      ventaToCreate = {
        sucursal: user.sucursal,
        caja,
        fecha,
        zona: venta.zona,
      };
    }

    ventaToCreate.diagnostico = venta.diagnostico || null;
    ventaToCreate.fechaUltimaRegla = venta.fechaUltimaRegla || null;
    ventaToCreate.observaciones = venta.observaciones || null;
    ventaToCreate.tipoPrecio = venta.tipoPrecio;

    if (venta.medicoId) {
      const medico = await getRepository(MedicoEntity).findOne(venta.medicoId);
      if (!medico) {
        throw new HttpException('medico no encontrado', HttpStatus.NOT_FOUND);
      }
      ventaToCreate.medico = medico;
    }

    ventaToCreate.acceso = (Math.random() * 1000000000).toFixed(0).substr(0, 8);

    const ventaSave = await getRepository(VentaEntity).save(ventaToCreate);

    const folio = () => {
      const sucursalId = user.sucursal.id.toString();
      const ventaId = ventaSave.id;
      let result: string;

      if (sucursalId.length === 1) {
        result = '00' + sucursalId + ventaId;
      } else if (sucursalId.length === 2) {
        result = '0' + sucursalId + ventaId;
      } else {
        result = sucursalId + ventaId;
      }
      return result;
    };

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ folio: folio() })
      .where('id = :ventaId', { ventaId: ventaSave.id })
      .execute();

    const ventaFinal = await this.getById(ventaSave.id);
    //notificar por sockets
    this.eventEmitter.emit('gateway.send', {
      channel: 'admin',
      event: 'nuevaVenta',
      data: ventaFinal,
    });
    return ventaFinal;
  }

  async updateSeguimientoVenta(
    ventaId: number,
    venta: updateSeguimientoVenta,
  ): Promise<UpdateResult> {
    const v = await getRepository(VentaEntity).findOne(ventaId);

    const resultUpdate = await getRepository(VentaEntity).update(
      { id: v.id },
      {
        fechaUltimaRegla: venta.fechaUltimaRegla
          ? venta.fechaUltimaRegla
          : null,
        observaciones: venta.observaciones ? venta.observaciones : null,
        diagnostico: venta.diagnostico ? venta.diagnostico : null,
      },
    );

    if (resultUpdate.affected) {
      //notificar a px la cancelacion
      await this.pxService.enviarVenta(
        //obtenemos la venta por folio y la pasamos al service de px
        await this.getventaByFolio(v.folio),
        'M', //modificacion
      );
    }
    return resultUpdate;
  }

  async ClienteAVenta(detalles: ClienteVentaDTO): Promise<ClienteEntity> {
    const cliente = await getRepository(ClienteEntity).findOne(
      detalles.clienteId,
    );

    if (!cliente) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ cliente })
      .where('id=:id', { id: detalles.ventaId })
      .execute();

    return cliente;
  }

  async MaquiladorAVenta(
    detalles: MaquiladorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    const maquilador = await getRepository(UsersEntity).findOne(
      detalles.maquiladorId,
    );

    if (!maquilador) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ maquilador })
      .where('id=:id', { id: detalles.ventaId })
      .execute();

    return pick(maquilador, [
      'id',
      'uuid',
      'firstName',
      'lastName',
      'profile',
      'comisionVendedor',
      'tipoEmpleado',
    ]);
  }

  async VendedorAVenta(
    detalles: VendedorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    const vendedor = await getRepository(UsersEntity).findOne(
      detalles.vendedorId,
    );

    if (!vendedor) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ vendedor })
      .where('id=:id', { id: detalles.ventaId })
      .execute();

    return pick(vendedor, [
      'id',
      'uuid',
      'firstName',
      'lastName',
      'profile',
      'comisionVendedor',
      'tipoEmpleado',
    ]);
  }

  async CaptadorAVenta(
    detalles: CaptadorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    const captador = await getRepository(UsersEntity).findOne(
      detalles.captadorId,
    );

    if (!captador) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ captador })
      .where('id=:id', { id: detalles.ventaId })
      .execute();

    return pick(captador, [
      'id',
      'uuid',
      'firstName',
      'lastName',
      'profile',
      'comisionVendedor',
      'tipoEmpleado',
    ]);
  }

  async PacienteAVenta(detalles: PacienteVentaDTO): Promise<PacienteEntity> {
    const paciente = await getRepository(PacienteEntity).findOne(
      detalles.pacienteId,
    );

    if (!paciente) {
      throw new HttpException('paciente no encontrado', HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ paciente })
      .where('id=:id', { id: detalles.ventaId })
      .execute();

    return paciente;
  }

  async removeCliente(@Param('id') id: number): Promise<UpdateResult> {
    return getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ paciente: null })
      .where('id=:id', { id })
      .execute();
  }

  async CreateDetalle(detalles: AsignDetalleDTO): Promise<DetalleVentasEntity> {
    /**
     * detalle:{ventadetalle, ventaDetalleInsumo}
     */

    //buscamos la venta que va en detalle venta
    const venta = await getRepository(VentaEntity).findOne(detalles.ventaId);

    if (!venta) {
      throw new HttpException('venta no encontrada', HttpStatus.NOT_FOUND);
    }
    //buscamos el servicio que va en detalle ventas
    const servicio = await getRepository(ServicioEntity).findOne(
      detalles.servicio.servicioId,
    );

    if (!servicio) {
      throw new HttpException('servicio no encontrado', HttpStatus.NOT_FOUND);
    }

    //afectar el total
    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ total: Number(venta.total) + Number(detalles.precio) })
      .where('id = :ventaId', { ventaId: venta.id })
      .execute();

    //creamos el objeto detalle que va en detalle ventas
    const DetalleToCreate = {
      venta,
      servicio,
      medico: detalles.medico ? detalles.medico : null,
      recomendaciones: detalles.recomendaciones
        ? detalles.recomendaciones
        : null,
      precio: detalles.precio,
      descuento: detalles.descuento,
    };
    //en detalleventas guardamos el objeto
    const savedDetalle = await getRepository(DetalleVentasEntity).save(
      DetalleToCreate,
    );

    const result = getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalleventa')
      .leftJoinAndSelect('detalleventa.servicio', 'servicio')
      .where('detalleventa.id = :id', {
        id: savedDetalle.id,
      })
      .getOne();

    return result;
  }

  async removeDetalle(id: number): Promise<DeleteResult> {
    const detalle = await getRepository(DetalleVentasEntity).findOne({ id });

    if (!detalle) {
      throw new HttpException('detalle no encontrado', HttpStatus.NOT_FOUND);
    }

    //buscamos la venta que va en detalle venta
    const venta = await getRepository(VentaEntity).findOne({
      id: detalle.ventaId,
    });

    const nuevoTotalVenta = Number(venta.total) - Number(detalle.precio);

    //afectar el total de la venta
    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ total: nuevoTotalVenta })
      .where('id = :ventaId', { ventaId: venta.id })
      .execute();

    return await getRepository(DetalleVentasEntity).delete({ id });
  }

  async updateTransaccion(
    id: number,
    montos: TransaccionDTO,
  ): Promise<UpdateResult> {
    return await getRepository(VentaEntity).update(id, {
      efectivoRecibido: montos.efectivoRecibido,
      cambio: montos.cambio,
    });
  }

  async getDetalleVentaPorId(
    detalleVentaId: number,
  ): Promise<DetalleVentasEntity> {
    return await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalleVenta')
      .where({ id: detalleVentaId })
      .getOne();
  }

  /**
   *
   *
   *agregar uno a varios insumos a un detalle de venta (servicio/estudio)
   *y afectar los totales de dichos insumos en la sucursal
   *
   * @param detalles
   * @param detalleVentaId
   * @param user
   * @returns
   */
  async insumosADetalle(
    detalles: InsumosServicioDTO[],
    detalleVentaId: number,
    user: LoginIdentityDTO,
  ): Promise<DetalleVentasInsumosEntity[]> {
    const usuario = await getRepository(UsersEntity).findOne({
      where: { id: user.id },
      select: ['id', 'email', 'firstName', 'lastName', 'email', 'telefono'],
    });
    const respuesta = [];

    for (let index = 0; index < detalles.length; index++) {
      const insumoSucursal = await getRepository(
        SucursalesInsumosEntity,
      ).findOne({
        where: { id: detalles[index].insumoSucursalId },
        relations: ['lote'],
      });

      const restante = insumoSucursal.existencia - detalles[index].cantidad;

      let unidad = new TipoUnidadEntity();
      if (detalles[index].unidadId) {
        unidad = await getRepository(TipoUnidadEntity).findOne(
          detalles[index].unidadId,
        );
      }

      const insumoTocreate = {
        usuario,
        detalleVentaId: detalleVentaId,
        unidad,
        insumoSucursal,
        cantidad: detalles[index].cantidad,
        nota: detalles[index].nota,
      };

      respuesta.push(
        await getRepository(DetalleVentasInsumosEntity).save(insumoTocreate),
      );
      //TODO Checar con Soto si esto es lo que pidio en un principio
      //Afectar la existencia en suscursal
      await getRepository(SucursalesInsumosEntity)
        .createQueryBuilder()
        .update()
        .set({ existencia: restante })
        .where('id=:id', { id: insumoSucursal.id })
        .execute();
    }

    return respuesta;
  }

  /**
   *
   *
   *retira uno a varios insumos a un detalle de venta (servicio/estudio)
   *y afectar los totales de dichos insumos en la sucursal
   *
   * @param detalleVentaId
   * @returns
   */
  async insumosADetalleRetiro(
    detalleVentasInsumoId: number,
  ): Promise<UpdateResult> {
    const ventaInsumo = await getRepository(DetalleVentasInsumosEntity).findOne(
      detalleVentasInsumoId,
    );

    const sucIn = await getRepository(SucursalesInsumosEntity).findOne(
      ventaInsumo.insumoSucursalId,
    );

    //Borro el registro del insumo de venta

    await getRepository(DetalleVentasInsumosEntity).delete(
      detalleVentasInsumoId,
    );

    const nuevoTotal = sucIn.existencia + ventaInsumo.cantidad;

    //Afectar la existencia en suscursal
    return await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder()
      .update()
      .set({ existencia: Number(nuevoTotal) })
      .where('id=:id', { id: sucIn.id })
      .execute();
  }

  async FinalizadoVenta(ventaId: number): Promise<any> {
    const ventaQuery = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('det')
      .leftJoin('det.venta', 'venta')
      .where('venta.id =:ventaId', { ventaId })
      .getMany();

    const allCerrado = ventaQuery.every((e) => e.cerrado);

    if (allCerrado) {
      return await getRepository(VentaEntity)
        .createQueryBuilder()
        .update()
        .set({ estatus: EstadosVentas.FINALIZADA })
        .where('id=:ventaId', { ventaId })
        .execute();
    } else {
      throw new HttpException(
        'Faltan detalles por cerrar en la venta',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getInsumoDetallePorVenta(
    ventaId: number,
  ): Promise<VentaDetalleInsumosDTO[]> {
    const respuesta: VentaDetalleInsumosDTO[] = [];
    const detalleVentasInsumos = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalleVenta')
      .leftJoin('detalleVenta.venta', 'venta')
      .leftJoinAndSelect('detalleVenta.servicio', 'servicio')
      .where('venta.id = :ventaId', {
        ventaId,
      })
      .getMany();
    for (let i = 0; i < detalleVentasInsumos.length; i++) {
      const insumos = await getRepository(DetalleVentasInsumosEntity)
        .createQueryBuilder('detalleInsumoVenta')
        .leftJoin('detalleInsumoVenta.detalleVenta', 'detalleVenta')
        .leftJoinAndSelect(
          'detalleInsumoVenta.insumoSucursal',
          'insumoSucursal',
        )
        .leftJoinAndSelect('insumoSucursal.insumo', 'insumo')
        .leftJoinAndSelect('insumoSucursal.lote', 'lote')
        .leftJoinAndSelect('detalleInsumoVenta.unidad', 'unidad')
        .where('detalleVenta.id = :detalleVentaId', {
          detalleVentaId: detalleVentasInsumos[i].id,
        })
        .select([
          'detalleInsumoVenta',
          'insumoSucursal.id',
          'insumoSucursal.lote',
          'lote',
          'insumo.id',
          'insumo.nombre',
          'insumo.descuentaEn',
          'unidad.id',
          'unidad.nombre',
        ])
        .getMany();

      const muestras = await getRepository(MuestraEntity)
        .createQueryBuilder('muestra')
        .leftJoin('muestra.usuario', 'usuario')
        .leftJoin('muestra.ventaDetalle', 'ventaDetalle')
        .select([
          'usuario.id',
          'usuario.firstName',
          'usuario.lastName',
          'muestra',
        ])
        .where('ventaDetalle.id = :detalleVentaId', {
          detalleVentaId: detalleVentasInsumos[i].id,
        })
        .getMany();

      const item: VentaDetalleInsumosDTO = {
        ...detalleVentasInsumos[i],
        insumos,
        muestras,
      };
      respuesta.push(item);
    }
    return respuesta;
  }

  //TODO muestras de cada detalle de venta, en un arreglo de muestras

  async getInsumosPorDetalleVenta(
    detalleVentaId: number,
  ): Promise<DetalleVentasInsumosEntity[]> {
    return await getRepository(DetalleVentasInsumosEntity)
      .createQueryBuilder('detalleInsumoVenta')
      .leftJoin('detalleInsumoVenta.detalleVenta', 'detalleVenta')
      .where('detalleVenta.id = :detalleVentaId', {
        detalleVentaId,
      })
      .getMany();
  }

  async updateEstadoDetalleVenta(detalleVentaId: number): Promise<boolean> {
    await getRepository(DetalleVentasEntity)
      .createQueryBuilder('ventaDetalle')
      .update()
      .set({ cerrado: () => '!cerrado' })
      .where({ id: detalleVentaId })
      .execute();
    const detalleVenta = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalleVenta')
      .where('id = :detalleVentaId', { detalleVentaId })
      .getOne();
    return detalleVenta.cerrado;
  }

  async updateEstadosDetalleVenta(
    ventaId: number,
    estado: boolean,
  ): Promise<DetalleVentasEntity[]> {
    await getRepository(DetalleVentasEntity)
      .createQueryBuilder('ventaDetalle')
      .update()
      .set({ cerrado: estado })
      .where('ventaId = :ventaId', { ventaId })
      .execute();

    const detalleVenta = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalleVenta')
      .where('ventaId = :ventaId', { ventaId })
      .getMany();

    return detalleVenta;
  }

  /**
   * Retorna una venta por id
   * @param id
   */
  async getById(id: number): Promise<VentaEntity> {
    const venta = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.paciente', 'paciente')
      .leftJoinAndSelect('paciente.cliente', 'cliente')
      .leftJoinAndSelect('venta.cliente', 'clienteVenta')
      .leftJoinAndSelect('venta.medico', 'medico')
      .leftJoinAndSelect('venta.vendedor', 'vendedor')
      .leftJoinAndSelect('venta.maquilador', 'maquilador')
      .leftJoinAndSelect('venta.captador', 'captador')
      .where('venta.id = :ventaId', { ventaId: id })
      .select([
        'venta',
        'paciente',
        'cliente',
        'clienteVenta',
        'medico',
        'vendedor.comisionVendedor',
        'vendedor.firstName',
        'vendedor.lastName',
        'vendedor.profile',
        'vendedor.tipoEmpleado',
        'vendedor.id',
        'vendedor.uuid',
        'maquilador.comisionVendedor',
        'maquilador.firstName',
        'maquilador.lastName',
        'maquilador.profile',
        'maquilador.tipoEmpleado',
        'maquilador.id',
        'maquilador.uuid',
        'captador.comisionVendedor',
        'captador.firstName',
        'captador.lastName',
        'captador.profile',
        'captador.tipoEmpleado',
        'captador.id',
        'captador.uuid',
      ])
      .getOne();

    if (!venta) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return venta;
  }

  async getByUuid(uuid: string): Promise<VentaEntity> {
    const venta = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.paciente', 'paciente')
      .leftJoinAndSelect('paciente.cliente', 'cliente')
      .leftJoinAndSelect('venta.cliente', 'clienteVenta')
      .leftJoinAndSelect('venta.medico', 'medico')
      .where('venta.uuid = :ventaId', { ventaId: uuid })
      .getOne();

    if (!venta) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return venta;
  }

  /**
   * Busca todas las ventas a crédito de un cliente
   * @param id del cliente
   * @returns Ventas a crédito del cliente
   */

  async getVentasCreditoCliente(
    clienteId: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.paciente', 'paciente')
      .leftJoinAndSelect('venta.medico', 'medico')
      .leftJoin('paciente.cliente', 'cliente')
      .leftJoin('venta.cliente', 'clienteVenta')
      .where('venta.credito = true')
      .andWhere('cliente.id = :clienteId', { clienteId });

    forIn(options.filters, (value, key) => {
      if (key === 'estatus') {
        if (value === EstadosVentas.FINALIZADA || EstadosVentas.CANCELADA) {
          dataQuery.andWhere('(venta.estatus=:status)', {
            status: value,
          });
        }
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'venta.createdAt';
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
   * Retorna una venta por id y su detalleVenta
   * @param id
   */
  async getDetalleVentaById(ventaId: number): Promise<VentaServiciosDTO> {
    const venta = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.paciente', 'paciente')
      .leftJoinAndSelect('paciente.cliente', 'clientePaciente')
      .leftJoinAndSelect('venta.medico', 'medico')
      .leftJoinAndSelect('venta.sucursal', 'sucursal')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.caja', 'caja')
      .leftJoinAndSelect('venta.autorizoDescuento', 'autorizoDescuento')
      .leftJoinAndSelect('caja.usuario', 'usuario')
      .leftJoinAndSelect('venta.vendedor', 'vendedor')
      .leftJoinAndSelect('venta.captador', 'captador')
      .leftJoinAndSelect('venta.maquilador', 'maquilador')
      .where('venta.id = :ventaId', { ventaId })
      .select([
        'venta',
        'paciente',
        'clientePaciente',
        'medico',
        'sucursal',
        'cliente',
        'caja',
        'autorizoDescuento.id',
        'autorizoDescuento.firstName',
        'autorizoDescuento.lastName',
        'usuario',
        'vendedor.comisionVendedor',
        'vendedor.firstName',
        'vendedor.lastName',
        'vendedor.profile',
        'vendedor.tipoEmpleado',
        'vendedor.id',
        'vendedor.uuid',
        'maquilador.comisionVendedor',
        'maquilador.firstName',
        'maquilador.lastName',
        'maquilador.profile',
        'maquilador.tipoEmpleado',
        'maquilador.id',
        'maquilador.uuid',
        'captador.comisionVendedor',
        'captador.firstName',
        'captador.lastName',
        'captador.profile',
        'captador.tipoEmpleado',
        'captador.id',
        'captador.uuid',
      ])
      .getOne();

    if (!venta) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const detalle = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.servicio', 'servicio')
      .where('detalle.venta = :ventaId', { ventaId })
      .getMany();

    const pagos = await getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .where('pago.venta = :ventaId', { ventaId })
      .getMany();

    return {
      venta,
      detalle,
      pagos,
    };
  }

  /**
   * Retorna una venta por id
   * @param id
   */
  async getventaByFolio(folio: string): Promise<InformeFolioDTO> {
    const venta = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.paciente', 'paciente')
      .leftJoinAndSelect('paciente.cliente', 'cliente')
      .leftJoinAndSelect('venta.sucursal', 'sucursal')
      .leftJoinAndSelect('venta.cliente', 'clienteVenta')
      .leftJoinAndSelect('venta.medico', 'medico')
      .leftJoinAndSelect('venta.autorizoDescuento', 'autorizoDescuento')
      .leftJoin('venta.caja', 'caja')
      .leftJoinAndSelect('caja.usuario', 'cajero')
      .leftJoinAndSelect('venta.vendedor', 'vendedor')
      .leftJoinAndSelect('venta.maquilador', 'maquilador')
      .leftJoinAndSelect('venta.captador', 'captador')
      .where('venta.folio = :folio', { folio })
      .select([
        'venta',
        'paciente',
        'cliente',
        'sucursal',
        'clienteVenta',
        'medico',
        'autorizoDescuento.id',
        'autorizoDescuento.firstName',
        'autorizoDescuento.lastName',
        'cajero',
        'vendedor.comisionVendedor',
        'vendedor.firstName',
        'vendedor.lastName',
        'vendedor.profile',
        'vendedor.tipoEmpleado',
        'vendedor.id',
        'vendedor.uuid',
        'maquilador.comisionVendedor',
        'maquilador.firstName',
        'maquilador.lastName',
        'maquilador.profile',
        'maquilador.tipoEmpleado',
        'maquilador.id',
        'maquilador.uuid',
        'captador.comisionVendedor',
        'captador.firstName',
        'captador.lastName',
        'captador.profile',
        'captador.tipoEmpleado',
        'captador.id',
        'captador.uuid',
      ])
      .getOne();

    if (!venta) {
      throw new HttpException('Venta no encontrada', HttpStatus.NOT_FOUND);
    }

    const detalle = await getRepository(DetalleVentasEntity)
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.servicio', 'servicio')
      .where('detalle.ventaId = :ventaId', { ventaId: venta.id })
      .getMany();

    if (!detalle) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const pagos = await getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .where('pago.ventaId = :ventaId', { ventaId: venta.id })
      .andWhere('pago.estatus = 1')
      .getMany();

    const data: InformeFolioDTO = {
      venta,
      detalle,
      pagos,
    };

    return data;
  }

  /**
   * Cambia el estatus de un venta
   *
   * @param id del objeto a cambiar el status
   * @param active referencia del valor del status
   */
  async updateStatus(
    id: number,
    estatusNuevo: EstadosVentas,
  ): Promise<UpdateResult> {
    //ir por la venta original para comparar el estado anterior y obtener el folio
    const ventaOriginal = await this.getById(id);

    if (!ventaOriginal) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const updateResult = await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .update()
      .set({ estatus: estatusNuevo })
      .where({ id: ventaOriginal.id })
      .execute();

    return updateResult;
  }

  // actualizar un objeto venta
  async updateVenta(id: number, nuevaVenta: VentaEntity): Promise<VentaEntity> {
    //ir por la venta original para comparar el estado anterior y obtener el folio
    const ventaOriginal = await this.getById(id);

    if (!ventaOriginal) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    await getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .update()
      .set({
        ...nuevaVenta,
      })
      .where({ id: ventaOriginal.id })
      .execute();

    return await this.getById(id);
  }

  async updateFolioPx(ventaId, responsePx) {
    let folioPx = 'FAILED';
    if (responsePx.MuestraResult.split('|')[0] === '1') {
      folioPx = responsePx.MuestraResult.split('|')[1];
      this.logger.verbose('Venta actualizada con folio px', folioPx);
      //modificar la venta y ponerle el folioPx
      return await getRepository(VentaEntity)
        .createQueryBuilder('venta')
        .update()
        .set({ folioPxLab: folioPx })
        .where({ id: ventaId })
        .execute();
    }
  }

  async solicitarCancelacion(ventaId: number, motivoCancelacion: string) {
    const venta = await this.getById(ventaId);
    if (!venta) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    //notificar por sockets
    this.eventEmitter.emit('gateway.send', {
      channel: 'tesorero_general',
      event: 'solicitudCancelacionVenta',
      data: { venta },
    });

    return await getRepository(VentaEntity).update(
      { id: ventaId },
      {
        estatusCancelacion: EstadosCancelacionVenta.SOLICITUD,
        motivoCancelacion,
      },
    );
  }

  async cancelarVenta(
    id: number,
    estatusCancelacion: EstadosCancelacionVenta,
    user: UsersEntity,
  ): Promise<UpdateResult> {
    const venta = await this.getById(id);

    if (!venta) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const caja = await getRepository(CajaEntity).findOne({ id: venta.cajaId });

    // cambiar el estatus de cancelacion (aprobada - rechazada)
    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ estatusCancelacion, usuarioCancelo: user })
      .where('id = :id', { id })
      .execute();

    if (estatusCancelacion === EstadosCancelacionVenta.APROBADA) {
      const pagos = await getRepository(PagoEntity)
        .createQueryBuilder('pagos')
        .leftJoin('pagos.venta', 'venta')
        .select('SUM(pagos.monto) AS totalPagos')
        .where('venta.id = :id', { id })
        .getRawOne();

      const newTotalCaja = Number(caja.total) - pagos.totalPagos;

      await getRepository(CajaEntity)
        .createQueryBuilder()
        .update()
        .set({ total: newTotalCaja })
        .where('id = :cajaId', { cajaId: caja.id })
        .execute();

      // actualizar el estatus del pago a cancelado
      await getRepository(PagoEntity)
        .createQueryBuilder('pago')
        .leftJoin('pago.venta', 'venta')
        .update()
        .set({ estatus: 0 })
        .where('venta.id = :ventaId', { ventaId: id })
        .execute();

      //notificar por sockets
      this.eventEmitter.emit('gateway.send', {
        channel: 'admin',
        event: 'solicitudCancelacionAceptada',
        data: { venta },
      });

      //notificar a px la cancelacion
      await this.pxService.enviarVenta(
        //obtenemos la venta por folio y la pasamos al service de px
        await this.getventaByFolio(venta.folio),
        'C', //cancelacion
      );

      return this.updateStatus(id, EstadosVentas.CANCELADA);
    }
    this.eventEmitter.emit('gateway.send', {
      channel: 'admin',
      event: 'solicitudCancelacionRechazada',
      data: { venta },
    });
    return this.updateStatus(id, EstadosVentas.EN_PROCESO);
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(VentaEntity).delete({ id });
  }

  /**
   * Pagina las ventas
   * @param options opciones de paginacion de los registros
   */
  async paginate(
    cajaId: number,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.caja', 'caja')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .select([
        'venta',
        'cliente.id',
        'cliente.nombre',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
      ])
      .where('caja.id = :cajaId', { cajaId });
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( venta.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      } else if (key === 'folio') {
        dataQuery.andWhere('( venta.folio LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined || !Object.keys(options.sort).length) {
      options.sort = 'venta.createdAt';
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
   * Pagina las ventas con clientes registrados
   * @param options opciones de paginacion de los registros
   */
  async paginateVentasClientes(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .where('cliente.id IS NOT null')
      .select(['venta', 'cliente.id', 'cliente.nombre']);
    forIn(options.filters, (value, key) => {
      if (key === 'cliente') {
        dataQuery.andWhere('( cliente.nombre LIKE :term )', {
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
   * Pagina las ventas vencidas o pagadas por paciente
   * @param options opciones de paginacion de los registros
   */
  async paginateVentasPaciente(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.paciente', 'paciente')
      .select(['venta', 'paciente.id', 'paciente.nombre']);
    forIn(options.filters, (value, key) => {
      if (key === 'paciente') {
        dataQuery.andWhere('( paciente.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'estatus') {
        const estado = value;
        if (estado === EstadosVentas.FINALIZADA || EstadosVentas.CANCELADA) {
          dataQuery.andWhere('(venta.estatus=:status)', {
            status: estado,
          });
        }
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
   * Pagina los pagos de la venta
   * @param options opciones de paginacion de los registros
   */
  async getPagosByVenta(ventaId: number): Promise<PagoEntity[]> {
    return getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .leftJoin('pago.venta', 'venta')
      .select([
        'pago.id',
        'pago.monto',
        'venta.id',
        'pago.estatus',
        'pago.caja',
      ])
      .where('venta.id = :ventaId', { ventaId })
      .getMany();
  }

  async updateCredito(
    id: number,
    credito: UpdateCreditoDTO,
  ): Promise<UpdateResult> {
    const venta = await getRepository(VentaEntity).findOne(id);
    const fechaLimite = moment(venta.createdAt.getDate())
      .add(credito.diasCredito, 'd')
      .format('YYYY-MM-DD');

    return await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({
        fechaLimiteCredito: fechaLimite,
        credito: credito.credito,
        diasCredito: credito.diasCredito,
      })
      .where('id=:ventaId', { ventaId: venta.id })
      .execute();
  }

  /**
   * Obtiene la información necesaria para generar un ticket de venta
   * @param ventaId Id de la venta.
   */
  async getTicketVenta(ventaId: number): Promise<TicketVentaDTO> {
    const detalleVenta: VentaServiciosDTO = await this.getDetalleVentaById(
      ventaId,
    );
    detalleVenta.pagos = detalleVenta.pagos.filter((pago) => !pago.cobranza);
    const ticket: TicketVentaDTO = {
      ...detalleVenta,
      sucursal: {
        direccion: {
          calle: detalleVenta.venta.sucursal?.calle,
          numExt: detalleVenta.venta.sucursal?.numExt,
          colonia: detalleVenta.venta.sucursal?.colonia,
          municipio: detalleVenta.venta.sucursal?.municipio,
          cp: detalleVenta.venta.sucursal?.cp,
        },
        telefono: detalleVenta.venta.sucursal?.telefono,
        nombre: detalleVenta.venta.sucursal?.nombre,
      },
      cajero: `${detalleVenta.venta.caja?.usuario?.firstName} ${detalleVenta.venta.caja?.usuario?.lastName}`,
      fechaVenta: moment(detalleVenta.venta.fecha).format(
        'DD-MM-YYYY hh:mm:ss',
      ),
      totalVentaLetra: convertidor.NumerosALetras(detalleVenta.venta.total),
    };

    return ticket;
  }

  async autorizarDescuento(
    ventaId: number,
    data: AutorizarDescuentoDTO,
  ): Promise<AutorizarDescuentoResponseDTO> {
    const usuario = await getRepository(UsersEntity).findOne({ nip: data.nip });

    if (!usuario) {
      return {
        modificado: false,
      };
    }

    const result = {
      id: usuario.id,
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      maxDescuento: usuario.maxDescuento,
      modificado: false,
    };

    if (data.maxDescuento > usuario.maxDescuento) {
      return result;
    }

    await getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ autorizoDescuento: usuario, notaDescuento: data.notaDescuento })
      .where('id = :ventaId', { ventaId })
      .execute();

    result.modificado = true;
    return result;
  }

  /**
   * Pagina las ventas para movil
   * @param options opciones de paginacion de los registros
   */
  async paginateMovil(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .leftJoin('venta.medico', 'medico')
      .select([
        'venta',
        'cliente',
        'paciente',
        'medico',
        'sucursal.id',
        'sucursal.nombre',
      ]);
    forIn(options.filters, (value, key) => {
      if (key === 'cliente' && value) {
        dataQuery.andWhere('( cliente.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      } else if (key === 'folio' && value) {
        dataQuery.andWhere('( venta.folio LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'venta.fecha';
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

  async getPdfUrl(uuid: string): Promise<string> {
    //obtener la venta
    const venta = await getRepository(VentaEntity).findOne({ where: { uuid } });

    //verificar si ya tiene pd
    if (!venta) {
      throw new HttpException('La venta no existe', HttpStatus.NOT_FOUND);
    }

    if (!venta.estudioPx) {
      throw new HttpException(
        'La venta aún no cuenta con resultados.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return venta.folioPxLab;
  }

  /**
   * Obtener una venta por su foliopx y codigo de acceso
   *
   * @param folioPxLab foliopx de la venta
   * @param acceso clave de acceso de la venta
   * @returns
   */
  getByFolioAcceso(folio: string, acceso: string) {
    return getRepository(VentaEntity).findOne({ where: { acceso, folio } });
  }

  async paginateSeguimientoVenta(
    user: LoginIdentityDTO,
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.sucursal', 'sucursal')
      .select([
        'venta',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'sucursal.id',
        'sucursal.nombre',
      ]);
    if (user && user.sucursal && user.sucursal.id) {
      dataQuery.where('sucursal.id =:id', { id: user.sucursal.id });
    } else if (user.profile === ProfileTypes.SYSADMIN) {
      //TODO: si es el admin, darle de todas las sucursales activas.
      dataQuery.where('sucursal.active = :activas', { activas: true });
    }

    forIn(options.filters, (value, key) => {
      if (key === 'paciente') {
        dataQuery.andWhere('paciente.id = :value', {
          value,
        });
      }
      if (key === 'fecha') {
        const fecha = value.split('*');
        const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
        const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
        dataQuery.andWhere('fecha BETWEEN :inicio AND :fin', {
          inicio: inicio,
          fin: fin,
        });
      }
      if (key === 'pagado') {
        dataQuery.andWhere('( venta.pagado = :term )', {
          term: value,
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

  async getMaquiladoresVendedoresCaptadores(): Promise<{
    maquiladores: Partial<UsersEntity>[];
    vendedores: Partial<UsersEntity>[];
    captadores: Partial<UsersEntity>[];
  }> {
    const fields = [
      'id',
      'uuid',
      'firstName',
      'lastName',
      'profile',
      'tipoEmpleado',
      'comisionVendedor',
    ];
    const usuarios = await getRepository(UsersEntity)
      .createQueryBuilder('u')
      .where('u.profile = :uProfile', { uProfile: ProfileTypes.EMPLEADO })
      .andWhere('u.tipoEmpleado != :general', {
        general: PerfilTipoEmpleado.GENERAL,
      })
      .getMany();

    const agrupados = groupBy(usuarios, 'tipoEmpleado');

    return {
      maquiladores:
        agrupados[PerfilTipoEmpleado.MAQUILADOR]?.map((r) => pick(r, fields)) ||
        [],
      vendedores:
        agrupados[PerfilTipoEmpleado.VENDEDOR]?.map((r) => pick(r, fields)) ||
        [],
      captadores:
        agrupados[PerfilTipoEmpleado.CAPTADOR]?.map((r) => pick(r, fields)) ||
        [],
    };
  }
}
