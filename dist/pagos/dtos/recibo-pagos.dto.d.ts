import { PagoEntity } from '../pagos.entity';
import { VentaEntity } from '../../ventas/ventas.entity';
import { DetalleVentasEntity } from '../../ventas/ventasDetalle.entity';
export declare class ReciboPagosDTO {
    venta: VentaEntity;
    detalle: DetalleVentasEntity[];
    pagos: PagoEntity[];
    sucursal: {
        direccion: string;
        telefono: string;
        nombre: string;
    };
    cajero: string;
    fechaVenta: string;
    totalAbonoVenta: string;
    totalAbono: number;
}
