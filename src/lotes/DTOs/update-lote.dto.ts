import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoteDTO {
  @ApiProperty()
  descripcion: string;
}
