import { Module } from '@nestjs/common';
import { DireccionesFiscalesService } from './direcciones-fiscales.service';
import { DireccionesFiscalesController } from './direcciones-fiscales.controller';

@Module({
  providers: [DireccionesFiscalesService],
  controllers: [DireccionesFiscalesController],
})
export class DireccionesFiscalesModule {}
