import { PresupuestoDetalleEntity } from './../presupuestosDetalle.entity';
import { PresupuestoEntity } from '@sanfrancisco/presupuestos/presupuesto.entity';
export declare class InformePresupuestoDTO {
    presupuesto: PresupuestoEntity;
    detalle: PresupuestoDetalleEntity[];
}
