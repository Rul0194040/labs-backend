import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CuentaBancariaEntity } from '../entities/cuenta-bancaria.entity';
import { TipoMovimientosBancos } from '../tipo-movimientos-bancos.enum';

export class CreateMovBancarioDTO {
  @ApiProperty()
  origen: CuentaBancariaEntity;
  @ApiProperty()
  destino: CuentaBancariaEntity;
  @ApiProperty()
  usuario: UsersEntity;
  @ApiProperty()
  monto: number;
  @ApiProperty()
  fecha: Date;
  @ApiProperty()
  referencia: string;
  @ApiProperty()
  tipo: TipoMovimientosBancos;
}
