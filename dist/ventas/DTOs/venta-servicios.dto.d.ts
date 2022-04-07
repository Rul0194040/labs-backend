import { VentaEntity } from '../ventas.entity';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
import { PagoEntity } from '../../pagos/pagos.entity';
export declare class VentaServiciosDTO {
    venta: VentaEntity;
    detalle: DetalleVentasEntity[];
    pagos: PagoEntity[];
}
