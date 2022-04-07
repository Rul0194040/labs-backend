import { Module } from '@nestjs/common';
import { TiposUnidadesService } from './tipos-unidades.service';
import { TiposUnidadesController } from './tipos-unidades.controller';

@Module({
  providers: [TiposUnidadesService],
  controllers: [TiposUnidadesController],
})
export class TiposUnidadesModule {}
