import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsDate } from 'class-validator';
/**
 * Como cliente, desde la interfaz web, solicitar la factura de una venta.
 * El cliente debe proporcionar el token de la venta, total, fechaVenta
 */
export class SolicitudFacturaDTO {
  @ApiProperty()
  @IsAlpha()
  tokenVenta: string; //token unico generado para las ventas

  @ApiProperty()
  totalVenta: number;

  @ApiProperty()
  @IsDate()
  fechaVenta: Date;
}
