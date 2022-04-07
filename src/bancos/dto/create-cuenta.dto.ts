import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class CreateCuentaDto {
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  saldo: number;
  @ApiProperty()
  banco: number;
  @ApiProperty()
  numeroCuenta: string;
}
