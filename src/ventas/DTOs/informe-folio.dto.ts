import { VentaEntity } from './../ventas.entity';
import { PagoEntity } from './../../pagos/pagos.entity';
import { DetalleVentasEntity } from './../ventasDetalle.entity';
import { ApiProperty } from '@nestjs/swagger';
export class InformeFolioDTO {
  @ApiProperty({
    description: 'venta referida al folio',
  })
  venta: VentaEntity;

  @ApiProperty({
    description: 'detalle de la venta referido al folio',
  })
  detalle: DetalleVentasEntity[];

  @ApiProperty({
    description: 'pagos referidos al folio',
  })
  pagos: PagoEntity[];
}
