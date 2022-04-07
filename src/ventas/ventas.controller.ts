import { updateSeguimientoVenta } from './../pagos/dtos/updateSegumientoVenta.dto';
import { TransaccionDTO } from './DTOs/transaccion.dto';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { InformeFolioDTO } from './DTOs/informe-folio.dto';
import { AsignDetalleDTO } from './DTOs/create-detalle.dto';
import { LoginIdentityDTO } from './../auth/dto/loginIdentity.dto';
import { DetalleVentasInsumosEntity } from './ventasDetalleInsumos.entity';
import { DetalleVentasEntity } from './ventasDetalle.entity';
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Response,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ClienteVentaDTO } from './DTOs/cliente-venta.dto';
import { PacienteVentaDTO } from './DTOs/paciente-venta.dto';
import { CreateVentaDTO } from './DTOs/create-venta.dto';
import { InsumosServicioDTO } from './DTOs/insumos-servicio.dto';
import { EstadosVentas } from './estadosVentas.enum';
import { VentaEntity } from './ventas.entity';
import { VentasService } from './ventas.service';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCreditoDTO } from './DTOs/update-credito.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { VentaServiciosDTO } from './DTOs/venta-servicios.dto';
import { HeimdalService } from '../common/heimdal/heimdal.service';
import { TicketVentaDTO } from './DTOs/ticket-venta.dto';
import { VentaDetalleInsumosDTO } from './DTOs/venta-detalle-insumos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { PacienteEntity } from '../pacientes/pacientes.entity';
import { ClienteEntity } from '../clientes/clientes.entity';
import {
  AutorizarDescuentoDTO,
  AutorizarDescuentoResponseDTO,
} from './DTOs/autorizar-descuento.dto';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { SendEmailResultadosDTO } from './DTOs/send-email-resultados.dto';
import { MaquiladorVentaDTO } from './DTOs/maquilador-venta.dto';
import { CaptadorVentaDTO } from './DTOs/captador-venta.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { VendedorVentaDTO } from './DTOs/vendedor-venta.dto';
import { WhatsappService } from '@sanfrancisco/whatsapp/whatsapp.service';
import { MyLogger } from '@sanfrancisco/logger';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';

@ApiBearerAuth()
@ApiTags('ventas')
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  private logger = new MyLogger(VentasController.name);
  constructor(
    private readonly ventasService: VentasService,
    private readonly heimalService: HeimdalService,
    private readonly mailSenderService: MailService,
    private readonly whatsapService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Pagina las ventas
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns ventas paginados
   */
  @Post('paginate/:cajaId')
  @RequireRule('view:ventas')
  paginate(
    @Param('cajaId', ParseIntPipe) cajaId: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.paginate(cajaId, options);
  }

  /**
   * Pagina las ventas
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns ventas paginados
   */
  @Post('seguimiento-venta/paginate')
  @RequireRule('view:ventas')
  paginateSegumiento(
    @Body() options: PaginationOptions,
    @User() user: LoginIdentityDTO,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.paginateSeguimientoVenta(user, options);
  }

  /**
   * Pagina las ventas con clientes
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns ventas paginadas
   */
  @Post('paginate/clientes/registrados')
  @RequireRule('view:ventas')
  paginateVentasClientes(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.paginateVentasClientes(options);
  }

  /**
   *Obtiene el detalle de la venta por su id
   * @param ventaId
   */
  @Get('detalle-venta/:detalleVentaId')
  @RequireRule('view:ventas')
  getDetalleVentaPorId(
    @Param('detalleVentaId') detalleVentaId: number,
  ): Promise<DetalleVentasEntity> {
    return this.ventasService.getDetalleVentaPorId(detalleVentaId);
  }

  /**
   *agregar uno a varios insumos a un detalle de venta (servicio/estudio)
   *y afectar los totales de dichos insumos en la sucursal
   *
   *
   * @param ventaDetalleId
   * @param detalles
   * @param user
   */
  @Post('asignacion/detalle-insumos/:ventaDetalleId')
  @RequireRule('view:ventas')
  insumosADetalle(
    @Param('ventaDetalleId') ventaDetalleId: number,
    @Body('detalles') detalles: InsumosServicioDTO[],
    @User() user: LoginIdentityDTO,
  ): Promise<DetalleVentasInsumosEntity[]> {
    return this.ventasService.insumosADetalle(detalles, ventaDetalleId, user);
  }

  /**
   * borra uno a varios insumos a un detalle de venta (servicio/estudio)
   *y afectar los totales de dichos insumos en la sucursal
   *
   *
   * @param VentasInsumoId
   */
  @Put('borrado/detalle-insumos/:VentasInsumoId')
  @RequireRule('view:ventas')
  insumosFueraDetalle(
    @Param('VentasInsumoId') VentasInsumoId: number,
  ): Promise<UpdateResult> {
    return this.ventasService.insumosADetalleRetiro(VentasInsumoId);
  }

  /**
   *Obtiene el detalle de la venta y sus insumos por el id de la venta
   * @param ventaId
   */
  @Get('detalle-insumos/:ventaId')
  @RequireRule('view:ventas')
  getInsumoDetallePorVenta(
    @Param('ventaId') ventaId: number,
  ): Promise<VentaDetalleInsumosDTO[]> {
    return this.ventasService.getInsumoDetallePorVenta(ventaId);
  }

  /**
   *Obtiene los insumos de un detalle de venta por el id
   * @param detalleVentaId
   */
  @Get('detalle-venta-insumos/:detalleVentaId')
  @RequireRule('view:ventas')
  getInsumosPorDetalleVenta(
    @Param('detalleVentaId') detalleVentaId: number,
  ): Promise<DetalleVentasInsumosEntity[]> {
    return this.ventasService.getInsumosPorDetalleVenta(detalleVentaId);
  }

  /**
   * Actualizar el estado de un detalle venta
   * @param detalleVentaId
   */
  @Patch('detalle-venta-estado/:detalleVentaId')
  updateEstadoDetalleVenta(
    @Param('detalleVentaId') detalleVentaId: number,
  ): Promise<boolean> {
    return this.ventasService.updateEstadoDetalleVenta(detalleVentaId);
  }

  /**
   * Actualizar el estado de todos los detalle venta
   * @param detalleVentaId
   */
  @Patch('detalles-venta-estado/:ventaId')
  updateEstadosDetalleVenta(
    @Param('ventaId') ventaId: number,
    @Body('estado') estado: boolean,
  ): Promise<VentaDetalleInsumosDTO[]> {
    return this.ventasService.updateEstadosDetalleVenta(ventaId, estado);
  }

  /**
   * Enviar interaccion con whatsapp de la venta, obtener el paciente y enviar a su numero de telefono
   *
   * @param detalleVentaId
   */
  @Patch(':ventaId/interaccion-whatsapp')
  async interaccionWhatsapp(@Param('ventaId') ventaId: number): Promise<any> {
    //obtener venta y paciente
    const venta = await this.ventasService.getById(ventaId);
    if (!venta.paciente.telefono) {
      return false;
    }
    const prefix = this.configService.get<string>(ConfigKeys.WACHABOT_PREFIX);
    const nombreEmpresa = this.configService.get<string>(
      ConfigKeys.WACHABOT_EMPRESA,
    );
    const mensaje = `Hola ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno}
    
Nos comunicamos de *${nombreEmpresa}* para agradecer su preferencia.
    
Que tenga un excelente día.`;
    const result = await this.whatsapService.send(
      mensaje,
      `${prefix}${venta.paciente.telefono}`,
    );
    this.logger.log('Mensaje interaccion:::' + mensaje);
    this.logger.log(
      `Envio interaccion-whatsapp :: ${prefix}${venta.paciente.telefono} ` +
        JSON.stringify(result),
    );
    return result;
  }

  /**
   * Enviar interaccion con whatsapp de la venta, obtener el paciente y enviar a su numero de telefono
   *
   * @param detalleVentaId
   */
  @Patch(':ventaId/encuesta-whatsapp')
  async encuestaWhatsapp(@Param('ventaId') ventaId: number): Promise<any> {
    //obtener venta y paciente
    const venta = await this.ventasService.getById(ventaId);
    if (!venta.paciente.telefono) {
      return false;
    }

    const prefix = this.configService.get<string>(ConfigKeys.WACHABOT_PREFIX);
    const nombreEmpresa = this.configService.get<string>(
      ConfigKeys.WACHABOT_EMPRESA,
    );
    const urlEncuesta = 'https://forms.gle/sdxkVFKJTaptFhGGA';
    const mensaje = `Hola ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno} en *${nombreEmpresa}* agradecemos su preferencia, esperamos pueda tomar dos minutos de su tiempo para responder una breve encuesta de satisfacción: ${urlEncuesta} 
    
Su participación nos permite brindarle un mejor servicio. 
    
¡Muchas gracias!`;
    const result = await this.whatsapService.send(
      mensaje,
      `${prefix}${venta.paciente.telefono}`,
    );
    this.logger.log('Mensaje encuesta-whatsapp:::' + mensaje);
    this.logger.log(
      `Envio encuesta-whatsapp :: ${prefix}${venta.paciente.telefono} ` +
        JSON.stringify(result),
    );
    return result;
  }

  /**
   * Asigna paciente al detalle de la venta
   * y a la venta
   *
   * @tests []
   * @param {PacienteServicioDTO} asignacion
   * @returns {UpdateResult}
   */
  @Post('asignacion/detalle')
  CreateDetalle(
    @Body() asignacion: AsignDetalleDTO,
  ): Promise<DetalleVentasEntity> {
    return this.ventasService.CreateDetalle(asignacion);
  }

  /**
   * Remueve al cliente de la venta
   *
   * @tests []
   * @param id de la venta donde esta el cliente
   * @returns {DeleteResult}
   */
  @Put('remover/cliente-venta/:id')
  removeCliente(@Param('id') id: number): Promise<UpdateResult> {
    return this.ventasService.removeCliente(id);
  }

  /**
   * Finaliza la venta atraves de las reglas correspondientes
   *
   * @tests []
   * @param id de la venta donde esta el cliente
   * @returns {DeleteResult}
   */
  @Put('finalizar/:ventaId')
  finalizarVenta(@Param('ventaId') ventaId: number): Promise<UpdateResult> {
    return this.ventasService.FinalizadoVenta(ventaId);
  }

  /**
   * Actualiza el efectivo recibido y el cambio
   *
   * @tests []
   * @param id de la venta
   * @returns {UpdateResult}
   */
  @Put('hacer-transaccion/:id')
  Transaccion(
    @Param('id') id: number,
    @Body() montos: TransaccionDTO,
  ): Promise<UpdateResult> {
    return this.ventasService.updateTransaccion(id, montos);
  }

  /**
   * Remueve un detalle de venta
   *
   * @tests []
   * @param id de la venta donde esta el cliente
   * @returns {DeleteResult}
   */
  @Delete('remover/detalle/:id')
  removeDetalle(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.ventasService.removeDetalle(id);
  }

  /**
   * asigna clientes a la venta creada
   *
   * @tests []
   * @param {PacienteVentaDTO} asignacion objeto asignador del cliente a la venta
   * @returns {UpdateResult}
   */
  @Put('asignacion/cliente-venta')
  clienteAVenta(@Body() asignacion: ClienteVentaDTO): Promise<ClienteEntity> {
    return this.ventasService.ClienteAVenta(asignacion);
  }

  /**
   * asigna maquilador a la venta creada
   *
   * @tests []
   * @param {MaquiladorVentaDTO} asignacion objeto asignador del cliente a la venta
   * @returns {UpdateResult}
   */
  @Put('asignacion/maquilador-venta')
  maquiladorAVenta(
    @Body() asignacion: MaquiladorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    return this.ventasService.MaquiladorAVenta(asignacion);
  }

  /**
   * asigna captador a la venta creada
   *
   * @tests []
   * @param {CaptadorVentaDTO} asignacion objeto asignador del captador a la venta
   * @returns {UpdateResult}
   */
  @Put('asignacion/captador-venta')
  captadorAVenta(
    @Body() asignacion: CaptadorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    return this.ventasService.CaptadorAVenta(asignacion);
  }

  /**
   * asigna vendedor a la venta creada
   *
   * @tests []
   * @param {VendedorVentaDTO} asignacion objeto asignador del vendedor a la venta
   * @returns {UpdateResult}
   */
  @Put('asignacion/vendedor-venta')
  vendedorAVenta(
    @Body() asignacion: VendedorVentaDTO,
  ): Promise<Partial<UsersEntity>> {
    return this.ventasService.VendedorAVenta(asignacion);
  }

  /**
   * asigna pacientes a la venta creada
   *
   * @tests []
   * @param {PacienteVentaDTO} asignacion objeto asignador del cliente a la venta
   * @returns {UpdateResult}
   */
  @Put('asignacion/paciente-venta')
  PacienteAVenta(
    @Body() asignacion: PacienteVentaDTO,
  ): Promise<PacienteEntity> {
    return this.ventasService.PacienteAVenta(asignacion);
  }

  /**
   * Crear una venta
   *
   * @param venta datos de la venta
   * @param user Usuario en sesión
   * @returns {VentaEntity}
   */
  @Post()
  @RequireRule('create:ventas')
  create(
    @Body() venta: CreateVentaDTO,
    @User() user: LoginIdentityDTO,
  ): Promise<VentaEntity> {
    return this.ventasService.create(venta, user);
  }

  /**
   * Busca un un objeto venta por id
   * @tests []
   * @param id del objeto venta buscado
   * @returns venta creado
   */
  @Get(':id')
  @RequireRule('view:ventas')
  getById(@Param('id', ParseIntPipe) id: number): Promise<VentaEntity> {
    return this.ventasService.getById(id);
  }

  /**
   * Busca todas las ventas a crédito de un cliente
   * @param clienteId del cliente
   * @returns Ventas a crédito del cliente
   */
  @Post('credito/clientes/:clienteId')
  @RequireRule('view:ventas')
  getVentasCreditoCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.getVentasCreditoCliente(clienteId, options);
  }

  /**
   * Regresa los pagos de una venta
   * @tests []
   * @param id del objeto venta buscado
   * @returns venta creado
   */
  @Get('pagos/:ventaId')
  @RequireRule('view:ventas')
  getpagosByVentas(
    @Param('ventaId', ParseIntPipe) ventaId: number,
  ): Promise<PagoEntity[]> {
    return this.ventasService.getPagosByVenta(ventaId);
  }

  /**
   *solicita cancelar una venta
   * @tests []
   * @param id del objeto venta buscado
   * @returns venta creado
   */
  @Put('solicitar-cancelacion/:ventaId')
  @RequireRule('view:ventas')
  solicitarCancelacion(
    @Param('ventaId', ParseIntPipe) ventaId: number,
    @Body('motivoCancelacion') motivoCancelacion: string,
  ): Promise<UpdateResult> {
    return this.ventasService.solicitarCancelacion(ventaId, motivoCancelacion);
  }

  /**
   * Busca un un objeto venta por id y devolver su detalle y detalle ventas
   * @param id del objeto venta buscado
   * @returns venta creado y su detalle venta
   */
  @Get(':id/detalle-servicios')
  @RequireRule('view:ventas')
  getDetalleVentaById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VentaServiciosDTO> {
    return this.ventasService.getDetalleVentaById(id);
  }

  /**
   * Busca un un objeto venta por id
   * @tests []
   * @param id del objeto venta buscado
   * @returns venta creado
   */
  @Get('folio/:folioId')
  @RequireRule('view:ventas')
  async getventaByFolio(
    @Param('folioId') folioId: string,
  ): Promise<InformeFolioDTO> {
    return await this.ventasService.getventaByFolio(folioId);
  }

  /**
   * Actualizar el estado del objeto venta
   * @tests []
   * @param id del objeto venta
   * @param status referencia al valor del campo
   * @returns objeto con el status actualizado
   */
  @Patch(':id/status')
  @RequireRule('update:ventas')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: EstadosVentas,
  ): Promise<UpdateResult> {
    return this.ventasService.updateStatus(id, status);
  }

  /**
   * Actualizar un objeto venta
   * @tests []
   * @param id del objeto a actualziar
   * @returns el nuevo objeto venta
   */
  @Patch(':id')
  @RequireRule('delete:ventas')
  updateVenta(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: VentaEntity,
  ): Promise<VentaEntity> {
    return this.ventasService.updateVenta(id, body);
  }

  /**
   * Borrar un objeto venta
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  @RequireRule('delete:ventas')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.ventasService.delete(id);
  }

  @Put(':id')
  updateCredito(
    @Param('id') id: number,
    @Body() credito: UpdateCreditoDTO,
  ): Promise<UpdateResult> {
    return this.ventasService.updateCredito(id, credito);
  }

  /**
   * Imprimir el ticket de una venta
   *
   * @param id id de la venta a imprimir el ticket
   */
  @Get('ticket-venta/:id')
  @RequireRule('view:ventas')
  async ticket(@Param('id', ParseIntPipe) id: number): Promise<TicketVentaDTO> {
    return await this.ventasService.getTicketVenta(id);
  }

  /**
   * Autorizar un descuento a una venta
   *
   * @param ventaId id de la venta a autorizar descuento
   * @param user usuario en sesion
   * @param data datos {nip, maximo descuento}
   * @returns {UpdateResult}
   */
  @Put('autorizar/descuento/:ventaId')
  autorizarDescuento(
    @Param('ventaId', ParseIntPipe) ventaId: number,
    @Body() data: AutorizarDescuentoDTO,
  ): Promise<AutorizarDescuentoResponseDTO> {
    return this.ventasService.autorizarDescuento(ventaId, data);
  }

  /**
   * Pagina las ventas con clientes
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns ventas paginadas
   */
  @Post('paginate/paciente/vencidos')
  paginateVentasPaciente(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.paginateVentasPaciente(options);
  }

  /**
   * Imprimir la cotización de una venta
   *
   * @param id id de la venta a imprimir la cotización
   */
  @Get('cotizacion-venta/:id')
  @RequireRule('view:ventas')
  async cotizacion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TicketVentaDTO> {
    return await this.ventasService.getTicketVenta(id);
  }

  //FIXME: paginar para movil
  @Post('movil/paginate')
  @RequireRule('view:ventas')
  paginateMovil(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.ventasService.paginateMovil(options);
  }

  @Patch('update/seguimiento-venta/:ventaId')
  updateSeguimientoVenta(
    @Param('ventaId') ventaId: number,
    @Body() pago: updateSeguimientoVenta,
  ): Promise<UpdateResult> {
    return this.ventasService.updateSeguimientoVenta(ventaId, pago);
  }

  /**
   * Subir archivo resultado del paciente
   *
   * @param folioPxLab el archivo a usar
   */
  @Post('UpdateResultado/:folioPxLab')
  @UseInterceptors(
    FileInterceptor('folioPxLab', {
      limits: {
        fileSize: 1024 * 1024 * 3, //tamaño de archivo hasta 3MB //TODO: deberia venir de config
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          file.originalname.split('.').reverse()[0] === 'pdf'
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente "application/pdf".',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folio = req.params.folioPxLab;
          const dirPath = './uploads/resultados'; //TODO: deberia venir de config
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          if (existsSync(`${dirPath}/${folio}.pdf`)) {
            unlinkSync(`${dirPath}/${folio}.pdf`);
          }
          cb(null, dirPath);
        },
        filename: (req, file, cb) => {
          const folio = req.params.folioPxLab;
          const fileNameDest = `${folio}.pdf`;
          cb(null, fileNameDest);
        },
      }),
    }),
  )
  async uploadAvatar(@UploadedFile() file): Promise<any> {
    return file;
  }

  /**
   * Obtener pdf de resultados de una venta.
   */
  @Get(':uuid/pdf/resultados')
  async getPdf(@Param('uuid') uuid: string, @Response() res) {
    const file = await this.ventasService.getPdfUrl(uuid);
    res.sendFile(file + '.PDF', {
      root: `./uploads/pxlab`,
    });
  }

  /**
   * Enviar por email el pdf de resultados de una venta.
   */
  @Put(':uuid/pdf/send')
  async emailPdfPaciente(
    @Param('uuid') uuid: string,
    @Body() data: SendEmailResultadosDTO,
  ) {
    const venta = await this.ventasService.getByUuid(uuid);
    const file = await this.ventasService.getPdfUrl(uuid);
    this.mailSenderService.send(
      {
        to: data.email,
        subject: `Resultados de Laboratorio, Paciente: ${venta.paciente.nombre} ${venta.paciente.apellidoPaterno} ${venta.paciente.apellidoMaterno}`,
        attachments: [
          {
            path: './uploads/pxlab/' + file + '.PDF',
          },
        ],
      },
      'ventas/envio-estudios-paciente',
      {
        venta,
      },
    );
    //TODO: añadir a bitacora de venta.
  }

  @Get('catalogos/captadores')
  getMaquiladoresVendedoresCaptadores(): Promise<{
    maquiladores: Partial<UsersEntity>[];
    vendedores: Partial<UsersEntity>[];
    captadores: Partial<UsersEntity>[];
  }> {
    return this.ventasService.getMaquiladoresVendedoresCaptadores();
  }
}
