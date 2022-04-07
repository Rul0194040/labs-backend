import { ApiProperty } from '@nestjs/swagger';
/**
 * Para agregar un servicio(detalle) a una venta(debe estar en estatus borrador)
 */
export class TransaccionDTO {
  @ApiProperty()
  efectivoRecibido: number;

  @ApiProperty()
  cambio: number;
}
