import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
export class UpdateDireccionDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pacienteId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clienteId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contribuyente: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rfc: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  calle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numInt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numExt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  colonia: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cp: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  estado: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  municipio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pais: string;
}
