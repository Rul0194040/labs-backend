import { DashboardService } from './dashboard.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataResultDTO } from './DTOss/get-data-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@sanfrancisco/users/decorators/user.decorator';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly _dashboardservice: DashboardService) {}

  /**
   * Obtener el dashboard dependiendo el perfil
   *
   * @param user usuario para determinar el perfil
   * @returns {DataResultDTO} dashboard
   */
  @Get()
  async analytics(@User() user: LoginIdentityDTO): Promise<DataResultDTO> {
    return this._dashboardservice.getData(user);
  }
}
