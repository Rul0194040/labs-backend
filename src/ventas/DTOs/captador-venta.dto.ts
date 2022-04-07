import { ApiProperty } from '@nestjs/swagger';
/**
 * Modificar el captador de una venta(solo en estatus borrador)
 */
export class CaptadorVentaDTO {
  @ApiProperty()
  captadorId: number;
  @ApiProperty()
  ventaId: number;
}
