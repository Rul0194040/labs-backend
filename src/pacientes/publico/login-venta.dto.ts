import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class LoginVentaDTO {
  @ApiProperty()
  @MinLength(9)
  @MaxLength(9)
  folio: string; //venta.folio

  @ApiProperty()
  @MinLength(8)
  @MaxLength(8)
  acceso: string;
}
