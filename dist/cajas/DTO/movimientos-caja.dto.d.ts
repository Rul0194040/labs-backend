import { TiposMovimientoCaja } from './../../common/enum/tiposMovimientoCaja.enum';
export declare class MovimientosCajaDTO {
    monto: number;
    movimiento?: TiposMovimientoCaja;
    notas?: string;
}
