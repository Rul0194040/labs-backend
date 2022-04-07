import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class AltaByCompraDTO {
  // EstatusCompra por defaul debe ser BORRADOR
  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  @IsOptional()
  notas?: string;

  @ApiProperty()
  detalle: AltaByCompraDetalleDTO[];
}

export class AltaByCompraDetalleDTO {
  @ApiProperty()
  cantidad: number;

  @ApiProperty()
  @IsOptional()
  loteId?: number;

  @ApiProperty()
  insumo: number;

  @ApiProperty()
  proveedor: number;
}
