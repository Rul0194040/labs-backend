import { Module } from '@nestjs/common';
import { TiposInsumosController } from './tipos-insumos.controller';
import { TiposInsumosService } from './tipos-insumos.service';

@Module({
  controllers: [TiposInsumosController],
  providers: [TiposInsumosService],
})
export class TiposInsumosModule {}
