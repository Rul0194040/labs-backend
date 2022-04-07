import { ServicioVentaDTO } from './servicio-venta.dto';
export declare class AsignDetalleDTO {
    ventaId: number;
    servicio: ServicioVentaDTO;
    medico: string;
    recomendaciones: string;
    precio: number;
    descuento: number;
}
