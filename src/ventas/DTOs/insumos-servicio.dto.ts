import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
/**
 * Para agregar un insumo a un servicio de una venta.
 */
export class InsumosServicioDTO {
  @ApiProperty()
  insumoSucursalId: number;

  @ApiProperty()
  unidadId: number;

  @ApiProperty()
  cantidad: number;

  @ApiProperty()
  @IsOptional()
  nota?: string;
}
