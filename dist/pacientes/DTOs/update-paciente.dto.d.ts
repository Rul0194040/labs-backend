import { SexoPaciente } from '../sexoPaciente.enum';
export declare class UpdatePacienteDTO {
    cliente?: number;
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    email?: string;
    fechaNac: Date;
    telefono?: string;
    descripcion?: string;
    sexo?: SexoPaciente;
}
