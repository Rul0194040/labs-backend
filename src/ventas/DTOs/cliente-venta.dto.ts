import { ApiProperty } from '@nestjs/swagger';
/**
 * Modificar el cliente de una venta(solo en estatus borrador)
 */
export class ClienteVentaDTO {
  @ApiProperty()
  clienteId: number;
  @ApiProperty()
  ventaId: number;
}
