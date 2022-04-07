import { VentaEntity } from '../../ventas/ventas.entity';
import { PagoEntity } from '../pagos.entity';
export declare class InformePagosDTO {
    venta: VentaEntity;
    pagos: PagoEntity[];
    pagosNuevos: PagoEntity[];
}
