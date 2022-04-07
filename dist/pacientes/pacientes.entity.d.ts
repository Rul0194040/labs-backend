import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SexoPaciente } from './sexoPaciente.enum';
import { UsersEntity } from '../users/users.entity';
export declare class PacienteEntity extends CommonEntity {
    cliente: ClienteEntity;
    clienteId?: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    descripcion: string;
    fechaNacimiento: Date;
    fechaNac: Date;
    sexo: SexoPaciente;
    usuario: UsersEntity;
    usuarioId: number;
}
