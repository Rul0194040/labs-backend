import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
/**
 * @ignore
 */
export class UpdateInsumoDTO {
  @ApiProperty({
    description: 'Nombre del insumo',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del insumo',
  })
  descripcion: string;

  @ApiProperty({
    description: 'codigo de barras',
  })
  @IsOptional()
  codigo: string;

  @ApiProperty({
    description: 'Si descuenta en LABORATORIO, SUCURSAL O MATRIZ',
  })
  descuentaEn?: string;

  @ApiProperty({
    description: 'el tipo de unidad que posee el insumo',
  })
  tipoUnidadId?: number;

  @ApiProperty()
  tipoInsumoId?: number;

  @ApiProperty()
  clave?: string;
}
