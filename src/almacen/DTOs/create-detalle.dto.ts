import { InsumoEntity } from './../../insumos/insumo.entity';
import { MovimientosAlmacenEntity } from './../movimientosAlmacen.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleDTO {
  @ApiProperty()
  movimientoAlmacen: MovimientosAlmacenEntity;
  @ApiProperty()
  insumo: InsumoEntity;
  @ApiProperty()
  cantidad: number;
}
