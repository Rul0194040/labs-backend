import { PerfilTipoEmpleado } from './../../users/profiles.enum';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
export declare class CreateEmpleadoDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    puesto: PuestoEntity;
    puestoId: number;
    fechaNac?: Date;
    curp?: string;
    profile: ProfileTypes;
    tipoEmpleado: PerfilTipoEmpleado;
}
