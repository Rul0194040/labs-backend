import { MuestraEntity } from './../muestras/muestras.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ServicioEntity } from '../../servicios/servicio.entity';
import { VentaEntity } from '../ventas.entity';
import { DetalleVentasInsumosEntity } from '../ventasDetalleInsumos.entity';
/**
 * Modificar el cliente de una venta(solo en estatus borrador)
 */
export class VentaDetalleInsumosDTO {
  @ApiProperty()
  venta: VentaEntity;

  @ApiProperty()
  ventaId: number;

  @ApiProperty()
  @IsOptional()
  servicio: ServicioEntity;

  @ApiProperty()
  servicioId: number;

  @ApiProperty()
  descuento: number;

  @ApiProperty()
  precio: number;

  @ApiProperty()
  cerrado: boolean;

  @ApiProperty()
  estudios: boolean;

  @ApiProperty()
  @IsOptional()
  medico?: string;

  @IsOptional()
  @ApiProperty()
  recomendaciones?: string;

  @ApiProperty()
  @IsOptional()
  insumos?: DetalleVentasInsumosEntity[];

  @ApiProperty()
  @IsOptional()
  muestras?: MuestraEntity[];
}
