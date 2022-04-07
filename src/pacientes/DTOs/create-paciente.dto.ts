import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SexoPaciente } from '../sexoPaciente.enum';
export class CreatePacienteDTO {
  @ApiProperty({
    description: 'empresa de la que viene el paciente',
  })
  @IsOptional()
  cliente?: number;

  @ApiProperty({})
  @IsOptional()
  apellidoPaterno: string;

  @ApiProperty({})
  @IsOptional()
  apellidoMaterno: string;

  @ApiProperty({})
  @IsOptional()
  telefono: string;

  @ApiProperty({})
  @IsOptional()
  fechaNac: Date;

  @ApiProperty({})
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'nombre del paciente',
  })
  nombre: string;

  @ApiProperty({
    description: 'sexo del paciente',
  })
  @IsOptional()
  sexo?: SexoPaciente;
}
