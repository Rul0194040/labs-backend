import { Module } from '@nestjs/common';
import { SyslogService } from './syslog.service';
import { SyslogController } from './syslog.controller';

@Module({
  providers: [SyslogService],
  controllers: [SyslogController]
})
export class SyslogModule {}
