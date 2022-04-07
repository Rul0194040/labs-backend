import { TiposMovimiento } from './../tiposMovimiento.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovimientoDTO {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  tipoMovimiento: TiposMovimiento;

  @ApiProperty()
  sucursalOrigen: number;

  @ApiProperty()
  sucursalDestino?: number;

  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  notas: string;
}
