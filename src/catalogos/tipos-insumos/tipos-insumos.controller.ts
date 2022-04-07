import { ApiTags } from '@nestjs/swagger';
import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { TiposInsumosService } from './tipos-insumos.service';
import { CreateTipoInsumoDTO } from './DTOs/createTipoInsumo.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateTipoInsumoDTO } from './DTOs/updateTipoInsumo.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
@ApiTags('tipos-insumo')
@Controller('tipos-insumos')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class TiposInsumosController {
  constructor(private readonly tipoInsumoService: TiposInsumosService) {}

  /**
   * Crea un tipo de insumo
   *
   * @tests ['Crear tipo de insumo']
   * @param tipo Tipo de insumo
   * @returns tipo de insumo creado
   */
  @Post()
  create(@Body() tipo: CreateTipoInsumoDTO): Promise<TipoInsumoEntity> {
    return this.tipoInsumoService.create(tipo);
  }

  /**
   * Pagina los tipos de insumo
   *
   * @tests ['Paginar tipos de insumo']
   * @param options Opciones de paginacion
   * @returns tipos de insumo paginados
   */
  @Post('paginate')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.tipoInsumoService.paginate(options);
  }

  /**
   * retorna un tipo de insumo  por id
   *
   * @param id id del tipo de insumo a obtener
   * @returns tipo de insumo
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<TipoInsumoEntity> {
    return this.tipoInsumoService.getById(id);
  }

  /**
   * actualiza un tipo de insumo por id
   *
   * @param id id del tipo de insumo
   * @param grupo datos que se actualizan en el tipo de insumo
   * @returns resultados de la actualizacion
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() grupo: UpdateTipoInsumoDTO,
  ): Promise<UpdateResult> {
    return this.tipoInsumoService.update(id, grupo);
  }

  /**
   * actualiza el estado de un tipo de insumo
   *
   * @param id id del tipo de insumo
   * @param status estado de activacion true / false
   * @returns resultados de la actualizacion
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.tipoInsumoService.updateStatus(id, status);
  }

  /**
   * elimina un tipo de insumo por id
   *
   * @param id id del tipo de insumo a eliminar
   * @returns resultados de la eliminacion
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.tipoInsumoService.delete(id);
  }
}
