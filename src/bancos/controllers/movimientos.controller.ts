import { UpdateMovimientoDTO } from './../../almacen/DTOs/update-movimiento.dto';
import { BancosService } from './../bancos.service';
import { MovimientoCuentaBanco } from './../entities/movimientos-bancos.entity';
import { CreateMovBancarioDTO } from './../dto/create-mov-bancario.dto';
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
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller('bancos/movimientos')
export class MovimientosController {
  constructor(private readonly bancoService: BancosService) {}

  @Post()
  create(
    @Body() movimiento: CreateMovBancarioDTO,
  ): Promise<MovimientoCuentaBanco> {
    return this.bancoService.createMov(movimiento);
  }

  /**
   * Pagina los insumos
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns insumos paginados
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.bancoService.paginateMov(options);
  }

  /**
   * Busca un un objeto banco por id
   * @tests []
   * @param id del objeto banco buscado
   * @returns banco creado
   */
  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovimientoCuentaBanco> {
    return this.bancoService.getMovById(id);
  }
  /**
   * Actualiza un objeto por id
   * @tests []
   * @param id del objeto a actualizar
   * @returns el objeto actualizado
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() mov: UpdateMovimientoDTO,
  ): Promise<UpdateResult> {
    return this.bancoService.updateMov(id, mov);
  }

  /**
   * Borrar un objeto banco
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.bancoService.deleteMov(id);
  }
}
