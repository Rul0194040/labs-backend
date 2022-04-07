import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class UpdatePresupuestoDTO {
  // presupuestoId se pasa en la url del api
  @ApiProperty()
  @IsOptional()
  insumoId: number;

  @ApiProperty()
  tipoUnidadId: number;

  @ApiProperty()
  proveedor1Id: number;

  @ApiProperty()
  @IsOptional()
  proveedor2Id: number;

  @ApiProperty()
  @IsOptional()
  proveedor3Id: number;

  @ApiProperty()
  precio1: number;

  @ApiProperty()
  @IsOptional()
  descuento1: number;

  @ApiProperty()
  @IsOptional()
  precio2: number;

  @ApiProperty()
  @IsOptional()
  descuento2: number;

  @ApiProperty()
  @IsOptional()
  precio3: number;

  @ApiProperty()
  @IsOptional()
  descuent3: number;

  @ApiProperty()
  proveedorSeleccionadoId: number;

  @ApiProperty()
  precioSeleccionado: number;

  @ApiProperty()
  fechaPromesa: Date;

  @ApiProperty()
  cantidad: number;
}
