import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovimientoDTO {
  @ApiProperty()
  fecha: Date;
  @ApiProperty()
  notas: string;
}
