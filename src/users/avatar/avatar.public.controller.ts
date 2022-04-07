import { ImagesService } from './../../images/images.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { existsSync } from 'fs';
import { UsersService } from '../users.service';

@Controller('avatar')
export class AvatarPublicController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imagesService: ImagesService,
  ) {}

  //obtener el avatar de un usuario segun su id
  @Get(':uuid')
  serveAvatar(@Param('uuid') uuid: string, @Res() res): void {
    const image = `${uuid}.jpg`;
    const filesRoute = './uploads/avatar';
    if (existsSync(`${filesRoute}/${uuid}.jpg`)) {
      return res.sendFile(image, { root: `${filesRoute}` });
    }
    return res.sendFile('profile.jpg', {
      root: `${__dirname}/../../assets`,
    });
  }
}
