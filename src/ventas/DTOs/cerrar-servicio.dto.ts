import { ApiProperty } from '@nestjs/swagger';
/**
 * Cerrar los insumos de un detalle de venta (ya no se puede capturar mas)
 * La venta debe estar "iniciada".
 */
export class CerrarServicioDTO {
  @ApiProperty()
  ventaDetalleId: number;
}
