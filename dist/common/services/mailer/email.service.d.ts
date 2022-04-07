import { ConfigService } from '@nestjs/config';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult } from 'typeorm';
import { SendMailDTO } from './DTOs/sendMail.DTO';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailEntity } from './email.entity';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private nodemailerTransporter;
    private host;
    private port;
    private ignoreTLS;
    private fromEmail;
    private fromName;
    private user;
    private password;
    private secure;
    private configured;
    private appDir;
    constructor(configService: ConfigService);
    init(): Promise<any>;
    send(options: Mail.Options, template: string, data: any, templateRoute?: string): Promise<string | boolean>;
    get(): Promise<EmailEntity[]>;
    getEmailById(id: number): Promise<EmailEntity>;
    save(email: SendMailDTO): Promise<void>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<any>;
}
