import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly configService;
    constructor(configService: ConfigService);
    private logger;
    catch(exception: HttpException, host: ArgumentsHost): void;
}
