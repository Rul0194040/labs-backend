import * as Twilio from 'twilio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { MyLogger } from '@sanfrancisco/logger';

@Injectable()
export class SmsService {
  /**
   * Requeridos
   *
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new MyLogger(SmsService.name);
  /**
   * Cliente instanciado para el envio, es de tipo Twilio o false segun las variables .env
   */
  private readonly client =
    this.configService.get<string>(ConfigKeys.TWILIO_ID) &&
    this.configService.get<string>(ConfigKeys.TWILIO_KEY) &&
    this.configService.get<string>(ConfigKeys.TWILIO_NUMBER)
      ? Twilio(
          this.configService.get<string>(ConfigKeys.TWILIO_ID),
          this.configService.get<string>(ConfigKeys.TWILIO_KEY),
        )
      : false;
  /**
   * Enviar un mensaje!
   *
   * @param num Numero de telefono incluido codigo de area internacional ej: +529510001234
   * @param message el mensaje de texto
   */
  send(num: string, message: string): void {
    this.logger.verbose(`Sending sms: ${num}, ${message}...`);
    if (this.client && this.client['messages']) {
      this.client['messages']
        .create({
          body: message,
          from: this.configService.get<string>(ConfigKeys.TWILIO_NUMBER),
          to: num,
        })
        .then((messageSent) => {
          this.logger.verbose(`SMS sent: ${messageSent.sid}`);
          return true;
        })
        .catch((err) => {
          this.logger.error(err);
          return false;
        });
    } else {
      this.logger.warn(`SMS Gateway not configured...`);
    }
  }
}
