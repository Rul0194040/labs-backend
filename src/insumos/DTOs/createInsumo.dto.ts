import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
/**
 * @ignore
 */
export class CreateInsumoDTO {
  @ApiProperty({
    description: 'Nombre del insumo',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'El tipo de insumo al que pertenece',
  })
  tipoInsumo: number;

  @ApiProperty({
    description: 'codigo de barras',
  })
  @IsOptional()
  codigo: string;

  @ApiProperty({
    description: 'el tipo de unidad que posee el insumo',
  })
  tipoUnidad: number;

  @ApiProperty({
    description: 'Si descuenta en LABORATORIO, SUCURSAL O MATRIZ',
  })
  descuentaEn?: string;

  @ApiProperty()
  clave?: string;
}
