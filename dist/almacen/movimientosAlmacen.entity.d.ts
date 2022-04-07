import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { DetalleMovimientosEntity } from './detalleMovimientos.entity';
import { EstatusMovimiento } from './estatusMovimiento.enum';
import { TiposMovimiento } from './tiposMovimiento.enum';
export declare class MovimientosAlmacenEntity extends CommonEntity {
    sucursalOrigen: SucursalEntity;
    sucursalOrigenId?: number;
    sucursalDestino: SucursalEntity;
    sucursalDestinoId?: number;
    tipoMovimiento: TiposMovimiento;
    usuario: UsersEntity;
    usuarioId: number;
    detalle: DetalleMovimientosEntity;
    estatus: EstatusMovimiento;
    fecha: Date;
    notas: string;
}
