import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class XquendaMiddleware implements NestMiddleware {
  configService = new ConfigService();

  //info loaded from package.json for vanity headers
  appPackage = JSON.parse(readFileSync('package.json').toString());

  use(req: Request, res: Response, next: NextFunction) {
    //set vanity headers
    res.set('X-Powered-By', `${this.appPackage.author.name}`);
    res.set('X-Powered-Description', this.appPackage.description);
    res.set('X-Powered-Version', this.appPackage.version);
    res.set('X-Powered-Url', `${this.appPackage.author.url}`);
    res.set('X-Powered-Email', `${this.appPackage.author.email}`);
    res.set('X-Powered-Contact', this.appPackage.author.contact);
    res.set('X-Powered-License', this.appPackage.license);

    //do we have API_KEY's ?
    if (!this.configService.get<string>(ConfigKeys.API_KEY)) {
      return next();
    }

    //since we have API_KEY's, we need api-key in headers
    if (!req.headers['api-key']) {
      throw new HttpException(
        'Missing api-key in headers.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //parse valid keys from config.
    const keys = this.configService
      .get<string>(ConfigKeys.API_KEY)
      .split(',')
      .map((a) => a.trim());

    //get request api-key
    const apiKey = req.headers['api-key'].toString();

    //is it valid?
    if (keys.indexOf(apiKey) > -1) {
      return next();
    }

    //api key is not valid
    throw new HttpException('Invalid api-key.', HttpStatus.BAD_REQUEST);
  }
}
