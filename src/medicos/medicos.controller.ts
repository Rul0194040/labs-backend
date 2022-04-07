import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './DTO/create-medico.dto';
import { UpdateMedicoDto } from './DTO/update-medico.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { MedicoEntity } from './medico.entity';
import { DeleteResult } from 'typeorm';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';

@Controller('medicos')
@UseGuards(JwtAuthGuard)
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @RequireRule('create:medicos')
  create(@Body() createMedicoDto: CreateMedicoDto): Promise<MedicoEntity> {
    return this.medicosService.create(createMedicoDto);
  }

  @Get(':id')
  @RequireRule('view:medicos')
  getById(@Param('id', ParseIntPipe) id: number): Promise<MedicoEntity> {
    return this.medicosService.getById(id);
  }

  @Put(':id')
  @RequireRule('update:medicos')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicoDto: UpdateMedicoDto,
  ): Promise<MedicoEntity> {
    return this.medicosService.update(id, updateMedicoDto);
  }

  @Delete(':id')
  @RequireRule('delete:medicos')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.medicosService.delete(id);
  }

  @Post('paginate')
  @RequireRule('view:medicos')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.medicosService.paginate(options);
  }
}
