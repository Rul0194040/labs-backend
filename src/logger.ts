/* eslint-disable prefer-rest-params */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as gelfling from 'gelfling';
import { ConfigKeys } from './common/enum/configkeys.enum';
export class MyLogger extends Logger {
  facility = '';
  client: any;
  configured = false;
  constructor(name: string) {
    super(name);
    this.facility =
      name || this.configService.get<string>(ConfigKeys.GELF_FACILITY);
    if (
      this.configService.get<string>(ConfigKeys.GELF_SERVER_IP) &&
      this.configService.get<number>(ConfigKeys.GELF_PORT)
    ) {
      this.configured = true;
      this.client = gelfling(
        this.configService.get<string>(ConfigKeys.GELF_SERVER_IP),
        this.configService.get<number>(ConfigKeys.GELF_PORT),
        {
          defaults: {
            facility: this.facility,
            level: gelfling.INFO,
          },
        },
      );
    }
  }
  configService = new ConfigService();
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (this.configured) {
      this.client.send({
        level: gelfling.ERROR,
        facility: context || this.facility,
        message: message,
      });
    }
    super.error.apply(this, arguments);
  }

  debug(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (this.configured) {
      this.client.send({
        level: gelfling.DEBUG,
        facility: context || this.facility,
        message: message,
      });
    }
    super.debug.apply(this, arguments);
  }

  log(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (this.configured) {
      this.client.send({
        level: gelfling.ERROR,
        facility: context || this.facility,
        message: message,
      });
    }
    super.log.apply(this, arguments);
  }

  verbose(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (this.configured) {
      this.client.send({
        level: gelfling.NOTICE,
        facility: context || this.facility,
        message: message,
      });
    }
    super.verbose.apply(this, arguments);
  }

  warn(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (this.configured) {
      this.client.send({
        level: gelfling.WARNING,
        facility: context || this.facility,
        message: message,
      });
    }
    super.warn.apply(this, arguments);
  }
}
