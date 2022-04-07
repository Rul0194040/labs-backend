import { UseGuards } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { QrsEntity } from '@sanfrancisco/empleados/qrs/qrs.entity';
import { QrsService } from '@sanfrancisco/empleados/qrs/qrs.service';
import { MyLogger } from '@sanfrancisco/logger';
import { TareasEstatus } from '@sanfrancisco/pxlab/tareas-estatus.enum';
import { TareasEntity } from '@sanfrancisco/pxlab/tareas.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { pick } from 'lodash';
import { Server, Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import { EventDTO } from './event.dto';
import { MonitorEvents } from './monitorEvents.enum';
import { ParseWSBodyPipe } from './parsewsbody.pipe';
import { WebsocketGuardApiKey } from './websocketApiKey.guard';
import { WebsocketGuardAuthorization } from './websocketAuthorization.guard';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly qrsService: QrsService,
  ) {}
  //logger
  private readonly logger = new MyLogger(EventsGateway.name);
  //server
  @WebSocketServer() public server: Server;

  //mediante este "listener" podemos enviar mensajes desde
  //cualquier parte del sistema con el service eventEmitter: EventEmitter2
  @OnEvent('gateway.send')
  handleBroadcastEvent(event: EventDTO) {
    this.server.to(event.channel).emit(event.event, event.data);
  }

  //enviar mensaje al chat
  @SubscribeMessage('enviarMensaje')
  @UseGuards(WebsocketGuardAuthorization)
  enviarMensaje(
    @MessageBody(ParseWSBodyPipe) data: { destinoUuid: number; texto: string },
    @ConnectedSocket() socket: Socket & { user: Partial<UsersEntity> },
  ) {
    //emitir un evento de aplicacion, va a dar al service de mensajes
    this.eventEmitter.emit('chat.mensaje', {
      origenUuid: socket.user.uuid,
      texto: data.texto,
      destinoUuid: data.destinoUuid,
    });
    //retornar ok al socket
    return 'OK';
  }

  //evento cuando un cliente solicita suscripcion a canales
  @SubscribeMessage('channels')
  @UseGuards(WebsocketGuardAuthorization)
  async channels(
    @MessageBody(ParseWSBodyPipe) data: { any },
    @ConnectedSocket() socket: Socket & { user: Partial<UsersEntity> },
  ): Promise<{ channels: string[] }> {
    const canales = [
      'general',
      'profile_' + socket.user.profile,
      socket.user.uuid,
    ];
    this.logger.verbose(
      `User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) has new socket ${socket.id}.`,
    );
    //lo unimos a su canal de aplicacion, perfil y usuario
    await socket.join(canales);

    //lo pasamos al administrador de sockets con este evento
    //(OnlineModule, OnlineService)
    this.eventEmitter.emit('socket.connected', socket);

    //regresar sus canales al socket conectado
    return { channels: canales };
  }

  /**
   * Recibir el evento de QR escaneado por un empleado
   *
   * @param data uuid, QR del monitor.
   * @returns
   */

  @SubscribeMessage(MonitorEvents.QR_SCAN)
  @UseGuards(WebsocketGuardAuthorization)
  async qrEscaneado(
    @MessageBody(ParseWSBodyPipe) data: any,
    @ConnectedSocket() socket: Socket & { user: Partial<UsersEntity> },
  ) {
    //buscar el QR
    const qrEncontrado = await this.qrsService.getByUuid(data.uuid);

    let qrEntrada: QrsEntity;

    //existe?
    if (!qrEncontrado) {
      return { error: 'El código no se encuentra, inténtelo de nuevo.' };
    }

    //si viene entrada, existe?
    if (data.entrada) {
      qrEntrada = await this.qrsService.getByUuid(data.entrada);
    }

    //avisar a la sucursal de donde proviene el codigo...
    this.handleBroadcastEvent({
      event: 'quemandoQr',
      channel: qrEncontrado.sucursal.uuid,
      data: qrEncontrado,
    });

    //quemar el qr
    const resultQuemar = await this.qrsService.quemarQr(
      qrEncontrado.uuid,
      socket.user.id,
      qrEntrada,
      data.lat,
      data.lng,
    );

    //generar un nuevo QR para esa sucursal y entregarselo.
    const codigoNuevo = await this.qrsService.generarQr(
      qrEncontrado.sucursal.id,
    );

    this.handleBroadcastEvent({
      event: 'nuevoQr',
      channel: qrEncontrado.sucursal.uuid,
      data: { codigoNuevo, usuarioQuema: socket.user, resultQuemar },
    });

    //si estaba marcando una salida, regresar el qr de salida
    const success = { resultQuemar };
    if (!qrEntrada) {
      success['qrEntrada'] = qrEncontrado;
      //socket para admin de la entrada de este usuario
      this.handleBroadcastEvent({
        event: 'checador.entrada',
        channel: ProfileTypes.SYSADMIN,
        data: socket.user,
      });
    } else {
      success['qrSalida'] = qrEncontrado;
      //socket para admin de la salida de este usuario
      this.handleBroadcastEvent({
        event: 'checador.salida',
        channel: ProfileTypes.SYSADMIN,
        data: socket.user,
      });
    }

    return success;
  }

  /**
   * Enviado por los monitores cuando se les valida su apikey y acaban de arrancar.
   *
   * @param data
   * @param socket
   * @returns
   */
  @SubscribeMessage('monitor.online')
  @UseGuards(WebsocketGuardApiKey)
  async monitorOnline(
    @MessageBody(ParseWSBodyPipe) data: { any },
    @ConnectedSocket() socket: Socket & { sucursal: any; apiKey: string },
  ): Promise<{
    channels: string[];
    sucursal: Partial<SucursalEntity>;
    qr: string;
  }> {
    const canales = [socket.sucursal.uuid, socket.apiKey, 'monitores'];
    const userAgent = socket.handshake.headers['user-agent'];
    const monitorIp = socket.handshake.address;
    await socket.join(canales);

    const sucursal: Partial<SucursalEntity> = pick(socket.sucursal, [
      'id',
      'uuid',
      'nombre',
    ]);

    //enviar al onlineService
    this.eventEmitter.emit(MonitorEvents.CONNECTED, {
      socketId: socket.id,
      sucursal: sucursal,
      apiKey: socket.apiKey,
      since: socket.handshake.time,
      userAgent,
      monitorIp,
    });

    //enviar socket a los sysadmins
    this.handleBroadcastEvent({
      channel: 'profile_' + ProfileTypes.SYSADMIN,
      event: MonitorEvents.ON_LINE,
      data: {
        socketId: socket.id,
        sucursal: sucursal,
        since: socket.handshake.time,
        userAgent,
        monitorIp,
      },
    });

    //le damos al monitor un codigo qr que mostrar en el checador
    const newQr = await this.qrsService.generarQr(socket.sucursal.id);

    return {
      sucursal: sucursal,
      channels: canales,
      qr: newQr.uuid,
    };
  }

  //recibir un socket del monitor avisando sobre el foliopx asignado a un servicio.
  //proviene del monitor->SocketsService.handleNuevaVenta
  @SubscribeMessage('pxlab.responseVenta')
  @UseGuards(WebsocketGuardApiKey)
  async folioPXListo(@MessageBody(ParseWSBodyPipe) data: any) {
    //marcar esta tarea como finalizada
    await getRepository(TareasEntity).update(
      { id: data.tareaId },
      { status: TareasEstatus.FINALIZADA },
    );
    const folioPx = data.response.MuestraResult.split('|');
    if (data.response && data.response.MuestraResult && folioPx[0] === '1') {
      if (folioPx[1].length === 8) {
        this.logger.verbose(
          'Recibido folio pxlab: ' + JSON.stringify(data.response),
        );

        return await getRepository(VentaEntity)
          .createQueryBuilder()
          .update()
          .set({ folioPxLab: folioPx[1] })
          .where('id = :idVenta', { idVenta: data.idVenta })
          .execute();
      } else {
        this.logger.log('Respuesta de folio pxlab aceptada.' + folioPx[1]);
      }
    } else {
      this.logger.log(
        'Respuesta de folio pxlab desconocida.' + JSON.stringify(data),
      );
    }

    return 'OK';
  }

  @SubscribeMessage('pxlab.responseNuevoEstudio')
  @UseGuards(WebsocketGuardApiKey)
  async estudioOk(@MessageBody(ParseWSBodyPipe) data: any) {
    this.logger.verbose('pxlab.responseNuevoEstudio: ' + JSON.stringify(data));
    //marcar esta tarea como finalizada
    await getRepository(TareasEntity).update(
      { id: data.tareaId },
      { status: TareasEstatus.FINALIZADA },
    );
    return 'OK';
  }

  @SubscribeMessage('pxlab.responseNuevoCliente')
  @UseGuards(WebsocketGuardApiKey)
  async clienteOk(@MessageBody(ParseWSBodyPipe) data: any) {
    this.logger.verbose('pxlab.responseNuevoCliente:' + JSON.stringify(data));
    //marcar esta tarea como finalizada
    await getRepository(TareasEntity).update(
      { id: data.tareaId },
      { status: TareasEstatus.FINALIZADA },
    );
    return 'OK';
  }

  /**
   * Después de la inicialización del gateway
   */
  async afterInit(): Promise<any> {
    this.logger.verbose('EventsGateway initialized.');
    return;
  }
  /**
   * Cada que un cliente intenta conectarse...
   * el socket llega a la puerta, aun no esta autenticado.
   * @param { Socket } socket
   */
  async handleConnection(socket: Socket): Promise<any> {
    this.logger.verbose(
      'EventsGateway->handleConnection->socket: ' + socket.id,
    );
    return;
  }

  /**
   * Cada que un cliente se desconecta...
   * @param { Socket } client
   */
  async handleDisconnect(
    socket: Socket & { user: Partial<UsersEntity> },
  ): Promise<any> {
    this.logger.verbose(
      `EventsGateway->handleDisconnect->socket: ${socket.id}, ${socket.user?.email}`,
    );
    this.eventEmitter.emit('socket.disconnected', socket);
  }
}
