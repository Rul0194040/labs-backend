import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
export declare class MuestraEntity extends CommonEntity {
    ventaDetalle: DetalleVentasEntity;
    ventaDetalleId: number;
    usuario: UsersEntity;
    usuarioId: number;
    notas: string;
}
