import { VentaEntity } from '../ventas.entity';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
import { PagoEntity } from '../../pagos/pagos.entity';
export declare class TicketVentaDTO {
    venta: VentaEntity;
    detalle: DetalleVentasEntity[];
    pagos: PagoEntity[];
    sucursal: {
        direccion: {
            calle: string;
            numExt: string;
            colonia: string;
            municipio: string;
            cp: number;
        };
        telefono: string;
        nombre: string;
    };
    cajero: string;
    fechaVenta: string;
    totalVentaLetra: string;
}
