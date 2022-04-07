import { MailService } from './email.service';
import { SendMailDTO } from './DTOs/sendMail.DTO';
import { ConfigService } from '@nestjs/config';
export declare class MailerController {
    private readonly mailSenderService;
    private readonly configservice;
    constructor(mailSenderService: MailService, configservice: ConfigService);
    private readonly logger;
    save(email: SendMailDTO): Promise<void>;
}
