import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { MensajeEntity } from './mensaje.entity';
import { MensajesService } from './mensajes.service';

@Controller('mensajes')
@UseGuards(JwtAuthGuard)
@ApiTags('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  /**
   * Abrir una conversacion entre el solicitante y con quien lo solicita
   *
   * @param conQuienUuid uuid de la persona con la que se requiere la conversacion
   * @param solicita sesion del usuario que solicita
   * @returns {MensajeEntity[]} array de mensajes
   */
  @Get('conversacion/:conQuienUUID')
  abrirCoversacion(
    @Param('conQuienUUID') conQuienUuid: string,
    @User() solicita: LoginIdentityDTO,
  ): Promise<MensajeEntity[]> {
    return this.mensajesService.handleAbrirConversacion(
      solicita.uuid,
      conQuienUuid,
    );
  }
}

/*
CHAT
Lista de usuarios
Erik (Disponible)
Esteban (Ocupado)
Ray (Disponible) ->

Abrir Chat
Raymundo Lopez Gomez

Historial de chat (whatsapp, ordenados por fecha, de mayor a menor, listados de arriba a abajo)

[TEXTO](Enviar) ->socket



*/
