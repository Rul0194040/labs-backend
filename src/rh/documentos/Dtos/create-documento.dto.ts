import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentoDto {
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  documento: string;
}
