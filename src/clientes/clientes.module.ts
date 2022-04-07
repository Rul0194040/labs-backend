import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';

@Module({
  imports: [],
  providers: [PxlabService, ClientesService],
  controllers: [ClientesController],
})
export class ClientesModule {}
