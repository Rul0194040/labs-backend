import { SyslogEntity } from './syslog.entity';
export declare class SyslogService {
    log(data: any): Promise<SyslogEntity>;
}
