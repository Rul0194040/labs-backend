import { ApiProperty } from '@nestjs/swagger';
export class UpdateInsumoPresupuestoDTO {
  @ApiProperty({
    description: 'insumo a agregar',
  })
  insumo: number;

  @ApiProperty({
    description: 'el tipo de unidad del insumo',
  })
  tipoUnidad: number;

  @ApiProperty({
    description: 'cantidad del insumo',
  })
  cantidad: number;
}
