import { CommonEntity } from '../common/commonEntity.abstract';
export declare class EmpleadoEntity extends CommonEntity {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    curp: number;
    fecha: Date;
    tipoSanguineo: string;
}
