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
import { ApiTags } from '@nestjs/swagger';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreatePacienteDTO } from './DTOs/create-paciente.dto';
import { UpdatePacienteDTO } from './DTOs/update-paciente.dto';
import { PacienteEntity } from './pacientes.entity';
import { PacientesService } from './pacientes.service';
import { UsersEntity } from '../users/users.entity';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';

@ApiTags('pacientes')
@UseGuards(JwtAuthGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacienteServie: PacientesService) {}

  @Post()
  @RequireRule('create:paciente')
  create(
    @Body() paciente: CreatePacienteDTO,
    @User() user: UsersEntity,
  ): Promise<PacienteEntity> {
    return this.pacienteServie.create(paciente, user);
  }

  @Post('paginate')
  @RequireRule('view:pacientes')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.pacienteServie.paginate(options);
  }

  @Get(':id')
  @RequireRule('view:pacientes')
  getById(@Param('id', ParseIntPipe) id: number): Promise<PacienteEntity> {
    return this.pacienteServie.getById(id);
  }

  @Put(':id')
  @RequireRule('update:pacientes')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() paciente: UpdatePacienteDTO,
  ): Promise<PacienteEntity> {
    return this.pacienteServie.update(id, paciente);
  }

  @Patch(':id/status')
  @RequireRule('update:pacientes')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
  ): Promise<UpdateResult> {
    return this.pacienteServie.updateStatus(id, status);
  }

  @Delete(':id')
  @RequireRule('delete:pacientes')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.pacienteServie.delete(id);
  }
}
