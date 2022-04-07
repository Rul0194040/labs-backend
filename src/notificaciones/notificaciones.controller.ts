import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { NotificacionEntity } from './notificaciones.entity';
import { NotificacionesService } from './notificaciones.service';

@ApiTags('notificaciones')
@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
@RequireProfiles(
  ProfileTypes.SYSADMIN,
  ProfileTypes.SUCURSAL,
  ProfileTypes.ALMACEN_GENERAL,
  ProfileTypes.SUPER,
)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}
  @Get('')
  async misNotificaciones(
    @User() usuario: UsersEntity,
  ): Promise<NotificacionEntity[]> {
    return this.notificacionesService.misNotificaciones(usuario);
  }
}
