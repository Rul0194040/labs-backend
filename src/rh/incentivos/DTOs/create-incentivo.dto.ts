import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UnidadesDescuento } from '../../unidades-descuento.enum';

export class CreateIncentivoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  cantidad?: number; //cantidad de dias o pesos que vale este incentivo

  @ApiProperty()
  @IsOptional()
  unidad: UnidadesDescuento;
}
