import { ApiProperty } from '@nestjs/swagger';
import { PagoEntity } from '../pagos.entity';
import { VentaEntity } from '../../ventas/ventas.entity';
import { DetalleVentasEntity } from '../../ventas/ventasDetalle.entity';
/**
 * Obtener la información de una venta y sus servicios
 */
export class ReciboPagosDTO {
  @ApiProperty({
    description: 'venta referida al id',
  })
  venta: VentaEntity;

  @ApiProperty({
    description: 'detalle de la venta referidos a la venta',
  })
  detalle: DetalleVentasEntity[];

  @ApiProperty({
    description: 'listado de pagos referidos a la venta',
  })
  pagos: PagoEntity[];

  @ApiProperty({
    description: 'datos referentes a la sucursal donde se realizó la venta',
  })
  sucursal: {
    direccion: string;
    telefono: string;
    nombre: string;
  };

  @ApiProperty({
    description: 'nombre del cajero',
  })
  cajero: string;

  @ApiProperty({
    description: 'fecha en que se realizó la venta',
  })
  fechaVenta: string;

  @ApiProperty({
    description: 'total de la venta en letra',
  })
  totalAbonoVenta: string;

  @ApiProperty({
    description: 'total del abono a la venta',
  })
  totalAbono: number;
}
