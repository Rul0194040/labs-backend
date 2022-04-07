import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class DetalleCompraDTO {
  @ApiProperty()
  insumoId: number;

  @ApiProperty()
  tipoUnidadId: number;

  @ApiProperty()
  @IsOptional()
  compraId: number;

  @ApiProperty()
  @IsOptional()
  descuento?: number;

  @ApiProperty()
  cantidad: number;

  @ApiProperty()
  precio: number;
}
