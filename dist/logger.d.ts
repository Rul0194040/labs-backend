import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class MyLogger extends Logger {
    facility: string;
    client: any;
    configured: boolean;
    constructor(name: string);
    configService: ConfigService<Record<string, unknown>>;
    error(message: any, stack?: string, context?: string): void;
    debug(message: any, stack?: string, context?: string): void;
    log(message: any, stack?: string, context?: string): void;
    verbose(message: any, stack?: string, context?: string): void;
    warn(message: any, stack?: string, context?: string): void;
}
