import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class CreateCompraDTO {
  // EstatusCompra por defaul debe ser BORRADOR

  @ApiProperty()
  @IsOptional()
  presupuestoId: number;

  @ApiProperty()
  proveedorId: number;

  @ApiProperty()
  @IsOptional()
  fecha: Date;

  @ApiProperty()
  @IsOptional()
  descuento: number;

  @ApiProperty()
  total: number;
}
