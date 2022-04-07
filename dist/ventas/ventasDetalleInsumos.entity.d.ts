import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { DetalleVentasEntity } from './ventasDetalle.entity';
import { SucursalesInsumosEntity } from '@sanfrancisco/sucursales/sucursalesInsumos.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
export declare class DetalleVentasInsumosEntity extends CommonEntity {
    detalleVenta: DetalleVentasEntity;
    detalleVentaId: number;
    insumoSucursal: SucursalesInsumosEntity;
    insumoSucursalId: number;
    usuario: UsersEntity;
    usuarioId: number;
    unidad: TipoUnidadEntity;
    unidadId: number;
    cantidad: number;
    nota: string;
}
