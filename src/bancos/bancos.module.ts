import { Module } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { CuentasController } from './controllers/cuentas.controller';
import { MovimientosController } from './controllers/movimientos.controller';
import { BancosController } from './controllers/bancos.controller';
import { TiposCuentasGastoController } from './controllers/tipos-cuentas-gasto.controller';

@Module({
  controllers: [
    BancosController,
    CuentasController,
    MovimientosController,
    TiposCuentasGastoController,
  ],
  providers: [BancosService],
})
export class BancosModule {}
