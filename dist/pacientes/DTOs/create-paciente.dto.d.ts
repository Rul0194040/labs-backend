import { SexoPaciente } from '../sexoPaciente.enum';
export declare class CreatePacienteDTO {
    cliente?: number;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    fechaNac: Date;
    email: string;
    nombre: string;
    sexo?: SexoPaciente;
}
