import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { LotesService } from './lotes.service';
import { CreateLoteDTO } from './DTOs/create-lote.dto';
import { UpdateLoteDTO } from './DTOs/update-lote.dto';
import { LoteEntity } from './lotes.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lotes')
@Controller('lotes')
@UseGuards(JwtAuthGuard)
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  /**
   * Crear un lote
   *
   * @param lote lote a crear
   * @returns {LoteEntity} registro creado
   */
  @Post()
  create(@Body() lote: CreateLoteDTO): Promise<LoteEntity> {
    return this.lotesService.create(lote);
  }

  /**
   * Obtiene un lote por id
   *
   * @param id id del lote
   * @returns {LoteEntity}
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<LoteEntity> {
    return this.lotesService.getById(id);
  }

  /**
   * elimina un lote
   *
   * @param id id del lote a eliminar
   * @returns {DeleteResult}
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.lotesService.delete(id);
  }

  /**
   * Pagina los lotes
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.lotesService.paginate(options);
  }

  /**
   * Edita informacion de un lote
   *
   * @param id id del lote a actualizar
   * @param descripcion datos a actualizar
   * @returns {UpdateResult}
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() descripcion: UpdateLoteDTO,
  ): Promise<UpdateResult> {
    return this.lotesService.update(id, descripcion);
  }
}
