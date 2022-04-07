import { TiposMovimientoCaja } from './../../common/enum/tiposMovimientoCaja.enum';
import { ApiProperty } from '@nestjs/swagger';
export class MovimientosCajaDTO {
  @ApiProperty({
    description: 'Monto del deposito',
  })
  monto: number;
  @ApiProperty({
    description: 'tipo de movimiento',
  })
  movimiento?: TiposMovimientoCaja;

  @ApiProperty({
    description: 'Notas del deposito',
  })
  notas?: string;
}
