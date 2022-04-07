import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateServicioDTO {
  @ApiProperty()
  clave: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  precio: number;

  @ApiProperty()
  precio2: number;

  @ApiProperty()
  precio3: number;

  @ApiProperty()
  precioMaquila: number;

  @ApiProperty()
  realizaEstudioEn: string;

  @ApiProperty()
  @IsOptional()
  recomendaciones?: string;

  @ApiProperty()
  @IsOptional()
  muestrasRequeridas?: number;
}
