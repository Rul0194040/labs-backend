import {
  Body,
  Controller,
  Get,
  Response,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtVentaGuard } from '@sanfrancisco/auth/guards/jwt-venta/jwt-venta.guard';
import { MyLogger } from '@sanfrancisco/logger';
import { EstadosVentas } from '@sanfrancisco/ventas/estadosVentas.enum';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { VentasService } from '@sanfrancisco/ventas/ventas.service';
import { LoginVentaDTO } from './login-venta.dto';
import { SesionVenta } from './venta-sesion.decorator';

@Controller('publico/venta')
export class PublicoController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly jwtService: JwtService,
  ) {}
  private logger = new MyLogger(PublicoController.name);
  /**
   * Inicio de sesion por venta
   * */
  @Post('login')
  async loginPorVenta(@Body() loginVenta: LoginVentaDTO): Promise<{
    access_token: string;
  }> {
    //buscar la venta por el folio y a.internet
    const venta = await this.ventasService.getByFolioAcceso(
      loginVenta.folio,
      loginVenta.acceso,
    );

    if (!venta || venta.estatus === EstadosVentas.CANCELADA) {
      throw new HttpException(
        'La venta no existe o ha sido cancelada.',
        HttpStatus.NOT_FOUND,
      );
    }

    //si la venta existe, crearle sesion y regresarle datos.
    const access_token = this.jwtService.sign(
      { sub: venta.id, uuid: venta.uuid },
      {
        expiresIn: '1h',
      },
    );

    return {
      access_token,
    };
  }

  /**
   * Obtener los datos de una venta en sesion para mostrarla en su "dashboard"
   *
   * @param ventaSesion venta en sesion
   * @returns
   */
  @UseGuards(JwtVentaGuard)
  @Get('dashboard')
  async getInfoVenta(
    @SesionVenta() ventaSesion: Partial<VentaEntity>,
  ): Promise<Partial<VentaEntity>> {
    return await this.ventasService.getByUuid(ventaSesion.uuid);
  }

  /**
   * Obtener los resultados PDF de la venta en sesion
   *
   * @param ventaSesion
   * @param res
   */
  @UseGuards(JwtVentaGuard)
  @Get('resultados')
  async descargarPdfVenta(
    @SesionVenta() ventaSesion: Partial<VentaEntity>,
    @Response() res,
  ) {
    const venta = await this.ventasService.getByUuid(ventaSesion.uuid);

    if (venta.estatus === EstadosVentas.CANCELADA) {
      throw new HttpException(
        'La venta no existe.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    //si la venta no esta pagada
    if (!venta.pagado && !venta.credito) {
      throw new HttpException(
        'La venta aún no ha sido pagada.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (!venta.estudioPx) {
      throw new HttpException(
        'Aún no se cuenta con los estudios para descarga.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const file = this.ventasService.getPdfUrl(venta.uuid);

    res.sendFile(file + '.pdf', {
      root: `./uploads/pxlab`,
    });

    this.logger.log('No implementado!');
  }

  @UseGuards(JwtVentaGuard)
  @Get()
  descargarPdfFactura() {
    this.logger.log('No implementado!');
  }

  @UseGuards(JwtVentaGuard)
  @Get()
  descargarXmlFactura() {
    this.logger.log('No implementado!');
  }

  @UseGuards(JwtVentaGuard)
  @Post()
  guardarDatosFacturacion() {
    this.logger.log('No implementado!');
  }
}
