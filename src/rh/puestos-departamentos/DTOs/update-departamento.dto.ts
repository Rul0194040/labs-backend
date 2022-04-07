import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartamentoDTO {
  @ApiProperty()
  nombre: string;
}
