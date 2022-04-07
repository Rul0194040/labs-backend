import { MuestraEntity } from './ventas/muestras/muestras.entity';
import { CorteTesoreroEntity } from './tesoreros/cortesTesorero/cortesTesorero.entity';
import { ImageEntity } from './images/model/image.entity';
import { ServiciosInsumosEntity } from './servicios/servicios-insumos.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  CacheModule,
  CACHE_MANAGER,
  HttpException,
  Inject,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeys } from './common/enum/configkeys.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersEntity } from './users/users.entity';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { AppConfig } from './app.config';
import { LocalMailerModule } from './common/services/mailer/email.module';
import { SucursalEntity } from './sucursales/sucursal.entity';
import { SucursalesModule } from './sucursales/sucursales.module';
import { SmsModule } from './common/services/sms/sms.module';
import { ServiciosModule } from './servicios/servicios.module';
import { GruposServiciosModule } from './catalogos/grupos-servicios/grupos-servicios.module';
import { TiposUnidadesModule } from './catalogos/tipos-unidades/tipos-unidades.module';
import { TiposMuestrasModule } from './catalogos/tipos-muestras/tipos-muestras.module';
import { InsumosModule } from './insumos/insumos.module';
import { TiposInsumosModule } from './catalogos/tipos-insumos/tipos-insumos.module';
import { InsumoEntity } from './insumos/insumo.entity';
import { ServicioEntity } from './servicios/servicio.entity';
import { TipoInsumoEntity } from './catalogos/tipos-insumos/tipo-insumo.entity';
import { TipoUnidadEntity } from './catalogos/tipos-unidades/tipos-unidades.entity';
import { TipoMuestraEntity } from './catalogos/tipos-muestras/tipos-muestras.entity';
import { GrupoServicioEntity } from './catalogos/grupos-servicios/grupo-servicio.entity';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlmacenModule } from './almacen/almacen.module';
import { VentasModule } from './ventas/ventas.module';
import { ClientesModule } from './clientes/clientes.module';
import { DetalleMovimientosEntity } from './almacen/detalleMovimientos.entity';
import { MovimientosAlmacenEntity } from './almacen/movimientosAlmacen.entity';
import { SucursalesInsumosEntity } from './sucursales/sucursalesInsumos.entity';
import { DetalleVentasEntity } from './ventas/ventasDetalle.entity';
import { VentaEntity } from './ventas/ventas.entity';
import { PagosModule } from './pagos/pagos.module';
import { PagoEntity } from './pagos/pagos.entity';
import { CajaEntity } from './cajas/cajas.entity';
import { PacienteEntity } from './pacientes/pacientes.entity';
import { ProveedorEntity } from './catalogos/proveedores/proveedores.entity';
import { ProveedoresModule } from './catalogos/proveedores/proveedores.module';
import { PacientesService } from './pacientes/pacientes.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { ClienteEntity } from './clientes/clientes.entity';
import { XquendaMiddleware } from './common/filters/xquenda.middleware';
import { CajasModule } from './cajas/cajas.module';
import { DireccionFiscalEntity } from './ventas/direcciones-fiscales/direccionesFiscales.entity';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { NotificacionEntity } from './notificaciones/notificaciones.entity';
import { EventsModule } from './events/events.module';
import { MovimientoCajaEntity } from './cajas/movimientos-caja.entity';
import { MailService } from './common/services/mailer/email.service';
import { LotesModule } from './lotes/lotes.module';
import { LoteEntity } from './lotes/lotes.entity';
import { DetalleVentasInsumosEntity } from './ventas/ventasDetalleInsumos.entity';
import { FacturaEntity } from './facturas/facturas.entity';
import { FacturasModule } from './facturas/facturas.module';
import { HeimdalModule } from './common/heimdal/heimdal.module';
import { PresupuestosModule } from './presupuestos/presupuestos.module';
import { CompraEntity } from './compras/compras.entity';
import { DetalleCompraEntity } from './compras/detallesCompras.entity';
import { PresupuestoEntity } from './presupuestos/presupuesto.entity';
import { PresupuestoDetalleEntity } from './presupuestos/presupuestosDetalle.entity';
import { ComprasModule } from './compras/compras.module';
import { PagoProveedorEntity } from './compras/pagosProveedores.entity';
import { SyslogModule } from './syslog/syslog.module';
import { SyslogService } from './syslog/syslog.service';
import { SyslogEntity } from './syslog/syslog.entity';
import { SyslogMiddleware } from './common/filters/syslog.middleware';
import { TesorerosModule } from './tesoreros/tesoreros.module';
import { PxlabModule } from './pxlab/pxlab.module';
import { MovilModule } from './movil/movil.module';
import { StripeModule } from 'nestjs-stripe';
import { StripeModuleLocal } from './stripe/stripe.module';
import { MedicosModule } from './medicos/medicos.module';
import { MedicoEntity } from './medicos/medico.entity';
import { OnlineModule } from './online/online.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MensajesModule } from './mensajes/mensajes.module';
import { MensajeEntity } from './mensajes/mensaje.entity';
import { ReportesModule } from './reportes/reportes.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { QrsEntity } from './empleados/qrs/qrs.entity';
import { ApiKeyEntity } from './sucursales/api-keys.entity';
import { TareasEntity } from './pxlab/tareas.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TareasModule } from './tareas/tareas.module';
import { UserSucursalesEntity } from './users/userSucursales.entity';
import { BancosModule } from './bancos/bancos.module';
import { RhModule } from './rh/rh.module';
import { BancoEntity } from './bancos/entities/banco.entity';
import { CuentaBancariaEntity } from './bancos/entities/cuenta-bancaria.entity';
import { GastoEntity } from './bancos/entities/gasto.entity';
import { TipoCuentaGastoEntity } from './bancos/entities/tipos-cuenta-gasto.entity';
import { MovimientoCuentaBanco } from './bancos/entities/movimientos-bancos.entity';
import { IncentivoEmpleadoEntity } from './rh/incentivos/entity/incentivos-empleados.entity';
import { DocumentoEntity } from './rh/documentos/entity/documento.entity';
import { DocumentoEmpleadoEntity } from './rh/documentos/entity/documentos-empleados.entity';
import { DocumentoPuestoEntity } from './rh/documentos/entity/documentos-puesto.entity';
import { IncentivoEntity } from './rh/incentivos/entity/incentivos.entity';
import { IncidenciaEntity } from './rh/incidencias/entity/incidencias.entity';
import { IncidenciaEmpleadoEntity } from './rh/incidencias/entity/incidenciasEmpleados.entity';
import { DepartamentoEntity } from './rh/puestos-departamentos/entity/departamento.entity';
import { PuestoEntity } from './rh/puestos-departamentos/entity/puesto.entity';
import { ContratoEntity } from './rh/contrato/entity/contrato.entity';
import { EsquemaPagoEntity } from './rh/esquema-pago.entity';
import { JornadaEntity } from './rh/jornada.entity';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { MyLogger } from './logger';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    RateLimiterModule.register({
      points: 360,
      duration: 60,
      whiteList: ['127.0.0.1', '::1', '::ffff:127.0.0.1'],
      maxQueueSize: 300,
      errorMessage: 'Ha sobrepasado el limite de solicitudes',
    }),
    //cargar configuracion de .env
    ConfigModule.forRoot(AppConfig),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>(ConfigKeys.STRIPE_SECRET),
        apiVersion: '2020-08-27',
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>(ConfigKeys.REDIS_HOST),
        port: configService.get<number>(ConfigKeys.REDIS_PORT),
        db: configService.get<number>(ConfigKeys.REDIS_DB),
        password: configService.get<string>(ConfigKeys.REDIS_PASSWORD),
      }),
    }),
    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        //conectar a la bd
        type: 'mysql',
        host: configService.get<string>(ConfigKeys.MYSQL_HOST),
        port: parseInt(configService.get<string>(ConfigKeys.MYSQL_PORT)),
        username: configService.get<string>(ConfigKeys.MYSQL_USER),
        password: configService.get<string>(ConfigKeys.MYSQL_PASSWORD),
        database: configService.get<string>(ConfigKeys.MYSQL_DB),
        entities: [
          UsersEntity,
          SucursalEntity,
          InsumoEntity,
          ServicioEntity,
          TipoInsumoEntity,
          TipoUnidadEntity,
          TipoMuestraEntity,
          GrupoServicioEntity,
          ServiciosInsumosEntity,
          MovimientosAlmacenEntity,
          DetalleMovimientosEntity,
          SucursalesInsumosEntity,
          VentaEntity,
          DetalleVentasEntity,
          ClienteEntity,
          PagoEntity,
          CajaEntity,
          MovimientoCajaEntity,
          PacienteEntity,
          ProveedorEntity,
          DireccionFiscalEntity,
          NotificacionEntity,
          LoteEntity,
          DetalleVentasInsumosEntity,
          FacturaEntity,
          PresupuestoDetalleEntity,
          PresupuestoEntity,
          CompraEntity,
          DetalleCompraEntity,
          PagoProveedorEntity,
          SyslogEntity,
          ImageEntity,
          MedicoEntity,
          MensajeEntity,
          QrsEntity,
          CorteTesoreroEntity,
          MuestraEntity,
          ApiKeyEntity,
          TareasEntity,
          UserSucursalesEntity,
          BancoEntity,
          CuentaBancariaEntity,
          GastoEntity,
          TipoCuentaGastoEntity,
          DepartamentoEntity,
          IncidenciaEntity,
          IncidenciaEmpleadoEntity,
          PuestoEntity,
          MovimientoCuentaBanco,
          DocumentoEntity,
          DocumentoEmpleadoEntity,
          DocumentoPuestoEntity,
          IncentivoEntity,
          IncentivoEmpleadoEntity,
          ContratoEntity,
          EsquemaPagoEntity,
          JornadaEntity,
        ],
        synchronize: false,
      }),
    }),
    ScheduleModule.forRoot(),
    RavenModule,
    UsersModule,
    AuthModule,
    SmsModule,
    LocalMailerModule,
    ServiciosModule,
    SucursalesModule,
    GruposServiciosModule,
    TiposUnidadesModule,
    TiposMuestrasModule,
    InsumosModule,
    TiposInsumosModule,
    DashboardModule,
    AlmacenModule,
    VentasModule,
    ClientesModule,
    PagosModule,
    ProveedoresModule,
    PacientesModule,
    CajasModule,
    NotificacionesModule,
    EventsModule,
    LotesModule,
    FacturasModule,
    HeimdalModule,
    PresupuestosModule,
    ComprasModule,
    SyslogModule,
    TesorerosModule,
    PxlabModule,
    MovilModule,
    StripeModule,
    StripeModuleLocal,
    OnlineModule,
    EventEmitterModule.forRoot(),
    MedicosModule,
    MensajesModule,
    ReportesModule,
    EmpleadosModule,
    TareasModule,
    BancosModule,
    RhModule,
    WhatsappModule,
  ],
  providers: [
    SyslogService,
    AppService,
    UsersService,
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => 500 >= exception.getStatus(),
          },
        ],
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
    PacientesService,
    NotificacionesService,
    WhatsappService,
  ],
  controllers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  configure(consumer: MiddlewareConsumer): void {
    ResponseTimeMiddleware.configure({});
    consumer.apply(ResponseTimeMiddleware, XquendaMiddleware).forRoutes('*');
    consumer.apply(SyslogMiddleware).forRoutes('*');
  }
  logger = new MyLogger(AppModule.name);
  async onModuleInit(): Promise<boolean> {
    await this.mailService.init();
    await this.appService.initDatabase();
    //borrar los sockets desde el arranque, cuando es una sola app, o es
    //la instancia cero
    if (
      !process.env.NODE_APP_INSTANCE ||
      process.env.NODE_APP_INSTANCE === '0'
    ) {
      this.logger.log('redis reset!!!!!!!!!!!!!!!!');
      this.cacheManager.del('sockets');
      this.cacheManager.del('monitores');
      this.cacheManager.del('pendientes');
    }
    return true;
  }
}
