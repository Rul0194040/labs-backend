import { ApiProperty } from '@nestjs/swagger';
/**
 * Modificar el cliente de una venta(solo en estatus borrador)
 */
export class PacienteVentaDTO {
  @ApiProperty()
  pacienteId: number;
  @ApiProperty()
  ventaId: number;
}
