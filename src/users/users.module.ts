import { ImagesService } from './../images/images.service';
import { Global, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { AvatarController } from './avatar/avatar.controller';
import { AvatarPublicController } from './avatar/avatar.public.controller';

@Global()
@Module({
  imports: [],
  controllers: [UsersController, AvatarController, AvatarPublicController],
  providers: [UsersService, MailService, ImagesService],
  exports: [UsersService, MailService],
})
export class UsersModule {}
