import { MailService } from './email.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SendMailDTO } from './DTOs/sendMail.DTO';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import * as Mail from 'nodemailer/lib/mailer';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { MyLogger } from '@sanfrancisco/logger';

@Controller('mailer')
@UseGuards(JwtAuthGuard)
export class MailerController {
  /**
   * Api: POST /api/v1/browse/contact/send
   *
   * @param {mailDTO} email a crear.
   * @returns {void}
   */

  constructor(
    private readonly mailSenderService: MailService,
    private readonly configservice: ConfigService,
  ) {}
  private readonly logger = new MyLogger(MailerController.name);

  /**
   * Api: POST /api/v1/browse/contact/send
   *
   * @param {EmailDTO} email a crear.
   * @returns {void}
   */
  @Post('send')
  async save(@Body() email: SendMailDTO): Promise<void> {
    const to = this.configservice.get<string>(ConfigKeys.EMAILS_INBOX);
    if (to) {
      //si hay una configuracion, enviarlo, si no, solo guardarlo
      const sendEmail: Mail.Options = {
        to,
        subject: 'Email desde SistemaSanFrancisco',
      };
      const data = {
        subject: email.subject,
        message: email.message,
        from: email.email,
        siteName: this.configservice.get<string>(ConfigKeys.SITE_NAME),
      };
      await this.mailSenderService.send(sendEmail, 'contact-email', data);
    } else {
      this.logger.log('No esta configurada la variable EMAILS_INBOX en ENV');
    }
    //almacenarlo
    return await this.mailSenderService.save(email);
  }
}
