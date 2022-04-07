import { IncidenciasService } from './incidencias.service';
import { IncidenciaEntity } from './entity/incidencias.entity';
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
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult } from 'typeorm';
import { CreateIncidenciaDTO } from './DTO/create-incidencia.dto';
import { UpdateIncidenciasDTO } from './DTO/update-incidencia.dto';

@Controller('incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciaService: IncidenciasService) {}

  /**
   * Crear incidencia
   *
   * @param incidencia Data del incidencia
   * @returns {IncidenciaEntity}
   */
  @Post()
  crearIncidencia(
    @Body() incidencia: CreateIncidenciaDTO,
  ): Promise<IncidenciaEntity> {
    return this.incidenciaService.createIncidencia(incidencia);
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {IncidenciaEntity}
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<IncidenciaEntity> {
    return this.incidenciaService.getIncidenciaById(id);
  }

  /**
   * Actualizar un incidencia
   *
   * @param incidenciaId id del incidencia
   * @param incidencia datos a actualizar del incidencia
   * @returns {UpdateResult}
   */
  @Put(':incidenciaId')
  actualizarIncidencia(
    @Param('incidenciaId', ParseIntPipe) incidenciaId: number,
    @Body() incidencia: UpdateIncidenciasDTO,
  ): Promise<IncidenciaEntity> {
    return this.incidenciaService.updateIncidencia(incidenciaId, incidencia);
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
    return this.incidenciaService.incidenciasPaginate(options);
  }

  /**
   * Delete
   *
   * @param options opciones de paginacion
   * @returns {DeleteResult}
   */
  @Delete(':incidenciaId')
  deleteIncidencia(
    @Param('incidenciaId', ParseIntPipe) incidenciaId: number,
  ): Promise<DeleteResult> {
    return this.incidenciaService.delete(incidenciaId);
  }
}
