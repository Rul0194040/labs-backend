import { VentaEntity } from './../ventas.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DetalleVentasEntity } from '../ventasDetalle.entity';

export class CreateInformeVentaDTO {
  @ApiProperty()
  venta: VentaEntity;
  @ApiProperty()
  detalle: DetalleVentasEntity;
}
