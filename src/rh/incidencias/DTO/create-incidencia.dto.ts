import { ApiProperty } from '@nestjs/swagger';
import { UnidadesDescuento } from '@sanfrancisco/rh/unidades-descuento.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateIncidenciaDTO {
  @ApiProperty()
  @IsString()
  nombre: string;
  @ApiProperty()
  @IsNumber()
  requeridas: number;
  @ApiProperty()
  @IsNumber()
  descuento: number;
  @ApiProperty()
  @IsEnum(['pesos', 'dias', 'horas', 'variable'])
  unidadDescuento: UnidadesDescuento;
}
