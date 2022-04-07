import { ZonaEnum } from './../../sucursales/zona.enum';
import { TipoPrecio } from '../tipoPrecio.enum';
export declare class CreateVentaDTO {
    pacienteId?: number;
    medicoId?: number;
    zona: ZonaEnum;
    fechaUltimaRegla: Date;
    observaciones: string;
    diagnostico: string;
    tipoPrecio: TipoPrecio;
}
