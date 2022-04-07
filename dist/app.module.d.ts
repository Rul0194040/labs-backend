import { MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './common/services/mailer/email.service';
import { Cache } from 'cache-manager';
import { MyLogger } from './logger';
export declare class AppModule implements OnModuleInit {
    private readonly appService;
    private readonly mailService;
    private cacheManager;
    constructor(appService: AppService, mailService: MailService, cacheManager: Cache);
    configure(consumer: MiddlewareConsumer): void;
    logger: MyLogger;
    onModuleInit(): Promise<boolean>;
}
