import { ApiProperty } from '@nestjs/swagger';
import { TiposConvenios } from '@sanfrancisco/common/enum/tipos-convenios.enum';
import { IsOptional } from 'class-validator';

export class UpdateClienteDTO {
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
  tipoConvenio: TiposConvenios;

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
