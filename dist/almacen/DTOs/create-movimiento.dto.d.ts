import { TiposMovimiento } from './../tiposMovimiento.enum';
export declare class CreateMovimientoDTO {
    id?: number;
    tipoMovimiento: TiposMovimiento;
    sucursalOrigen: number;
    sucursalDestino?: number;
    fecha: Date;
    notas: string;
}
