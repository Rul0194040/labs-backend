import { ApiProperty } from '@nestjs/swagger';

export class UpdateSucursalesInsumosDTO {
  @ApiProperty({
    description: 'promedio de insumo por sucursal',
  })
  promedio?: number;

  @ApiProperty({
    description: 'Existencia maxima de insumos por sucursal',
  })
  maximo?: number;

  @ApiProperty({
    description: 'Existencia minima de insumos para activar alarmas',
  })
  minimo?: number;
}
