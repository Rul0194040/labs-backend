import { ApiProperty } from '@nestjs/swagger';

export class CreateServiciosInsumosDTO {
  @ApiProperty({
    description: 'id del insumo',
  })
  insumo: number;

  @ApiProperty({
    description: 'cantidad a descontar',
  })
  cantidad: number;
}
