import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { ConfigService } from '@nestjs/config';
import { SyslogService } from '@sanfrancisco/syslog/syslog.service';
import { MyLogger } from '@sanfrancisco/logger';
@Injectable()
export class SyslogMiddleware implements NestMiddleware {
  constructor(
    private readonly syslogService: SyslogService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const logger = new MyLogger(SyslogMiddleware.name);
    //si no esta activado... salir
    if (!this.configService.get<boolean>(ConfigKeys.ENABLE_SYSLOG)) {
      return next();
    }
    try {
      const { ip, method, baseUrl } = req;
      const userAgent = req.get('user-agent') || '';

      res.on('close', async () => {
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const user = req['user'] ? req['user'] : false;
        this.syslogService.log({
          user,
          method,
          baseUrl,
          statusCode,
          contentLength,
          userAgent: userAgent.substr(0, 150),
          ip: ip.substr(0, 15),
        });
      });
    } catch (error) {
      //ignorar el error si suscede aqui, solo reportar a sentry.
      logger.error(error);
    }

    return next();
  }
}
