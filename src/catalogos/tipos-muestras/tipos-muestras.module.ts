import { Module } from '@nestjs/common';
import { TiposMuestrasController } from './tipos-muestras.controller';
import { TiposMuestrasService } from './tipos-muestras.service';

@Module({
  controllers: [TiposMuestrasController],
  providers: [TiposMuestrasService],
})
export class TiposMuestrasModule {}
