import { VentaEntity } from './../ventas.entity';
import { PagoEntity } from './../../pagos/pagos.entity';
import { DetalleVentasEntity } from './../ventasDetalle.entity';
export declare class InformeFolioDTO {
    venta: VentaEntity;
    detalle: DetalleVentasEntity[];
    pagos: PagoEntity[];
}
