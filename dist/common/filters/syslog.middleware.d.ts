import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { SyslogService } from '@sanfrancisco/syslog/syslog.service';
export declare class SyslogMiddleware implements NestMiddleware {
    private readonly syslogService;
    private readonly configService;
    constructor(syslogService: SyslogService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): void;
}
