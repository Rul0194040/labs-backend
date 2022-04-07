import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { UsersService } from '@sanfrancisco/users/users.service';
import { getRepository } from 'typeorm';
import { MinimoAlcanzadoEvent } from './events/minimoAlcanzado.event';
import { NotificacionEntity } from './notificaciones.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async misNotificaciones(user: UsersEntity): Promise<NotificacionEntity[]> {
    return await getRepository(NotificacionEntity)
      .createQueryBuilder('notif')
      .where('notif.paraId=:paraId', {
        paraId: user.id,
      })
      .getMany();
  }
  async emitMinimoAlcanzado(event: MinimoAlcanzadoEvent) {
    console.log('minimo alcanzado', event);
    //obtener usuarios a notificar
    //administrador de matriz
    const adminsMatriz = await this.userService.getMatrizAdmins();
    console.log('adminsMatriz', adminsMatriz);
    //administrador de sucursal activos
    const adminsSuc = await this.userService.getAdminsSuc(event.sucursal.id);
    console.log('adminsSuc', adminsSuc);

    //crear las notificaciones en la bd. matriz y sucursal
    //de: vacio(las manda sistema),
    let de: UsersEntity;
    for (let index = 0; index < adminsMatriz.length; index++) {
      const adminMatriz = adminsMatriz[index];
      const notificacion = await this.crearNotificacion(
        de,
        adminMatriz,
        'Alerta de mínimo',
        'La sucursal ' +
          event.sucursal.nombre +
          ' reporta insumo ' +
          event.insumo.nombre +
          ' dentro de los mínimos.',
        '/#/stock',
      );

      //lanzar websocket
      this.eventEmitter.emit('gateway.send', {
        channel: 'admin',
        event: 'notificacion',
        data: notificacion,
      });
    }
    for (let index = 0; index < adminsSuc.length; index++) {
      const adminSuc = adminsSuc[index];
      const notificacion = await this.crearNotificacion(
        de,
        adminSuc,
        'Alerta de mínimo',
        'Tenemos el insumo ' + event.insumo.nombre + ' dentro de los mínimos.',
        '/#/stock',
      );
      this.eventEmitter.emit('gateway.send', {
        channel: 'admin',
        event: 'notificacion',
        data: notificacion,
      });
    }
  }

  async crearNotificacion(
    de: UsersEntity,
    para: UsersEntity,
    titulo: string,
    descripcion: string,
    link: string,
  ): Promise<NotificacionEntity> {
    const aCrear = new NotificacionEntity();

    aCrear.de = de;
    aCrear.para = para;
    aCrear.titulo = titulo;
    aCrear.descripcion = descripcion;
    aCrear.link = link;

    return await getRepository(NotificacionEntity).save(aCrear);
  }
}
