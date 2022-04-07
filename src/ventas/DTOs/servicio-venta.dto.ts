import { ApiProperty } from '@nestjs/swagger';
/**
 * Para agregar un servicio(detalle) a una venta(debe estar en estatus borrador)
 */
export class ServicioVentaDTO {
  @ApiProperty()
  servicioId: number;
}
