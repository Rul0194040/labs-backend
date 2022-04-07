import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { GruposServiciosService } from './grupos-servicios.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { GrupoServicioEntity } from './grupo-servicio.entity';
import { CreateGrupoServiciosDTO } from './DTOs/createGrupoServicio.dto';
import { UpdateGrupoServiciosDTO } from './DTOs/updateGrupoServicio.dto';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
@ApiTags('grupos-servicios')
@Controller('grupos-servicios')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SYSADMIN)
export class GruposServiciosController {
  constructor(private readonly grupoServiciosService: GruposServiciosService) {}

  /**
   * Crea un grupo de servicios
   *
   * @tests ['Crear grupo de servicios']
   * @param grupo Grupo de servicios
   * @returns grupo de servicios creado
   */
  @Post()
  create(@Body() grupo: CreateGrupoServiciosDTO): Promise<GrupoServicioEntity> {
    return this.grupoServiciosService.create(grupo);
  }

  /**
   * Pagina los grupos de servicios
   *
   * @tests ['Paginar grupos de servicios']
   * @param options Opciones de paginacion
   * @returns grupos de servicios paginados
   */
  @Post('paginate')
  paginate(@Body() options: PaginationOptions): Promise<any> {
    return this.grupoServiciosService.paginate(options);
  }

  /**
   * retorna un grupo de servicios por id
   *
   * @param id id del grupo de servicios a obtener
   * @returns grupo de servicios
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<GrupoServicioEntity> {
    return this.grupoServiciosService.getById(id);
  }

  /**
   * actualiza un grupo de servicios por id
   *
   * @param id id del grupo de servicios
   * @param grupo datos que se actualizan en el grupo de servicios
   * @returns resultados de la actualizacion
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() grupo: UpdateGrupoServiciosDTO,
  ): Promise<UpdateResult> {
    return this.grupoServiciosService.update(id, grupo);
  }

  /**
   * actualiza el estado de un grupo de servicios
   *
   * @param id id del grupo de servicios
   * @param status estado de activacion true / false
   * @returns resultados de la actualizacion
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.grupoServiciosService.updateStatus(id, status);
  }

  /**
   * elimina un grupo de servicios por id
   *
   * @param id id del grupo de servicios a eliminar
   * @returns resultados de la eliminacion
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.grupoServiciosService.delete(id);
  }
}
