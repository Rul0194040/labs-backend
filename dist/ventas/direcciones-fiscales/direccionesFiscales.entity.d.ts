import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { PacienteEntity } from '@sanfrancisco/pacientes/pacientes.entity';
import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';
export declare class DireccionFiscalEntity extends CommonEntity {
    paciente: PacienteEntity;
    pacienteId: number;
    cliente: ClienteEntity;
    clienteId: number;
    contribuyente: string;
    rfc: string;
    calle: string;
    numInt: string;
    numExt: string;
    colonia: string;
    cp: string;
    estado: string;
    municipio: string;
    pais: string;
}
