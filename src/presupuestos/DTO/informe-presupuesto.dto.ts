import { PresupuestoDetalleEntity } from './../presupuestosDetalle.entity';
import { PresupuestoEntity } from '@sanfrancisco/presupuestos/presupuesto.entity';
import { ApiProperty } from '@nestjs/swagger';

export class InformePresupuestoDTO {
  @ApiProperty()
  presupuesto: PresupuestoEntity;
  @ApiProperty()
  detalle: PresupuestoDetalleEntity[];
}
