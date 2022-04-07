import { ApiProperty } from '@nestjs/swagger';
import { ServicioVentaDTO } from './servicio-venta.dto';
import { IsOptional } from 'class-validator';
/**
 * Modificar el cliente de una venta(solo en estatus borrador)
 */
export class AsignDetalleDTO {
  @ApiProperty()
  ventaId: number;

  @ApiProperty()
  servicio: ServicioVentaDTO;

  @ApiProperty()
  @IsOptional()
  medico: string;

  @ApiProperty()
  @IsOptional()
  recomendaciones: string;

  @ApiProperty()
  precio: number;

  @ApiProperty()
  @IsOptional()
  descuento: number;
}
