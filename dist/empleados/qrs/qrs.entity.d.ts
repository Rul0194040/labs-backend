import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class QrsEntity extends CommonEntity {
    entrada: QrsEntity;
    entradaId: number;
    sucursal: SucursalEntity;
    sucursalId: number;
    empleado: UsersEntity;
    empleadoId: number;
    fechaHora: Date;
    lat: string;
    lng: string;
}
