import { ApiProperty } from '@nestjs/swagger';
/**
 * Modificar el vendedor de una venta(solo en estatus borrador)
 */
export class VendedorVentaDTO {
  @ApiProperty()
  vendedorId: number;
  @ApiProperty()
  ventaId: number;
}
