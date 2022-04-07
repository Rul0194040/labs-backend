import { ApiProperty } from '@nestjs/swagger';
import { VentaEntity } from '../ventas.entity';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
import { PagoEntity } from '../../pagos/pagos.entity';
/**
 * Obtener la información de una venta y sus servicios
 */
export class TicketVentaDTO {
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
    direccion: {
      calle: string;
      numExt: string;
      colonia: string;
      municipio: string;
      cp: number;
    };
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
  totalVentaLetra: string;
}
