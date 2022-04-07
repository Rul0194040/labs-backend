import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateDireccionDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pacienteId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clienteId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contribuyente: string;

  @ApiProperty()
  @IsString()
  rfc: string;

  @ApiProperty()
  @IsString()
  calle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numInt: string;

  @ApiProperty()
  @IsString()
  numExt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  colonia: string;

  @ApiProperty()
  @IsString()
  cp: string;

  @ApiProperty()
  @IsString()
  estado: string;

  @ApiProperty()
  @IsString()
  municipio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pais: string;
}
