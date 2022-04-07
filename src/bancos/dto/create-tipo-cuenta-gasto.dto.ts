import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoCuentaGastoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  clave: string;

  @ApiProperty()
  parentId?: number;
}
