import { InfoPagosDTO } from './info-pagos.dto';
export declare class AgregarPago {
    ventaId: number;
    descuento: number;
    descuentoPesos: number;
    pagos: InfoPagosDTO[];
    fechaHora: Date;
    fechaUltimaRegla?: Date;
    observaciones?: string;
    diagnostico?: string;
}
