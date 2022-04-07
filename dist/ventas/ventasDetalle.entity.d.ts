import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { ServicioEntity } from '@sanfrancisco/servicios/servicio.entity';
import { VentaEntity } from './ventas.entity';
export declare class DetalleVentasEntity extends CommonEntity {
    venta: VentaEntity;
    ventaId: number;
    servicio: ServicioEntity;
    servicioId: number;
    descuento: number;
    precio: number;
    cerrado: boolean;
    estudios: boolean;
    medico: string;
    recomendaciones: string;
}
