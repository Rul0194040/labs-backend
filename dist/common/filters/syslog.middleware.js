"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SyslogMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogMiddleware = void 0;
const common_1 = require("@nestjs/common");
const configkeys_enum_1 = require("../enum/configkeys.enum");
const config_1 = require("@nestjs/config");
const syslog_service_1 = require("../../syslog/syslog.service");
const logger_1 = require("../../logger");
let SyslogMiddleware = SyslogMiddleware_1 = class SyslogMiddleware {
    constructor(syslogService, configService) {
        this.syslogService = syslogService;
        this.configService = configService;
    }
    use(req, res, next) {
        const logger = new logger_1.MyLogger(SyslogMiddleware_1.name);
        if (!this.configService.get(configkeys_enum_1.ConfigKeys.ENABLE_SYSLOG)) {
            return next();
        }
        try {
            const { ip, method, baseUrl } = req;
            const userAgent = req.get('user-agent') || '';
            res.on('close', async () => {
                const { statusCode } = res;
                const contentLength = res.get('content-length');
                const user = req['user'] ? req['user'] : false;
                this.syslogService.log({
                    user,
                    method,
                    baseUrl,
                    statusCode,
                    contentLength,
                    userAgent: userAgent.substr(0, 150),
                    ip: ip.substr(0, 15),
                });
            });
        }
        catch (error) {
            logger.error(error);
        }
        return next();
    }
};
SyslogMiddleware = SyslogMiddleware_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [syslog_service_1.SyslogService,
        config_1.ConfigService])
], SyslogMiddleware);
exports.SyslogMiddleware = SyslogMiddleware;
//# sourceMappingURL=syslog.middleware.js.map