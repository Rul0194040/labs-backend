"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const muestras_entity_1 = require("./ventas/muestras/muestras.entity");
const cortesTesorero_entity_1 = require("./tesoreros/cortesTesorero/cortesTesorero.entity");
const image_entity_1 = require("./images/model/image.entity");
const servicios_insumos_entity_1 = require("./servicios/servicios-insumos.entity");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("./common/enum/configkeys.enum");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const app_service_1 = require("./app.service");
const users_service_1 = require("./users/users.service");
const users_entity_1 = require("./users/users.entity");
const nest_raven_1 = require("nest-raven");
const response_time_1 = require("@nest-middlewares/response-time");
const app_config_1 = require("./app.config");
const email_module_1 = require("./common/services/mailer/email.module");
const sucursal_entity_1 = require("./sucursales/sucursal.entity");
const sucursales_module_1 = require("./sucursales/sucursales.module");
const sms_module_1 = require("./common/services/sms/sms.module");
const servicios_module_1 = require("./servicios/servicios.module");
const grupos_servicios_module_1 = require("./catalogos/grupos-servicios/grupos-servicios.module");
const tipos_unidades_module_1 = require("./catalogos/tipos-unidades/tipos-unidades.module");
const tipos_muestras_module_1 = require("./catalogos/tipos-muestras/tipos-muestras.module");
const insumos_module_1 = require("./insumos/insumos.module");
const tipos_insumos_module_1 = require("./catalogos/tipos-insumos/tipos-insumos.module");
const insumo_entity_1 = require("./insumos/insumo.entity");
const servicio_entity_1 = require("./servicios/servicio.entity");
const tipo_insumo_entity_1 = require("./catalogos/tipos-insumos/tipo-insumo.entity");
const tipos_unidades_entity_1 = require("./catalogos/tipos-unidades/tipos-unidades.entity");
const tipos_muestras_entity_1 = require("./catalogos/tipos-muestras/tipos-muestras.entity");
const grupo_servicio_entity_1 = require("./catalogos/grupos-servicios/grupo-servicio.entity");
const nestjs_rate_limiter_1 = require("nestjs-rate-limiter");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const almacen_module_1 = require("./almacen/almacen.module");
const ventas_module_1 = require("./ventas/ventas.module");
const clientes_module_1 = require("./clientes/clientes.module");
const detalleMovimientos_entity_1 = require("./almacen/detalleMovimientos.entity");
const movimientosAlmacen_entity_1 = require("./almacen/movimientosAlmacen.entity");
const sucursalesInsumos_entity_1 = require("./sucursales/sucursalesInsumos.entity");
const ventasDetalle_entity_1 = require("./ventas/ventasDetalle.entity");
const ventas_entity_1 = require("./ventas/ventas.entity");
const pagos_module_1 = require("./pagos/pagos.module");
const pagos_entity_1 = require("./pagos/pagos.entity");
const cajas_entity_1 = require("./cajas/cajas.entity");
const pacientes_entity_1 = require("./pacientes/pacientes.entity");
const proveedores_entity_1 = require("./catalogos/proveedores/proveedores.entity");
const proveedores_module_1 = require("./catalogos/proveedores/proveedores.module");
const pacientes_service_1 = require("./pacientes/pacientes.service");
const pacientes_module_1 = require("./pacientes/pacientes.module");
const clientes_entity_1 = require("./clientes/clientes.entity");
const xquenda_middleware_1 = require("./common/filters/xquenda.middleware");
const cajas_module_1 = require("./cajas/cajas.module");
const direccionesFiscales_entity_1 = require("./ventas/direcciones-fiscales/direccionesFiscales.entity");
const notificaciones_module_1 = require("./notificaciones/notificaciones.module");
const notificaciones_service_1 = require("./notificaciones/notificaciones.service");
const notificaciones_entity_1 = require("./notificaciones/notificaciones.entity");
const events_module_1 = require("./events/events.module");
const movimientos_caja_entity_1 = require("./cajas/movimientos-caja.entity");
const email_service_1 = require("./common/services/mailer/email.service");
const lotes_module_1 = require("./lotes/lotes.module");
const lotes_entity_1 = require("./lotes/lotes.entity");
const ventasDetalleInsumos_entity_1 = require("./ventas/ventasDetalleInsumos.entity");
const facturas_entity_1 = require("./facturas/facturas.entity");
const facturas_module_1 = require("./facturas/facturas.module");
const heimdal_module_1 = require("./common/heimdal/heimdal.module");
const presupuestos_module_1 = require("./presupuestos/presupuestos.module");
const compras_entity_1 = require("./compras/compras.entity");
const detallesCompras_entity_1 = require("./compras/detallesCompras.entity");
const presupuesto_entity_1 = require("./presupuestos/presupuesto.entity");
const presupuestosDetalle_entity_1 = require("./presupuestos/presupuestosDetalle.entity");
const compras_module_1 = require("./compras/compras.module");
const pagosProveedores_entity_1 = require("./compras/pagosProveedores.entity");
const syslog_module_1 = require("./syslog/syslog.module");
const syslog_service_1 = require("./syslog/syslog.service");
const syslog_entity_1 = require("./syslog/syslog.entity");
const syslog_middleware_1 = require("./common/filters/syslog.middleware");
const tesoreros_module_1 = require("./tesoreros/tesoreros.module");
const pxlab_module_1 = require("./pxlab/pxlab.module");
const movil_module_1 = require("./movil/movil.module");
const nestjs_stripe_1 = require("nestjs-stripe");
const stripe_module_1 = require("./stripe/stripe.module");
const medicos_module_1 = require("./medicos/medicos.module");
const medico_entity_1 = require("./medicos/medico.entity");
const online_module_1 = require("./online/online.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const mensajes_module_1 = require("./mensajes/mensajes.module");
const mensaje_entity_1 = require("./mensajes/mensaje.entity");
const reportes_module_1 = require("./reportes/reportes.module");
const empleados_module_1 = require("./empleados/empleados.module");
const qrs_entity_1 = require("./empleados/qrs/qrs.entity");
const api_keys_entity_1 = require("./sucursales/api-keys.entity");
const tareas_entity_1 = require("./pxlab/tareas.entity");
const schedule_1 = require("@nestjs/schedule");
const tareas_module_1 = require("./tareas/tareas.module");
const userSucursales_entity_1 = require("./users/userSucursales.entity");
const bancos_module_1 = require("./bancos/bancos.module");
const rh_module_1 = require("./rh/rh.module");
const banco_entity_1 = require("./bancos/entities/banco.entity");
const cuenta_bancaria_entity_1 = require("./bancos/entities/cuenta-bancaria.entity");
const gasto_entity_1 = require("./bancos/entities/gasto.entity");
const tipos_cuenta_gasto_entity_1 = require("./bancos/entities/tipos-cuenta-gasto.entity");
const movimientos_bancos_entity_1 = require("./bancos/entities/movimientos-bancos.entity");
const incentivos_empleados_entity_1 = require("./rh/incentivos/entity/incentivos-empleados.entity");
const documento_entity_1 = require("./rh/documentos/entity/documento.entity");
const documentos_empleados_entity_1 = require("./rh/documentos/entity/documentos-empleados.entity");
const documentos_puesto_entity_1 = require("./rh/documentos/entity/documentos-puesto.entity");
const incentivos_entity_1 = require("./rh/incentivos/entity/incentivos.entity");
const incidencias_entity_1 = require("./rh/incidencias/entity/incidencias.entity");
const incidenciasEmpleados_entity_1 = require("./rh/incidencias/entity/incidenciasEmpleados.entity");
const departamento_entity_1 = require("./rh/puestos-departamentos/entity/departamento.entity");
const puesto_entity_1 = require("./rh/puestos-departamentos/entity/puesto.entity");
const contrato_entity_1 = require("./rh/contrato/entity/contrato.entity");
const esquema_pago_entity_1 = require("./rh/esquema-pago.entity");
const jornada_entity_1 = require("./rh/jornada.entity");
const redisStore = require("cache-manager-redis-store");
const logger_1 = require("./logger");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const whatsapp_service_1 = require("./whatsapp/whatsapp.service");
const axios_1 = require("@nestjs/axios");
let AppModule = AppModule_1 = class AppModule {
    constructor(appService, mailService, cacheManager) {
        this.appService = appService;
        this.mailService = mailService;
        this.cacheManager = cacheManager;
        this.logger = new logger_1.MyLogger(AppModule_1.name);
    }
    configure(consumer) {
        response_time_1.ResponseTimeMiddleware.configure({});
        consumer.apply(response_time_1.ResponseTimeMiddleware, xquenda_middleware_1.XquendaMiddleware).forRoutes('*');
        consumer.apply(syslog_middleware_1.SyslogMiddleware).forRoutes('*');
    }
    async onModuleInit() {
        await this.mailService.init();
        await this.appService.initDatabase();
        if (!process.env.NODE_APP_INSTANCE ||
            process.env.NODE_APP_INSTANCE === '0') {
            this.logger.log('redis reset!!!!!!!!!!!!!!!!');
            this.cacheManager.del('sockets');
            this.cacheManager.del('monitores');
            this.cacheManager.del('pendientes');
        }
        return true;
    }
};
AppModule = AppModule_1 = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule,
            nestjs_rate_limiter_1.RateLimiterModule.register({
                points: 360,
                duration: 60,
                whiteList: ['127.0.0.1', '::1', '::ffff:127.0.0.1'],
                maxQueueSize: 300,
                errorMessage: 'Ha sobrepasado el limite de solicitudes',
            }),
            config_1.ConfigModule.forRoot(app_config_1.AppConfig),
            nestjs_stripe_1.StripeModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    apiKey: configService.get(configkeys_enum_1.ConfigKeys.STRIPE_SECRET),
                    apiVersion: '2020-08-27',
                }),
            }),
            common_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    store: redisStore,
                    host: configService.get(configkeys_enum_1.ConfigKeys.REDIS_HOST),
                    port: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PORT),
                    db: configService.get(configkeys_enum_1.ConfigKeys.REDIS_DB),
                    password: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PASSWORD),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get(configkeys_enum_1.ConfigKeys.MYSQL_HOST),
                    port: parseInt(configService.get(configkeys_enum_1.ConfigKeys.MYSQL_PORT)),
                    username: configService.get(configkeys_enum_1.ConfigKeys.MYSQL_USER),
                    password: configService.get(configkeys_enum_1.ConfigKeys.MYSQL_PASSWORD),
                    database: configService.get(configkeys_enum_1.ConfigKeys.MYSQL_DB),
                    entities: [
                        users_entity_1.UsersEntity,
                        sucursal_entity_1.SucursalEntity,
                        insumo_entity_1.InsumoEntity,
                        servicio_entity_1.ServicioEntity,
                        tipo_insumo_entity_1.TipoInsumoEntity,
                        tipos_unidades_entity_1.TipoUnidadEntity,
                        tipos_muestras_entity_1.TipoMuestraEntity,
                        grupo_servicio_entity_1.GrupoServicioEntity,
                        servicios_insumos_entity_1.ServiciosInsumosEntity,
                        movimientosAlmacen_entity_1.MovimientosAlmacenEntity,
                        detalleMovimientos_entity_1.DetalleMovimientosEntity,
                        sucursalesInsumos_entity_1.SucursalesInsumosEntity,
                        ventas_entity_1.VentaEntity,
                        ventasDetalle_entity_1.DetalleVentasEntity,
                        clientes_entity_1.ClienteEntity,
                        pagos_entity_1.PagoEntity,
                        cajas_entity_1.CajaEntity,
                        movimientos_caja_entity_1.MovimientoCajaEntity,
                        pacientes_entity_1.PacienteEntity,
                        proveedores_entity_1.ProveedorEntity,
                        direccionesFiscales_entity_1.DireccionFiscalEntity,
                        notificaciones_entity_1.NotificacionEntity,
                        lotes_entity_1.LoteEntity,
                        ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity,
                        facturas_entity_1.FacturaEntity,
                        presupuestosDetalle_entity_1.PresupuestoDetalleEntity,
                        presupuesto_entity_1.PresupuestoEntity,
                        compras_entity_1.CompraEntity,
                        detallesCompras_entity_1.DetalleCompraEntity,
                        pagosProveedores_entity_1.PagoProveedorEntity,
                        syslog_entity_1.SyslogEntity,
                        image_entity_1.ImageEntity,
                        medico_entity_1.MedicoEntity,
                        mensaje_entity_1.MensajeEntity,
                        qrs_entity_1.QrsEntity,
                        cortesTesorero_entity_1.CorteTesoreroEntity,
                        muestras_entity_1.MuestraEntity,
                        api_keys_entity_1.ApiKeyEntity,
                        tareas_entity_1.TareasEntity,
                        userSucursales_entity_1.UserSucursalesEntity,
                        banco_entity_1.BancoEntity,
                        cuenta_bancaria_entity_1.CuentaBancariaEntity,
                        gasto_entity_1.GastoEntity,
                        tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity,
                        departamento_entity_1.DepartamentoEntity,
                        incidencias_entity_1.IncidenciaEntity,
                        incidenciasEmpleados_entity_1.IncidenciaEmpleadoEntity,
                        puesto_entity_1.PuestoEntity,
                        movimientos_bancos_entity_1.MovimientoCuentaBanco,
                        documento_entity_1.DocumentoEntity,
                        documentos_empleados_entity_1.DocumentoEmpleadoEntity,
                        documentos_puesto_entity_1.DocumentoPuestoEntity,
                        incentivos_entity_1.IncentivoEntity,
                        incentivos_empleados_entity_1.IncentivoEmpleadoEntity,
                        contrato_entity_1.ContratoEntity,
                        esquema_pago_entity_1.EsquemaPagoEntity,
                        jornada_entity_1.JornadaEntity,
                    ],
                    synchronize: false,
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            nest_raven_1.RavenModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            sms_module_1.SmsModule,
            email_module_1.LocalMailerModule,
            servicios_module_1.ServiciosModule,
            sucursales_module_1.SucursalesModule,
            grupos_servicios_module_1.GruposServiciosModule,
            tipos_unidades_module_1.TiposUnidadesModule,
            tipos_muestras_module_1.TiposMuestrasModule,
            insumos_module_1.InsumosModule,
            tipos_insumos_module_1.TiposInsumosModule,
            dashboard_module_1.DashboardModule,
            almacen_module_1.AlmacenModule,
            ventas_module_1.VentasModule,
            clientes_module_1.ClientesModule,
            pagos_module_1.PagosModule,
            proveedores_module_1.ProveedoresModule,
            pacientes_module_1.PacientesModule,
            cajas_module_1.CajasModule,
            notificaciones_module_1.NotificacionesModule,
            events_module_1.EventsModule,
            lotes_module_1.LotesModule,
            facturas_module_1.FacturasModule,
            heimdal_module_1.HeimdalModule,
            presupuestos_module_1.PresupuestosModule,
            compras_module_1.ComprasModule,
            syslog_module_1.SyslogModule,
            tesoreros_module_1.TesorerosModule,
            pxlab_module_1.PxlabModule,
            movil_module_1.MovilModule,
            nestjs_stripe_1.StripeModule,
            stripe_module_1.StripeModuleLocal,
            online_module_1.OnlineModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            medicos_module_1.MedicosModule,
            mensajes_module_1.MensajesModule,
            reportes_module_1.ReportesModule,
            empleados_module_1.EmpleadosModule,
            tareas_module_1.TareasModule,
            bancos_module_1.BancosModule,
            rh_module_1.RhModule,
            whatsapp_module_1.WhatsappModule,
        ],
        providers: [
            syslog_service_1.SyslogService,
            app_service_1.AppService,
            users_service_1.UsersService,
            config_1.ConfigService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useValue: new nest_raven_1.RavenInterceptor({
                    filters: [
                        {
                            type: common_1.HttpException,
                            filter: (exception) => 500 >= exception.getStatus(),
                        },
                    ],
                }),
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: nestjs_rate_limiter_1.RateLimiterInterceptor,
            },
            pacientes_service_1.PacientesService,
            notificaciones_service_1.NotificacionesService,
            whatsapp_service_1.WhatsappService,
        ],
        controllers: [],
    }),
    __param(2, common_1.Inject(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [app_service_1.AppService,
        email_service_1.MailService, Object])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map