import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { ConfigService } from '@nestjs/config';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { Module } from '@nestjs/common';
import { PresupuestosController } from './presupuestos.controller';
import { PresupuestosService } from './presupuestos.service';

@Module({
  controllers: [PresupuestosController],
  providers: [PresupuestosService, HeimdalService, ConfigService, MailService],
})
export class PresupuestosModule {}
