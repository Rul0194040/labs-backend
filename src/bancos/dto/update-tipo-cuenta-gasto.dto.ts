import { ApiProperty } from '@nestjs/swagger';

export class UpdateTipoCuentaGastoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  clave: string;
}
