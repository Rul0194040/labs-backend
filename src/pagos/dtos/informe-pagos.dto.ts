import { ApiProperty } from '@nestjs/swagger';
import { VentaEntity } from '../../ventas/ventas.entity';
import { PagoEntity } from '../pagos.entity';
export class InformePagosDTO {
  @ApiProperty()
  venta: VentaEntity;

  @ApiProperty()
  pagos: PagoEntity[];

  @ApiProperty()
  pagosNuevos: PagoEntity[];
}
