import { ApiProperty } from '@nestjs/swagger';
import { TiposMovimientoCajaStatus } from '../../common/enum/tipoMovimientosCajaStatus.enum';
export class CambiarStatusMovimientoDTO {
  @ApiProperty({
    description: 'Razon de la cancelación',
  })
  motivoCancelacion: string;

  @ApiProperty({
    description: 'Tipo de movimiento',
  })
  tipoMovimiento: TiposMovimientoCajaStatus;
}
