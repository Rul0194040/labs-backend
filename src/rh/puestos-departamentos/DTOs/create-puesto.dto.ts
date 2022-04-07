import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreatePuestoDTO {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  sueldoMensual: number;

  @ApiProperty()
  @IsOptional()
  plazasDisponibles: number;

  @ApiProperty()
  @IsOptional()
  puestoJefeId: number;

  @ApiProperty()
  @IsOptional()
  departamentoId: number;
}
