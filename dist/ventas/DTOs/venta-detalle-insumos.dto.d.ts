import { MuestraEntity } from './../muestras/muestras.entity';
import { ServicioEntity } from '../../servicios/servicio.entity';
import { VentaEntity } from '../ventas.entity';
import { DetalleVentasInsumosEntity } from '../ventasDetalleInsumos.entity';
export declare class VentaDetalleInsumosDTO {
    venta: VentaEntity;
    ventaId: number;
    servicio: ServicioEntity;
    servicioId: number;
    descuento: number;
    precio: number;
    cerrado: boolean;
    estudios: boolean;
    medico?: string;
    recomendaciones?: string;
    insumos?: DetalleVentasInsumosEntity[];
    muestras?: MuestraEntity[];
}
