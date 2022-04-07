import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, Max, Min } from 'class-validator';
import { PerfilTipoEmpleado, ProfileTypes } from '../profiles.enum';
/**
 * @ignore
 */
export class createUserDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  profile?: ProfileTypes;
  @ApiProperty()
  tipoEmpleado?: PerfilTipoEmpleado;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  active?: boolean;
  @ApiProperty()
  @Min(0)
  @Max(1)
  comisionVendedor?: number;
  @ApiProperty()
  rules?: string[];
  @ApiProperty({
    description: 'Telefono del usuario',
  })
  telefono?: string;

  @ApiProperty({
    description: 'sucursal del usuario',
  })
  sucursal?: number;

  @ApiProperty()
  @IsOptional()
  nip?: string;

  @ApiProperty()
  @IsOptional()
  maxDescuento?: number;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    profile?: ProfileTypes,
    active?: boolean,
    rules?: string[],
    telefono?: string,
    sucursal?: number,
    nip?: string,
    maxDescuento?: number,
    tipoEmpleado?: PerfilTipoEmpleado,
    comisionVendedor?: number,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profile = profile;
    this.password = password;
    this.active = active;
    this.rules = rules;
    this.telefono = telefono;
    this.sucursal = sucursal;
    this.nip = nip;
    this.maxDescuento = maxDescuento;
    this.tipoEmpleado = tipoEmpleado;
    this.comisionVendedor = comisionVendedor;
  }
}
