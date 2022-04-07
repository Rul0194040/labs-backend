import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class XquendaMiddleware implements NestMiddleware {
    configService: ConfigService<Record<string, unknown>>;
    appPackage: any;
    use(req: Request, res: Response, next: NextFunction): void;
}
