import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryFailedError } from 'typeorm';
export declare class TypeORMExceptionFilter implements ExceptionFilter {
    private readonly configService;
    constructor(configService: ConfigService);
    private logger;
    catch(exception: QueryFailedError, host: ArgumentsHost): void;
}
