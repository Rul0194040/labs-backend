import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTipoCuentaGastoDTO } from '../dto/create-tipo-cuenta-gasto.dto';
import { UpdateTipoCuentaGastoDTO } from '../dto/update-tipo-cuenta-gasto.dto';
import { TipoCuentaGastoEntity } from '../entities/tipos-cuenta-gasto.entity';
import { BancosService } from '../bancos.service';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';

@Controller('tipos-cuentas-gasto')
export class TiposCuentasGastoController {
  constructor(private readonly bancosService: BancosService) {}

  /**
   * Creat un tipo de cuenta de gasto
   *
   * @param tipoCuentaGasto datos del tipo cuenta gasto
   * @returns {TipoCuentaGastoEntity}
   */
  @Post()
  crearTipoCuentaGasto(
    @Body() tipoCuentaGasto: CreateTipoCuentaGastoDTO,
  ): Promise<TipoCuentaGastoEntity> {
    return this.bancosService.crearTipoCuentaGasto(tipoCuentaGasto);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.bancosService.cuentaGastoPaginate(options);
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {TipoCuentaGastoEntity}
   */
  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TipoCuentaGastoEntity> {
    return this.bancosService.getCuentaGastoById(id);
  }

  /**
   * Actualiza un tipo cuenta gasto
   *
   * @param id id del tipo cuenta gasto
   * @param tipoCuentaGastos datos a actualizar
   * @returns {UpdateResult}
   */
  @Put(':id')
  actualizarTipoCuentaGasto(
    @Param('id', ParseIntPipe) id: number,
    @Body() tipoCuentaGastos: UpdateTipoCuentaGastoDTO,
  ): Promise<UpdateResult> {
    return this.bancosService.actualizarTipoCuentaGasto(id, tipoCuentaGastos);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {DeleteResult}
   */
  @Delete(':cuentaG')
  deleteEmpleado(
    @Param('cuentaG', ParseIntPipe) cuentaG: number,
  ): Promise<DeleteResult> {
    return this.bancosService.delete(cuentaG);
  }
}
