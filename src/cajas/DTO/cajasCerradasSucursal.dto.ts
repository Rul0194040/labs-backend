import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../../users/users.entity';

export class CajasCerradasSucursalDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  montoApertura: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  fechaApertura: Date;

  @ApiProperty()
  fechaCierre: Date;

  @ApiProperty()
  usuario: UsersEntity;

  @ApiProperty()
  ventas: number;

  @ApiProperty()
  retiros: number;

  @ApiProperty()
  depositos: number;

  @ApiProperty()
  transferencias: number;

  @ApiProperty()
  tarjeta: number;

  @ApiProperty()
  efectivo: number;

  @ApiProperty()
  cheque: number;

  @ApiProperty()
  creditoVentas: number;

  @ApiProperty()
  credito: number;

  @ApiProperty()
  faltante: number;

  @ApiProperty()
  observaciones: string;
}
