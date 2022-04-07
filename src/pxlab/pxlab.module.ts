import { Global, Module } from '@nestjs/common';
import { PxlabService } from './pxlab.service';
import { PxlabController } from './pxlab.controller';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';
import { SucursalesModule } from '@sanfrancisco/sucursales/sucursales.module';

@Global()
@Module({
  imports: [SucursalesModule],
  providers: [PxlabService, SucursalesService],
  controllers: [PxlabController],
})
export class PxlabModule {}
