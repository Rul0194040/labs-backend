import { Injectable } from '@nestjs/common';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { getRepository } from 'typeorm';
import { SyslogEntity } from './syslog.entity';

@Injectable()
export class SyslogService {
  async log(data: any): Promise<SyslogEntity> {
    let user: UsersEntity;
    let newLog = new SyslogEntity();
    newLog = { newLog, ...data };

    if (data.user) {
      user = { user, ...data.user };
      newLog.user = user;
    }

    return getRepository(SyslogEntity).save(newLog);
  }
}
