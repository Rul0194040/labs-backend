import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { DeleteResult, getRepository } from 'typeorm';
import { SendMailDTO } from './DTOs/sendMail.DTO';
import * as Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import * as ejs from 'ejs';
import { dirname } from 'path';
import { EmailEntity } from './email.entity';
import { MyLogger } from '@sanfrancisco/logger';
@Injectable()
export class MailService {
  private readonly logger = new MyLogger(MailService.name);
  private nodemailerTransporter: Mail;
  private host: string;
  private port: number;
  private ignoreTLS: boolean;
  private fromEmail: string;
  private fromName: string;
  private user: string;
  private password: string;
  private secure: boolean;
  private configured = false;
  private appDir: string;
  /**
   * Creación del transporter con el servicio de configuracion
   */
  constructor(private readonly configService: ConfigService) {
    this.appDir = dirname(require.main.filename);
    this.fromName = configService.get<string>(ConfigKeys.SMTP_FROM_NAME);
    this.fromEmail = configService.get<string>(ConfigKeys.SMTP_FROM_EMAIL);
    this.host = configService.get<string>(ConfigKeys.SMTP_HOST);
    this.port = configService.get<number>(ConfigKeys.SMTP_PORT);
    this.ignoreTLS = configService.get<boolean>(ConfigKeys.SMTP_IGNORE_TLS);
    this.secure = configService.get<boolean>(ConfigKeys.SMTP_SECURE);
    this.user = configService.get<string>(ConfigKeys.SMTP_USER);
    this.password = configService.get<string>(ConfigKeys.SMTP_PASSWORD);
  }

  async init(): Promise<any> {
    if (
      this.host &&
      this.port &&
      this.user &&
      this.password &&
      !this.configured
    ) {
      this.configured = true;
      const options = {
        host: this.host,
        port: this.port,
        ignoreTLS: this.ignoreTLS,
        secure: this.secure,
        auth: {
          user: this.user,
          pass: this.password,
        },
      };
      this.logger.log('Starting SMTP Transport.');
      this.nodemailerTransporter = createTransport(options);
      return this.configured;
    }
    this.logger.warn('SMTP Transport is not configured.');
    return false;
  }

  /**
   *
   * @param {Mail.Options} options Opciones de envio
   * @param {string} template Plantilla EJS a utilizar de <templateRoute>
   * @param {object} data Datos de la plantilla: {foo:'var'}
   * @param {string} templateRoute @default 'common/templates/email' ruta de las plantillas EJS
   * @returns {any}
   */
  async send(
    options: Mail.Options,
    template: string,
    data: any,
    templateRoute = 'common/services/mailer/templates',
  ): Promise<string | boolean> {
    await this.init();
    options.html = await ejs.renderFile(
      `${this.appDir}/${templateRoute}/${template}.ejs`,
      data,
    );
    if (this.configured) {
      try {
        options.from = `"${this.fromName}" <${this.fromEmail}>`;
        this.logger.log(`Sending email to ${options.to}`);
        const result = await this.nodemailerTransporter.sendMail(options);
        this.logger.log(`Response: ${result.response}`);
        this.logger.log(`MessageId: ${result.messageId}`);
        return result.messageId;
      } catch (error) {
        return false;
      }
    } else {
      this.logger.warn('El servicio SMTP no está configurado.');
      this.logger.log(`Email no enviado: ${options.html}`);
      return false;
    }
  }

  /**
   * Mostrar los mails
   *
   */
  async get(): Promise<EmailEntity[]> {
    return await getRepository(EmailEntity).find({ active: true });
  }

  /**
   * Mostrar un email
   *
   */
  async getEmailById(id: number): Promise<EmailEntity> {
    return await getRepository(EmailEntity).findOne({ id: id, active: true });
  }

  /**
   * Guardado de emails de admin
   *
   * @param emailDTO objeto del cooking a crear
   */
  async save(email: SendMailDTO): Promise<void> {
    await getRepository(EmailEntity).save(email);
  }

  /**
   * Delete
   *
   * Usando el delete
   *
   * @param {Number} id - el id del email a borrar
   *
   * @returns {DeleteResult} - el resultado de borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(EmailEntity).delete(id);
  }

  async paginate(options: PaginationOptions): Promise<any> {
    const data = await getRepository(EmailEntity).find({
      order: options.sort,
      skip: options.skip,
      take: options.take,
    });

    return {
      data,
      skip: options.skip,
      totalItems: await getRepository(EmailEntity).count({}),
    };
  }
}
