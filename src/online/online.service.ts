import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { MonitorEvents } from '@sanfrancisco/events/monitorEvents.enum';
import { TareasEstatus } from '@sanfrancisco/pxlab/tareas-estatus.enum';
import { TareasEntity } from '@sanfrancisco/pxlab/tareas.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { groupBy, pick } from 'lodash';
import { getRepository, In } from 'typeorm';
import { Cache } from 'cache-manager';
import { MyLogger } from '@sanfrancisco/logger';
import { Socket } from 'socket.io';
import { UsersEntity } from '@sanfrancisco/users/users.entity';

@Injectable()
export class OnlineService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new MyLogger(OnlineService.name);

  sockets: { id: string; user: Partial<UsersEntity> }[] = [];
  timeouts: any[] = [];
  timeoutThreshold = 8000;
  horasCache = 8;
  pendientes: number[] = [];
  monitores: {
    socketId: string;
    sucursal: Partial<SucursalEntity>;
    since: string;
    apiKey: string;
    userAgent: string;
    monitorIp: string;
  }[] = [];

  //cada que se conecta un socket, y solicita sus canales...
  //el gateway emite este evento el cual nos sirve para ponerlo
  //en nuestra pila de sockets
  @OnEvent('socket.connected')
  async handleSocketConnected(socket: Socket & { user: Partial<UsersEntity> }) {
    //obtener los sockets de redis y pasarlos a memoria
    const socketsRaw: string = await this.cacheManager.get('sockets');

    if (socketsRaw) {
      this.sockets = JSON.parse(socketsRaw);
    }

    const monitoresRaw: string = await this.cacheManager.get('sockets');
    if (monitoresRaw) {
      this.monitores = JSON.parse(monitoresRaw);
    }

    //este usuario, ya tiene un socket?
    const idxSocket = this.sockets.findIndex((s) => {
      return socket.user.id === s.user.id;
    });

    //no tenia sockets previos, acaba de ponerse en linea
    if (idxSocket === -1) {
      //solo notificar si no hay un pendiente con su id
      //quitar de pendientes...
      const pendientesRaw: string = await this.cacheManager.get('pendientes');
      if (pendientesRaw) {
        this.pendientes = JSON.parse(pendientesRaw);
      }
      const idxPendiente = this.pendientes.indexOf(socket.user.id);
      if (idxPendiente === -1) {
        this.logger.verbose(
          `User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) is online.`,
        );
        //notificamos a todos de este nuevo usuario en linea
        this.eventEmitter.emit('gateway.send', {
          channel: 'general',
          event: 'userOnLine',
          data: pick(socket.user, [
            'id',
            'uuid',
            'firstName',
            'lastName',
            'email',
            'telefono',
            'profile',
          ]),
        });
      }
    } else {
      //el usuario ya tenia un socket previo, no notificamos a nadie
      this.logger.verbose(
        `User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) is already online.`,
      );
    }

    //lo agregamos a la pila de sockets de memoria y a redis
    this.sockets.push({ id: socket.id, user: socket.user });
    await this.cacheManager.set('sockets', JSON.stringify(this.sockets), {
      ttl: 60 * 60 * this.horasCache, //3 cache por 3 horas
    });

    //preparar lista de usuarios en linea para enviarsela a este usuario
    const users = await this.getOnlineUsers();
    //enviamos lista de usuarios en linea
    socket.emit('usersOnLine', users);

    //si es un sysadmin le enviamos la lista de monitores tambien.
    if (socket.user.profile === ProfileTypes.SYSADMIN) {
      socket.emit(MonitorEvents.ONLINE_LIST, this.monitores);
    }
  }
  async getOnlineUsers() {
    //refrescar los sockets desde redis
    const socketsRaw: string = await this.cacheManager.get('sockets');
    if (socketsRaw) {
      this.sockets = JSON.parse(socketsRaw);
    }
    //(sockets agrupados por user.id y despues el idx 1)
    const userGroups = groupBy(this.sockets, 'user.id');
    const userIds = Object.keys(userGroups);
    const users: Partial<UsersEntity>[] = [];
    for (let i = 0; i <= userIds.length - 1; i++) {
      users.push(userGroups[userIds[i]][0].user);
    }
    return users;
  }
  /**
   * Desconexión de un socket.
   *
   * Se debe quitar de la pila, y si de ese usuario ya no quedan
   * mas sockets, se debe notificar que el usuario se ha ido.
   *
   * Esta notificacion debe pasarse a un "timeout" por si regresa en ese
   * periodo de tiempo se cancela el envio.
   *
   * @param socketId socket id que se desconecta
   */
  @OnEvent('socket.disconnected')
  async handleSocketDisconnected(
    socket: Socket & { user: Partial<UsersEntity> },
  ) {
    //obtener los sockets de redis y pasarlos a memoria
    const socketsRaw: string = await this.cacheManager.get('sockets');
    if (socketsRaw) {
      this.sockets = JSON.parse(socketsRaw);
    }

    //quitar de los sockets online.
    const idx = this.sockets.findIndex((s) => s.id === socket.id);
    if (idx > -1) {
      //quitarlo de los usuarios online.
      this.sockets.splice(idx, 1);
      await this.cacheManager.set('sockets', JSON.stringify(this.sockets), {
        ttl: 60 * 60 * this.horasCache, //3 cache por 3 horas
      });

      //si ya no queda ningun socket de ese usuario, esta offline
      if (
        this.sockets.findIndex((s) => {
          return s.user.id === socket.user.id;
        }) === -1
      ) {
        const pendientesRaw: string = await this.cacheManager.get('pendientes');
        if (pendientesRaw) {
          this.pendientes = JSON.parse(pendientesRaw);
        }
        //ponemos este usuario en pendientes (por si se pone en linea de nuevo mientras hay pendiente: no notificar estado online)
        this.pendientes.push(socket.user.id);
        await this.cacheManager.set(
          'pendientes',
          JSON.stringify(this.pendientes),
          {
            ttl: 60 * 60 * this.horasCache, //3 cache por horas
          },
        );
        //generamos un timeout que contenga la notificacion del usuario offline
        //que se ejecute dentro de N segundos, en caso de que en ese tiempo se conecte
        //la notificacion no deberia enviarse (evitar muchas notificaciones de usuario
        //en linea y desconectados devido a la intermitencia de sockets en la conexion)
        setTimeout(async () => {
          // en la cual, verificamos en los sockets de redis si no es que ya
          // se puso en linea de nuevo en este periodo de tiempo
          const onlineUsers = await this.getOnlineUsers();
          // si no esta en linea en este momento, mandamos un broadcast a todos
          if (onlineUsers.findIndex((u) => u.id === socket.user.id) === -1) {
            this.logger.verbose(
              `User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName})  is offline.`,
            );
            // donde comunicamos que el usuario se ha desconectado
            this.eventEmitter.emit('gateway.send', {
              channel: 'general',
              event: 'userOffLine',
              data: socket.user,
            });

            //quitar de pendientes...
            const pendientesRaw: string = await this.cacheManager.get(
              'pendientes',
            );
            if (pendientesRaw) {
              this.pendientes = JSON.parse(pendientesRaw);
            }
            this.pendientes.splice(this.pendientes.indexOf(socket.user.id));
            await this.cacheManager.set(
              'pendientes',
              JSON.stringify(this.pendientes),
              {
                ttl: 60 * 60 * this.horasCache, //3 cache por horas
              },
            );
          }
        }, this.timeoutThreshold);
      }
    }

    //verificar si es un monitor.
    const monitoresRaw: string = await this.cacheManager.get('monitores');
    if (monitoresRaw) {
      this.monitores = JSON.parse(monitoresRaw);
    }
    const idxMonitores = this.monitores.findIndex(
      (s) => s.socketId === socket.id,
    );
    if (idxMonitores > -1) {
      this.logger.verbose(
        `Monitor fuera de linea: ${this.monitores[idxMonitores].sucursal.nombre}`,
      );
      this.eventEmitter.emit('gateway.send', {
        channel: ProfileTypes.SYSADMIN,
        event: MonitorEvents.OFF_LINE,
        data: this.monitores[idxMonitores],
      });
      this.monitores.splice(idxMonitores, 1);
      await this.cacheManager.set('monitores', JSON.stringify(this.monitores), {
        ttl: 60 * 60 * this.horasCache, //3 cache por horas
      });
    }
  }

  /***************************monitores**************************** */
  @OnEvent(MonitorEvents.CONNECTED)
  async handleMonitorConnected(monitor: {
    socketId: string;
    sucursal: Partial<SucursalEntity>;
    since: string;
    apiKey: string;
    userAgent: string;
    monitorIp: string;
  }) {
    this.logger.verbose(`Monitor conectado: ${monitor.sucursal.nombre}`);
    const monitoresRaw: string = await this.cacheManager.get('monitores');
    if (monitoresRaw) {
      this.monitores = JSON.parse(monitoresRaw);
    }
    this.monitores.push(monitor);
    await this.cacheManager.set('monitores', JSON.stringify(this.monitores), {
      ttl: 60 * 60 * this.horasCache, //3 cache por 3 horas
    });
  }

  //cada minuto checar tareas nuevas.
  @Cron('1 */1 * * * *')
  async handleCron() {
    //en entornos clusterizados solo la instancia cero ejecuta tareas
    if (
      !process.env.NODE_APP_INSTANCE ||
      process.env.NODE_APP_INSTANCE === '0'
    ) {
      // obtener monitores de cache antes de operar
      const monitoresRaw: string = await this.cacheManager.get('monitores');
      if (monitoresRaw) {
        this.monitores = JSON.parse(monitoresRaw);
      }
      //si hay monitores en linea...
      if (this.monitores.length) {
        const monitoresApiKeys = this.monitores.map((m) => m.apiKey);

        //ir por las tareas pendientes...(estatus === 0)
        const tareas = await getRepository(TareasEntity).find({
          where: { status: TareasEstatus.NUEVA, channel: In(monitoresApiKeys) },
        });

        if (monitoresApiKeys.length && tareas.length) {
          this.logger.verbose(
            `Tareas para ${monitoresApiKeys.length} monitores en línea.`,
          );
          this.logger.verbose('Encontradas ' + tareas.length + ' por ejecutar');

          //buscar monitores en linea de esas tareas
          for (let idx = 0; idx < tareas.length; idx++) {
            const tarea = tareas[idx];
            this.logger.verbose('Enviando tarea ' + tarea.data);
            //Enviar el socket!
            this.eventEmitter.emit('gateway.send', {
              event: tarea.event,
              channel: tarea.channel,
              data: tarea,
            });
          }
        }
      }
    }
  }
}
