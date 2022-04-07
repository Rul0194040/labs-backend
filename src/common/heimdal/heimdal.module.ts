import { Global, Module } from '@nestjs/common';
import { HeimdalService } from './heimdal.service';
import { HeimdalController } from './heimdal.controller';

@Global()
@Module({
  providers: [HeimdalService],
  controllers: [HeimdalController],
})
export class HeimdalModule {}
