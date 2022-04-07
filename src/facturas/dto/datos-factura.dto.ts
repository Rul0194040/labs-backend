import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, Matches } from 'class-validator';
/**
 * Como cliente, desde la interfaz web, solicitar la factura de una venta.
 * El cliente debe proporcionar el token de la venta, total, fechaVenta
 */
export class DatosFacturaDTO {
  @ApiProperty()
  contribuyente: string;

  @ApiProperty()
  @IsIn(['F', 'M'])
  persona: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  telefono: string;

  @ApiProperty()
  @Matches(
    /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
  )
  rfc: string;

  @ApiProperty()
  calle: string;

  @ApiProperty()
  numInt: string;

  @ApiProperty()
  @IsOptional()
  numExt: string;

  @ApiProperty()
  @IsOptional()
  colonia: string;

  @ApiProperty()
  cp: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  municipio: string;

  @ApiProperty()
  pais: string;
}
