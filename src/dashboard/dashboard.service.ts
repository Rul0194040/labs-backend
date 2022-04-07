import { SucursalEntity } from './../sucursales/sucursal.entity';
import { ServicioEntity } from './../servicios/servicio.entity';
import { InsumoEntity } from './../insumos/insumo.entity';
import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataResultDTO } from './DTOss/get-data-result.dto';
import { UsersEntity } from '../users/users.entity';
import { ProfileTypes } from '../users/profiles.enum';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { ProveedorEntity } from '../catalogos/proveedores/proveedores.entity';
import { SucursalesInsumosEntity } from '../sucursales/sucursalesInsumos.entity';
import { MovimientosAlmacenEntity } from '../almacen/movimientosAlmacen.entity';
import { TiposMovimiento } from '../almacen/tiposMovimiento.enum';
import { EstatusMovimiento } from '../almacen/estatusMovimiento.enum';
import { CompraEntity } from '../compras/compras.entity';
import { EstatusCompra } from '../compras/EstatusCompra.enum';
import { PresupuestoEntity } from '../presupuestos/presupuesto.entity';
import { EstatusPresupuesto } from '../presupuestos/EstatusPresupuesto.enum';
import { ClienteEntity } from '../clientes/clientes.entity';
import { PacienteEntity } from '../pacientes/pacientes.entity';
import * as moment from 'moment';

@Injectable()
export class DashboardService {
  /**
   * Obtener el dashboard dependiendo el perfil
   *
   * @param user usuario para determinar el perfil
   * @returns {DataResultDTO} dashboard
   */
  async getData(user: LoginIdentityDTO): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO;

    switch (user.profile) {
      case ProfileTypes.COMPRAS:
        dashboardData = await this.dashboardCompras();
        break;

      case ProfileTypes.ALMACEN_GENERAL:
        dashboardData = await this.dashboardAlmacen();
        break;

      case ProfileTypes.SUCURSAL:
        dashboardData = await this.dashboardSucursal(user);
        break;

      case ProfileTypes.VENTAS:
        dashboardData = await this.dashboardVentas();
        break;

      case ProfileTypes.TESORERO_SUCURSALES_CENTRALES ||
        ProfileTypes.TESORERO_SUCURSALES_FORANEAS:
        dashboardData = await this.dashboardTesorero();
        break;

      default:
        dashboardData = await this.dashboardAdmin();
    }

    return dashboardData;
  }

  /**
   * Dashboard de admin
   */
  async dashboardAdmin(): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const Totalinsumo = await getRepository(InsumoEntity)
      .createQueryBuilder()
      .getCount();

    const Totalservicio = await getRepository(ServicioEntity)
      .createQueryBuilder()
      .getCount();

    const Totalsucursal = await getRepository(SucursalEntity)
      .createQueryBuilder()
      .getCount();

    const TotalUsuarios = await getRepository(UsersEntity)
      .createQueryBuilder()
      .where('profile !=:profile', { profile: ProfileTypes.SUPER })
      .getCount();

    const TotalVentas = await getRepository(VentaEntity)
      .createQueryBuilder()
      .getCount();

    dashboardData = {
      insumos: Totalinsumo,
      servicios: Totalservicio,
      sucursales: Totalsucursal,
      usuarios: TotalUsuarios,
      ventas: TotalVentas,
    };

    return dashboardData;
  }

  /**
   * Dashboard de compras
   */
  async dashboardCompras(): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const minimosSucursal = await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder()
      .where('existencia <= minimo AND existencia > 0')
      .getCount();

    const cantidadProveedores = await getRepository(ProveedorEntity)
      .createQueryBuilder()
      .getCount();

    const minimosMatriz = await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder('sucIns')
      .leftJoin('sucIns.sucursal', 'sucursal')
      .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
      .andWhere('sucIns.existencia <= sucIns.minimo AND sucIns.existencia > 0')
      .getCount();

    const ordenesCompras = await getRepository(CompraEntity)
      .createQueryBuilder()
      .where('estatus = :estatusCompra', {
        estatusCompra: EstatusCompra.SOLICITADO,
      })
      .getCount();

    const presupuestos = await getRepository(PresupuestoEntity)
      .createQueryBuilder()
      .where('estatus = :estatusPresupuesto', {
        estatusPresupuesto: EstatusPresupuesto.GENERADO,
      })
      .getCount();

    dashboardData = {
      minimosSucursal,
      cantidadProveedores,
      minimosMatriz,
      ordenesCompras,
      presupuestos,
    };

    return dashboardData;
  }

  /**
   * Dashboard de almacen general
   */
  async dashboardAlmacen(): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const requisicionesMatriz = await getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientos')
      .leftJoin('movimientos.sucursalDestino', 'sucursalDestino')
      .where('sucursalDestino.esMatriz = :esMatriz', { esMatriz: true })
      .andWhere('movimientos.tipoMovimiento = :mov', {
        mov: TiposMovimiento.REQUISICION,
      })
      .getCount();

    const minimosMatriz = await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder('sucIns')
      .leftJoin('sucIns.sucursal', 'sucursal')
      .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
      .andWhere('sucIns.existencia <= sucIns.minimo AND sucIns.existencia > 0')
      .getCount();

    const sucursales = await getRepository(SucursalEntity)
      .createQueryBuilder()
      .getCount();

    const movimientosTransito = await getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientos')
      .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
      .where('sucursalOrigen.esMatriz = :esMatriz', { esMatriz: true })
      .andWhere('movimientos.estatus = :estatus', {
        estatus: EstatusMovimiento.TRANSITO,
      })
      .getCount();

    dashboardData = {
      requisicionesMatriz,
      minimosMatriz,
      movimientosTransito,
      sucursales,
    };

    return dashboardData;
  }

  /**
   * Dashboard de sucursal
   */
  async dashboardSucursal(user: LoginIdentityDTO): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const requisicionesPedidas = await getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientos')
      .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
      .where('sucursalOrigen.id = :sucursalId', {
        sucursalId: user.sucursal.id,
      })
      .andWhere('movimientos.tipoMovimiento = :tipoMov', {
        tipoMov: TiposMovimiento.REQUISICION,
      })
      .getCount();

    const transferenciasRecibidas = await getRepository(
      MovimientosAlmacenEntity,
    )
      .createQueryBuilder('movimientos')
      .leftJoin('movimientos.sucursalDestino', 'sucursalDestino')
      .where('sucursalDestino.id = :sucursalId', {
        sucursalId: user.sucursal.id,
      })
      .andWhere('movimientos.tipoMovimiento = :tipoMov', {
        tipoMov: TiposMovimiento.TRANSFERENCIA,
      })
      .andWhere('movimientos.estatus = :estatusMov', {
        estatusMov: EstatusMovimiento.FINALIZADO,
      })
      .getCount();

    const altas = await getRepository(MovimientosAlmacenEntity)
      .createQueryBuilder('movimientos')
      .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
      .where('sucursalOrigen.id = :sucursalId', {
        sucursalId: user.sucursal.id,
      })
      .andWhere('movimientos.tipoMovimiento = :tipoMov', {
        tipoMov: TiposMovimiento.ALTA,
      })
      .getCount();

    const insumosSucursal = await getRepository(SucursalesInsumosEntity)
      .createQueryBuilder('sucIns')
      .leftJoin('sucIns.sucursal', 'sucursal')
      .where('sucursal.id = :sucursalId', { sucursalId: user.sucursal.id })
      .getCount();

    dashboardData = {
      requisicionesPedidas,
      transferenciasRecibidas,
      altas,
      insumosSucursal,
    };

    return dashboardData;
  }

  /**
   * Dashboard de ventas
   */
  async dashboardVentas(): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const ventas = await getRepository(VentaEntity)
      .createQueryBuilder()
      .getCount();

    const clientes = await getRepository(ClienteEntity)
      .createQueryBuilder()
      .getCount();

    const pacientes = await getRepository(PacienteEntity)
      .createQueryBuilder()
      .getCount();

    dashboardData = {
      clientes,
      pacientes,
      ventas,
    };

    return dashboardData;
  }

  /**
   * Dashboard de ventas
   */
  async dashboardTesorero(): Promise<DataResultDTO> {
    let dashboardData: DataResultDTO = {};

    const currentDate = new Date();

    const queryVentasExcedidas = await getRepository(VentaEntity)
      .createQueryBuilder()
      .where('credito = :credito', { credito: true })
      .andWhere('pagado = :pagado', { pagado: false })
      .getMany();

    const ventasExcedidas = [];

    queryVentasExcedidas.forEach((venta) => {
      const fechaVenta = moment(venta.fecha);
      const fechaActual = moment(currentDate);
      const diferenciaDias = fechaActual.diff(fechaVenta, 'days');
      if (diferenciaDias > venta.diasCredito) ventasExcedidas.push(venta);
    });

    dashboardData = {
      ventasExcedidas: ventasExcedidas.length,
    };

    return dashboardData;
  }
}
