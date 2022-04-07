import { TiposConvenios } from '@sanfrancisco/common/enum/tipos-convenios.enum';
export declare class UpdateClienteDTO {
    nombre: string;
    telefono: string;
    tipoPersona: string;
    descripcion?: string;
    fechaNac?: Date;
    email: string;
    tipoConvenio: TiposConvenios;
    codigo?: string;
    descuento?: number;
    diasCredito?: number;
}
