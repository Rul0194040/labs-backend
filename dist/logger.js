"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLogger = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const gelfling = require("gelfling");
const configkeys_enum_1 = require("./common/enum/configkeys.enum");
class MyLogger extends common_1.Logger {
    constructor(name) {
        super(name);
        this.facility = '';
        this.configured = false;
        this.configService = new config_1.ConfigService();
        this.facility =
            name || this.configService.get(configkeys_enum_1.ConfigKeys.GELF_FACILITY);
        if (this.configService.get(configkeys_enum_1.ConfigKeys.GELF_SERVER_IP) &&
            this.configService.get(configkeys_enum_1.ConfigKeys.GELF_PORT)) {
            this.configured = true;
            this.client = gelfling(this.configService.get(configkeys_enum_1.ConfigKeys.GELF_SERVER_IP), this.configService.get(configkeys_enum_1.ConfigKeys.GELF_PORT), {
                defaults: {
                    facility: this.facility,
                    level: gelfling.INFO,
                },
            });
        }
    }
    error(message, stack, context) {
        if (this.configured) {
            this.client.send({
                level: gelfling.ERROR,
                facility: context || this.facility,
                message: message,
            });
        }
        super.error.apply(this, arguments);
    }
    debug(message, stack, context) {
        if (this.configured) {
            this.client.send({
                level: gelfling.DEBUG,
                facility: context || this.facility,
                message: message,
            });
        }
        super.debug.apply(this, arguments);
    }
    log(message, stack, context) {
        if (this.configured) {
            this.client.send({
                level: gelfling.ERROR,
                facility: context || this.facility,
                message: message,
            });
        }
        super.log.apply(this, arguments);
    }
    verbose(message, stack, context) {
        if (this.configured) {
            this.client.send({
                level: gelfling.NOTICE,
                facility: context || this.facility,
                message: message,
            });
        }
        super.verbose.apply(this, arguments);
    }
    warn(message, stack, context) {
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
exports.MyLogger = MyLogger;
//# sourceMappingURL=logger.js.map