import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { AgregarPago } from './dtos/agregar-pago.dto';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { PagoEntity } from './pagos.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InformePagosDTO } from './dtos/informe-pagos.dto';
import { HeimdalService } from '../common/heimdal/heimdal.service';
import { ReciboPagosDTO } from './dtos/recibo-pagos.dto';
import { VentasService } from '../ventas/ventas.service';
import { VentaServiciosDTO } from '../ventas/DTOs/venta-servicios.dto';

@Controller('pagos')
@UseGuards(JwtAuthGuard)
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
    private readonly ventasService: VentasService,
    private readonly heimalService: HeimdalService,
  ) {}

  /**
   * Crea un pago
   *
   * @param pago agrega un pago
   * @param user usuairo en sesión para verificar la caja
   * @returns {PagoEntity}
   */
  @Post()
  @RequireRule('create:pago')
  create(
    @Body() pago: AgregarPago,
    @User() user: LoginIdentityDTO,
  ): Promise<InformePagosDTO> {
    return this.pagosService.create(pago, user);
  }

  /**
   * obtiene un pago por id
   *
   * @param id obtiene un pago por id
   * @returns {PagoEntity}
   */
  @Get(':id')
  @RequireRule('view:pago')
  getById(@Param('id', ParseIntPipe) id: number): Promise<PagoEntity> {
    return this.pagosService.getById(id);
  }

  /**
   * Elimina un pago
   *
   * @param id id del pago
   * @returns {DeleteResult}
   */
  @Delete(':id')
  @RequireRule('delete:pago')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.pagosService.delete(id);
  }

  /**
   * Actualiza el estatus de un pago
   *
   * @param id id del pago
   * @param estatus estatus del pago
   * @returns {UpdateResult}
   */
  @Patch(':id')
  @RequireRule('update:pago')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estatus') estatus: number,
  ): Promise<UpdateResult> {
    return this.pagosService.updateStatus(id, estatus);
  }

  /**
   * Cancela el pago
   *
   * @param id id del pago
   * @param motivo motivo de cancelacion
   * @returns {UpdateResult}
   */
  @Put('cancelacion/:id')
  cancelacionPago(
    @Param('id', ParseIntPipe) id: number,
    @Body('motivo') motivo: string,
  ): Promise<UpdateResult> {
    return this.pagosService.cancelacionPago(id, motivo);
  }

  /**
   * Imprimir el recibo por pagos
   *
   * @param id id de la venta a imprimir el recibo
   * @param data Ids de los pagos a imprimir
   */
  @Post('recibo-pago/:ventaId')
  @RequireRule('view:pago')
  async reciboPagos(
    @Param('ventaId', ParseIntPipe) ventaId: number,
    @Body()
    data: {
      pagosId: number[];
    },
  ): Promise<ReciboPagosDTO> {
    const detalleVenta: VentaServiciosDTO =
      await this.ventasService.getDetalleVentaById(ventaId);
    const ticketInfo: ReciboPagosDTO = await this.pagosService.getReciboPagos(
      detalleVenta,
      data.pagosId,
    );
    return ticketInfo;
  }

  /**
   * Abonar pagos al cliente
   *
   * @param clienteId id del cliente
   * @param monto monto a abonar
   * {
   *   monto: 500
   * }
   * @returns {UpdateResult}
   */
  @Put('abonar/cliente/:clienteId')
  abonarPagoCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body('monto', ParseIntPipe) monto: number,
  ): Promise<UpdateResult> {
    return this.pagosService.abonarPagoCliente(clienteId, monto);
  }
}
