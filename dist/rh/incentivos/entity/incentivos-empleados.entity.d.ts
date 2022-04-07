import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { IncentivoEntity } from './incentivos.entity';
export declare class IncentivoEmpleadoEntity {
    id: number;
    incentivo: IncentivoEntity;
    empleado: UsersEntity;
    fecha: Date;
    montoIncentivo: number;
    usuario: UsersEntity;
    observaciones: string;
}
