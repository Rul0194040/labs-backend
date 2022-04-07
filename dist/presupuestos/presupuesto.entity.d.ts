import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';
export declare class PresupuestoEntity extends CommonEntity {
    usuario: UsersEntity;
    usuarioId: number;
    fecha: Date;
    estatus: EstatusPresupuesto;
    presupuestoDetalle: PresupuestoDetalleEntity;
}
