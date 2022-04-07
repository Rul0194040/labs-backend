import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class WhatsappService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    send(message: string, targetPhone: string): Promise<any>;
}
