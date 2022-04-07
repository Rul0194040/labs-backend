import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '@sanfrancisco/logger';
import { ConfigKeys } from '../enum/configkeys.enum';

/**
 * Atrapa todas las excepciones HTTP que resulten en el sistema
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  private logger = new MyLogger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const { url, body } = request;
    const errorResponse = {
      path: url,
      timestamp: new Date().toISOString(),
      name: exception.name,
      message: exception.message,
      method: request.method,
      code: exception.getStatus(),
      exception: null,
      requestBody: null,
    };

    if (this.configService.get<string>(ConfigKeys.NODE_ENV) !== 'production') {
      errorResponse.exception = exception;
      errorResponse.requestBody = body;
      this.logger.verbose(errorResponse);
    }

    response.status(exception.getStatus()).json(errorResponse);
  }
}
