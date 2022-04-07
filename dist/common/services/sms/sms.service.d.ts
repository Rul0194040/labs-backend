import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly configService;
    constructor(configService: ConfigService);
    private readonly logger;
    private readonly client;
    send(num: string, message: string): void;
}
