import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SexoPaciente } from '../sexoPaciente.enum';
export class UpdatePacienteDTO {
  @ApiProperty()
  cliente?: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  apellidoPaterno?: string;

  @ApiProperty()
  @IsOptional()
  apellidoMaterno?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty({})
  @IsOptional()
  fechaNac: Date;

  @ApiProperty()
  @IsOptional()
  telefono?: string;

  @ApiProperty()
  descripcion?: string;

  @ApiProperty()
  @IsOptional()
  sexo?: SexoPaciente;
}
