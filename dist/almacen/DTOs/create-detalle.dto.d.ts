import { InsumoEntity } from './../../insumos/insumo.entity';
import { MovimientosAlmacenEntity } from './../movimientosAlmacen.entity';
export declare class CreateDetalleDTO {
    movimientoAlmacen: MovimientosAlmacenEntity;
    insumo: InsumoEntity;
    cantidad: number;
}
