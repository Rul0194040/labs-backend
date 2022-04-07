import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { VentasModule } from '@sanfrancisco/ventas/ventas.module';
import { VentasService } from '@sanfrancisco/ventas/ventas.service';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { PublicoController } from './publico/publico.controller';

@Module({
  imports: [
    VentasModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (_configService: ConfigService) => ({
        secret: _configService.get(ConfigKeys.JWT_SECRET),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PacientesController, PublicoController],
  providers: [PacientesService, VentasService, PxlabService],
})
export class PacientesModule {}
