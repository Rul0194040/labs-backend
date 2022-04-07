"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const sucursal_entity_1 = require("./../sucursales/sucursal.entity");
const servicio_entity_1 = require("./../servicios/servicio.entity");
const insumo_entity_1 = require("./../insumos/insumo.entity");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../users/users.entity");
const profiles_enum_1 = require("../users/profiles.enum");
const ventas_entity_1 = require("../ventas/ventas.entity");
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const sucursalesInsumos_entity_1 = require("../sucursales/sucursalesInsumos.entity");
const movimientosAlmacen_entity_1 = require("../almacen/movimientosAlmacen.entity");
const tiposMovimiento_enum_1 = require("../almacen/tiposMovimiento.enum");
const estatusMovimiento_enum_1 = require("../almacen/estatusMovimiento.enum");
const compras_entity_1 = require("../compras/compras.entity");
const EstatusCompra_enum_1 = require("../compras/EstatusCompra.enum");
const presupuesto_entity_1 = require("../presupuestos/presupuesto.entity");
const EstatusPresupuesto_enum_1 = require("../presupuestos/EstatusPresupuesto.enum");
const clientes_entity_1 = require("../clientes/clientes.entity");
const pacientes_entity_1 = require("../pacientes/pacientes.entity");
const moment = require("moment");
let DashboardService = class DashboardService {
    async getData(user) {
        let dashboardData;
        switch (user.profile) {
            case profiles_enum_1.ProfileTypes.COMPRAS:
                dashboardData = await this.dashboardCompras();
                break;
            case profiles_enum_1.ProfileTypes.ALMACEN_GENERAL:
                dashboardData = await this.dashboardAlmacen();
                break;
            case profiles_enum_1.ProfileTypes.SUCURSAL:
                dashboardData = await this.dashboardSucursal(user);
                break;
            case profiles_enum_1.ProfileTypes.VENTAS:
                dashboardData = await this.dashboardVentas();
                break;
            case profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES ||
                profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS:
                dashboardData = await this.dashboardTesorero();
                break;
            default:
                dashboardData = await this.dashboardAdmin();
        }
        return dashboardData;
    }
    async dashboardAdmin() {
        let dashboardData = {};
        const Totalinsumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .getCount();
        const Totalservicio = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder()
            .getCount();
        const Totalsucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder()
            .getCount();
        const TotalUsuarios = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .where('profile !=:profile', { profile: profiles_enum_1.ProfileTypes.SUPER })
            .getCount();
        const TotalVentas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
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
    async dashboardCompras() {
        let dashboardData = {};
        const minimosSucursal = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder()
            .where('existencia <= minimo AND existencia > 0')
            .getCount();
        const cantidadProveedores = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity)
            .createQueryBuilder()
            .getCount();
        const minimosMatriz = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
            .andWhere('sucIns.existencia <= sucIns.minimo AND sucIns.existencia > 0')
            .getCount();
        const ordenesCompras = await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder()
            .where('estatus = :estatusCompra', {
            estatusCompra: EstatusCompra_enum_1.EstatusCompra.SOLICITADO,
        })
            .getCount();
        const presupuestos = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity)
            .createQueryBuilder()
            .where('estatus = :estatusPresupuesto', {
            estatusPresupuesto: EstatusPresupuesto_enum_1.EstatusPresupuesto.GENERADO,
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
    async dashboardAlmacen() {
        let dashboardData = {};
        const requisicionesMatriz = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientos')
            .leftJoin('movimientos.sucursalDestino', 'sucursalDestino')
            .where('sucursalDestino.esMatriz = :esMatriz', { esMatriz: true })
            .andWhere('movimientos.tipoMovimiento = :mov', {
            mov: tiposMovimiento_enum_1.TiposMovimiento.REQUISICION,
        })
            .getCount();
        const minimosMatriz = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIns')
            .leftJoin('sucIns.sucursal', 'sucursal')
            .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
            .andWhere('sucIns.existencia <= sucIns.minimo AND sucIns.existencia > 0')
            .getCount();
        const sucursales = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder()
            .getCount();
        const movimientosTransito = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientos')
            .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
            .where('sucursalOrigen.esMatriz = :esMatriz', { esMatriz: true })
            .andWhere('movimientos.estatus = :estatus', {
            estatus: estatusMovimiento_enum_1.EstatusMovimiento.TRANSITO,
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
    async dashboardSucursal(user) {
        let dashboardData = {};
        const requisicionesPedidas = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientos')
            .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
            .where('sucursalOrigen.id = :sucursalId', {
            sucursalId: user.sucursal.id,
        })
            .andWhere('movimientos.tipoMovimiento = :tipoMov', {
            tipoMov: tiposMovimiento_enum_1.TiposMovimiento.REQUISICION,
        })
            .getCount();
        const transferenciasRecibidas = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientos')
            .leftJoin('movimientos.sucursalDestino', 'sucursalDestino')
            .where('sucursalDestino.id = :sucursalId', {
            sucursalId: user.sucursal.id,
        })
            .andWhere('movimientos.tipoMovimiento = :tipoMov', {
            tipoMov: tiposMovimiento_enum_1.TiposMovimiento.TRANSFERENCIA,
        })
            .andWhere('movimientos.estatus = :estatusMov', {
            estatusMov: estatusMovimiento_enum_1.EstatusMovimiento.FINALIZADO,
        })
            .getCount();
        const altas = await typeorm_1.getRepository(movimientosAlmacen_entity_1.MovimientosAlmacenEntity)
            .createQueryBuilder('movimientos')
            .leftJoin('movimientos.sucursalOrigen', 'sucursalOrigen')
            .where('sucursalOrigen.id = :sucursalId', {
            sucursalId: user.sucursal.id,
        })
            .andWhere('movimientos.tipoMovimiento = :tipoMov', {
            tipoMov: tiposMovimiento_enum_1.TiposMovimiento.ALTA,
        })
            .getCount();
        const insumosSucursal = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
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
    async dashboardVentas() {
        let dashboardData = {};
        const ventas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .getCount();
        const clientes = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity)
            .createQueryBuilder()
            .getCount();
        const pacientes = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity)
            .createQueryBuilder()
            .getCount();
        dashboardData = {
            clientes,
            pacientes,
            ventas,
        };
        return dashboardData;
    }
    async dashboardTesorero() {
        let dashboardData = {};
        const currentDate = new Date();
        const queryVentasExcedidas = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .where('credito = :credito', { credito: true })
            .andWhere('pagado = :pagado', { pagado: false })
            .getMany();
        const ventasExcedidas = [];
        queryVentasExcedidas.forEach((venta) => {
            const fechaVenta = moment(venta.fecha);
            const fechaActual = moment(currentDate);
            const diferenciaDias = fechaActual.diff(fechaVenta, 'days');
            if (diferenciaDias > venta.diasCredito)
                ventasExcedidas.push(venta);
        });
        dashboardData = {
            ventasExcedidas: ventasExcedidas.length,
        };
        return dashboardData;
    }
};
DashboardService = __decorate([
    common_1.Injectable()
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map