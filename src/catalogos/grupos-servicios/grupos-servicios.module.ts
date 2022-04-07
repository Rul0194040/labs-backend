import { Module } from '@nestjs/common';
import { GruposServiciosController } from './grupos-servicios.controller';
import { GruposServiciosService } from './grupos-servicios.service';

@Module({
  controllers: [GruposServiciosController],
  providers: [GruposServiciosService],
})
export class GruposServiciosModule {}
