import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { IncidenciaEntity } from './incidencias.entity';
export declare class IncidenciaEmpleadoEntity extends CommonEntity {
    incidencia: IncidenciaEntity;
    empleado: UsersEntity;
    montoDescuento: number;
    fecha: Date;
    usuario: UsersEntity;
    observaciones: string;
}
