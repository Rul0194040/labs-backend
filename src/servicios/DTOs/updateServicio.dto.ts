import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateServicioDTO {
  @ApiProperty()
  clave: string;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  precio: number;
  @ApiProperty()
  @IsOptional()
  precio2: number;
  @ApiProperty()
  @IsOptional()
  precio3: number;
  @ApiProperty()
  realizaEstudioEn: string;
  @ApiProperty()
  recomendaciones?: string;
  @ApiProperty()
  @IsOptional()
  muestrasRequeridas?: number;

  @ApiProperty()
  @IsOptional()
  sinonimo1?: string;

  @ApiProperty()
  @IsOptional()
  sinonimo2?: string;
  @ApiProperty()
  @IsOptional()
  precioMaquila?: number;
}
