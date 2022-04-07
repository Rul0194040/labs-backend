import { ApiProperty } from '@nestjs/swagger';

export class CreateLoteDTO {
  @ApiProperty()
  numero?: string;

  @ApiProperty()
  descripcion?: string;

  @ApiProperty()
  caducidad?: Date;
}
