import { ApiProperty } from '@nestjs/swagger';
import { VentaEntity } from '../ventas.entity';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
import { PagoEntity } from '../../pagos/pagos.entity';
/**
 * Obtener la información de una venta y sus servicios
 */
export class VentaServiciosDTO {
  @ApiProperty({
    description: 'venta referida al id',
  })
  venta: VentaEntity;

  @ApiProperty({
    description: 'detalle de la venta referidos a la venta',
  })
  detalle: DetalleVentasEntity[];

  @ApiProperty({
    description: 'pagos referidos al folio',
  })
  pagos: PagoEntity[];
}
