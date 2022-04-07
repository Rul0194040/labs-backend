import { ApiProperty } from '@nestjs/swagger';

export class CreateBancoDto {
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  telefono: string;
}
