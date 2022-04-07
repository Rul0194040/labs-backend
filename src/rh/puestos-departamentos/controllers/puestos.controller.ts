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
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreatePuestoDTO } from '../DTOs/create-puesto.dto';
import { UpdatePuestoDTO } from '../DTOs/update-puesto.dto';
import { PuestoEntity } from '../entity/puesto.entity';
import { PuestosDepartamentosService } from '../puestos-departamentos.service';
import { PaginationPrimeNgResult } from '../../../common/DTO/pagination-prime-Ng-result.dto';

@Controller('puestos')
export class PuestosController {
  constructor(
    private readonly puestosDepartamentosService: PuestosDepartamentosService,
  ) {}

  /**
   * Crear puesto
   *
   * @param puesto Data del puesto
   * @returns {PuestoEntity}
   */
  @Post()
  crearPuesto(@Body() puesto: CreatePuestoDTO): Promise<PuestoEntity> {
    return this.puestosDepartamentosService.crearPuesto(puesto);
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {PuestoEntity}
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<PuestoEntity> {
    return this.puestosDepartamentosService.getPuestoById(id);
  }

  /**
   * Actualizar un puesto
   *
   * @param puestoId id del puesto
   * @param puesto datos a actualizar del puesto
   * @returns {UpdateResult}
   */
  @Put(':puestoId')
  actualizarPuesto(
    @Param('puestoId', ParseIntPipe) puestoId: number,
    @Body() puesto: UpdatePuestoDTO,
  ): Promise<UpdateResult> {
    return this.puestosDepartamentosService.actualizarPuesto(puestoId, puesto);
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
    return this.puestosDepartamentosService.puestosPaginate(options);
  }

  /**
   * Delete
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.puestosDepartamentosService.puestosDelete(id);
  }
}
