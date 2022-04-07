import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { MuestrasService } from './muestras.service';
import { CreateMuestraDTO } from './DTOs/create-muestra.dto';
import { MuestraEntity } from './muestras.entity';
import { DeleteResult } from 'typeorm';

@Controller('muestras')
@UseGuards(JwtAuthGuard)
export class MuestrasController {
  constructor(private readonly muestrasService: MuestrasService) {}

  /**
   * Crear una muestra
   *
   * @param user usuario en sesion
   * @param data datos para la muestra
   * @returns {MuestraEntity}
   */
  @Post()
  create(
    @User() user: UsersEntity,
    @Body() data: CreateMuestraDTO,
  ): Promise<MuestraEntity> {
    return this.muestrasService.create(user, data);
  }

  /**
   * Eliminar una muestra
   *
   * @param id id de la muestra
   * @returns {DeleteResult}
   */
  @Delete(':id')
  update(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.muestrasService.delete(id);
  }
}
