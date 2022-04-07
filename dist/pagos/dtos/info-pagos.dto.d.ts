import { TiposPago } from '../tipoPagos.enum';
export declare class InfoPagosDTO {
    monto: number;
    tipo: TiposPago;
    referencia: string;
    notas?: string;
    efectivoRecibido?: number;
    cambio?: number;
    cobranza?: boolean;
}
