import { ApiProperty } from '@nestjs/swagger';
/**
 * Modificar el captador de una venta(solo en estatus borrador)
 */
export class MaquiladorVentaDTO {
  @ApiProperty()
  maquiladorId: number;
  @ApiProperty()
  ventaId: number;
}
