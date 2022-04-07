import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateIncentivoDTO } from './DTOs/create-incentivo.dto';
import { IncentivosService } from './incentivos.service';
import { IncentivoEntity } from './entity/incentivos.entity';
import { UpdateIncentivosDTO } from './DTOs/update-incentivo.dto';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';

@Controller('incentivos')
//@UseGuards(JwtAuthGuard)
export class IncentivosController {
  constructor(private readonly incentivosService: IncentivosService) {}

  /**
   * Crear un incentivo
   *
   * @param incentivo datos del incentivo
   * @returns {IncentivoEntity}
   */
  @Post()
  crearIncentivo(
    @Body() incentivo: CreateIncentivoDTO,
  ): Promise<IncentivoEntity> {
    return this.incentivosService.crearIncentivo(incentivo);
  }

  /**
   * Crear un incentivo
   *
   * @param incentivo datos del incentivo
   * @returns {IncentivoEntity}
   */
  @Get(':incentivoId')
  getbyIncentivo(
    @Param('incentivoId', ParseIntPipe) incentivoId: number,
  ): Promise<IncentivoEntity> {
    return this.incentivosService.getbyInsentivo(incentivoId);
  }

  /**
   * Actualizar un incentivo
   *
   * @param incentivoId Id del incentivo
   * @param incentivo datos del incentivo
   * @returns {UpdateResult}
   */
  @Put(':incentivoId')
  actualizarIncentivo(
    @Param('incentivoId', ParseIntPipe) incentivoId: number,
    @Body() incentivo: UpdateIncentivosDTO,
  ): Promise<UpdateResult> {
    return this.incentivosService.actualizarIncentivo(incentivoId, incentivo);
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
    return this.incentivosService.paginate(options);
  }
}
