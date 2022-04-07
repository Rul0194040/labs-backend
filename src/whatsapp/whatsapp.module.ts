import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from './whatsapp.service';
@Global()
@Module({
  imports: [HttpModule],
  providers: [WhatsappService],
})
export class WhatsappModule {}
