import { ApiProperty } from '@nestjs/swagger';

export class FaltanteDTO {
  @ApiProperty()
  faltante: number;
  @ApiProperty()
  observaciones: string;
}
