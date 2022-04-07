import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { URLSearchParams } from 'url';
@Injectable()
export class WhatsappService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Enviar un mensaje de whatsapp
   *
   * @param {string} message mensaje a enviar
   * @param {string} targetPhone : +521234567890 numero destino de whatsapp, debe tener el prefijo internacional
   */
  send(message: string, targetPhone: string): Promise<any> {
    const token = this.configService.get<string>(ConfigKeys.WACHABOT_TOKEN);
    return new Promise((resolve, reject) => {
      if (!token) {
        return resolve(`"WACHABOT_TOKEN" no está configurado.`);
      }
      //FIXME: arreglar tema de los certificados
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      const data = new URLSearchParams({
        targetPhone,
        message,
        token,
      });
      this.httpService
        .post(
          this.configService.get<string>(ConfigKeys.WACHABOT_URL),
          data.toString(),
        )
        .subscribe({
          next: (response) => {
            if (response.data.status && response.data.status === 'success') {
              return resolve(response.data);
            }
            return reject(response.data);
          },
          error: (err) => {
            return reject(err);
          },
          complete: () => {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
          },
        });
    });
  }
}
