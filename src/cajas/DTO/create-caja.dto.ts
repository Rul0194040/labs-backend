import { ApiProperty } from '@nestjs/swagger';
export class CreateCajaDTO {
  @ApiProperty({
    description: 'monto con el que la caja inicia',
  })
  montoApertura: number;

  @ApiProperty({
    description: 'monto con el que la caja inicia',
  })
  notas: string;
}
