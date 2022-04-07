import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Brackets, getRepository } from 'typeorm';
import { MensajeEntity } from './mensaje.entity';

@Injectable()
export class MensajesService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  //solicitar una conversacion, regresar paginados los ultimos 10 mensajes
  //ordenado de ultimo a menor
  //@OnEvent('chat.open')
  handleAbrirConversacion(origenUuid: string, destinoUuid: string) {
    //retornar los ultimos 20 mensajes en donde o el uno el otro sean origen y destino
    //TODO: paginar
    return getRepository(MensajeEntity)
      .createQueryBuilder('mensaje')
      .leftJoin('mensaje.origen', 'origen')
      .leftJoin('mensaje.destino', 'destino')
      .where(
        new Brackets((qb) => {
          qb.where('origen.uuid=:origenUuid', {
            origenUuid: origenUuid,
          }).andWhere('destino.uuid=:destinoUuid', {
            destinoUuid: destinoUuid,
          });
        }),
      )
      .orWhere(
        new Brackets((qb1) => {
          qb1
            .where('origen.uuid=:destinoUuid', {
              origenUuid: destinoUuid,
            })
            .andWhere('destino.uuid=:origenUuid', {
              destinoUuid: origenUuid,
            });
        }),
      )
      .select([
        'mensaje',
        'origen.id',
        'origen.uuid',
        'origen.firstName',
        'origen.lastName',
        'destino.id',
        'destino.uuid',
        'destino.firstName',
        'destino.lastName',
      ])
      .orderBy('mensaje.createdAt', 'ASC')
      .getMany();
  }

  //escuchamos el evento de aplicacion 'chat.mensaje'
  //guardamos el mensaje recibido
  @OnEvent('chat.mensaje')
  async handleBroadcastEvent(mensajeToSend: {
    origenUuid: number;
    texto: string;
    destinoUuid: number;
  }) {
    const userRepository = getRepository(UsersEntity);

    let origen: UsersEntity;

    if (mensajeToSend.origenUuid) {
      origen = await userRepository.findOne({
        where: { uuid: mensajeToSend.origenUuid },
      });
      if (!origen) {
        throw new HttpException('El origen no existe', HttpStatus.NOT_FOUND);
      }
    }

    const destino = await userRepository.findOne({
      where: { uuid: mensajeToSend.destinoUuid },
    });

    if (!destino) {
      throw new HttpException('El destino no existe', HttpStatus.NOT_FOUND);
    }

    const mensaje = await getRepository(MensajeEntity).save({
      origen,
      destino,
      texto: mensajeToSend.texto,
    });

    //notificar por sockets, de vuelta al gateway con el mensaje creado en db
    //a destino.
    this.eventEmitter.emit('gateway.send', {
      event: 'nuevoMensaje',
      channel: destino.uuid, //al destinatario por uuid
      data: mensaje,
    });

    //a origen.
    this.eventEmitter.emit('gateway.send', {
      event: 'nuevoMensaje',
      channel: origen.uuid, //al origen por uuid
      data: mensaje,
    });

    return mensaje;
  }
}
