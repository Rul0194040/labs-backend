import { PerfilTipoEmpleado } from './../../users/profiles.enum';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CreateEmpleadoDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  puesto: PuestoEntity;
  @ApiProperty()
  puestoId: number;
  @ApiProperty()
  @IsOptional()
  fechaNac?: Date;
  @ApiProperty()
  @IsOptional()
  curp?: string;
  @ApiProperty()
  profile: ProfileTypes;
  @ApiProperty()
  tipoEmpleado: PerfilTipoEmpleado;
}
