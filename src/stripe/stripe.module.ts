import { Module } from '@nestjs/common';
import { ClientesModule } from '@sanfrancisco/clientes/clientes.module';
import { ClientesService } from '@sanfrancisco/clientes/clientes.service';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [ClientesModule],
  controllers: [StripeController],
  providers: [StripeService, ClientesService, PxlabService],
})
export class StripeModuleLocal {}
