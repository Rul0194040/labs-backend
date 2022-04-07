import { Module } from '@nestjs/common';
import { MailService } from './email.service';
import { MailerController } from './email.controller';

@Module({
  providers: [MailService],
  controllers: [MailerController],
})
export class LocalMailerModule {}
