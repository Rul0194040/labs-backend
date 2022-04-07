import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Max, Min } from 'class-validator';
/**
 * @ignore
 */
export class updateUserDTO {
  @ApiProperty()
  @IsOptional()
  firstName: string;
  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  telefono?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  nip?: string;

  @ApiProperty()
  @IsOptional()
  maxDescuento?: number;

  @ApiProperty()
  @Min(0)
  @Max(1)
  comisionVendedor?: number;

  @ApiProperty()
  @IsOptional()
  grabandoRules?: boolean;

  @ApiProperty()
  @IsOptional()
  accesoSistema?: boolean;
}
