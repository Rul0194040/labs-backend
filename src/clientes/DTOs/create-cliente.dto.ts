import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateClienteDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  telefono: string;

  @ApiProperty()
  tipoPersona: string;

  @ApiProperty()
  @IsOptional()
  descripcion?: string;

  @ApiProperty()
  @IsOptional()
  fechaNac?: Date;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  tipoConvenio: string;

  @ApiProperty()
  @IsOptional()
  codigo?: string;

  @ApiProperty()
  @IsOptional()
  descuento?: number;

  @ApiProperty()
  @IsOptional()
  diasCredito?: number;
}
