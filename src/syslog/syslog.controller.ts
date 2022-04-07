import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { RequireProfiles } from '@sanfrancisco/users/decorators/require-profiles.decorator';

@Controller('syslog')
@ApiBearerAuth()
@ApiTags('syslog')
@UseGuards(JwtAuthGuard)
@RequireProfiles(ProfileTypes.SUPER, ProfileTypes.SYSADMIN)
export class SyslogController {}
