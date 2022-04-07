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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MailerController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerController = void 0;
const email_service_1 = require("./email.service");
const common_1 = require("@nestjs/common");
const sendMail_DTO_1 = require("./DTOs/sendMail.DTO");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../../enum/configkeys.enum");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt/jwt-auth.guard");
const logger_1 = require("../../../logger");
let MailerController = MailerController_1 = class MailerController {
    constructor(mailSenderService, configservice) {
        this.mailSenderService = mailSenderService;
        this.configservice = configservice;
        this.logger = new logger_1.MyLogger(MailerController_1.name);
    }
    async save(email) {
        const to = this.configservice.get(configkeys_enum_1.ConfigKeys.EMAILS_INBOX);
        if (to) {
            const sendEmail = {
                to,
                subject: 'Email desde SistemaSanFrancisco',
            };
            const data = {
                subject: email.subject,
                message: email.message,
                from: email.email,
                siteName: this.configservice.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
            };
            await this.mailSenderService.send(sendEmail, 'contact-email', data);
        }
        else {
            this.logger.log('No esta configurada la variable EMAILS_INBOX en ENV');
        }
        return await this.mailSenderService.save(email);
    }
};
__decorate([
    common_1.Post('send'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sendMail_DTO_1.SendMailDTO]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "save", null);
MailerController = MailerController_1 = __decorate([
    common_1.Controller('mailer'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [email_service_1.MailService,
        config_1.ConfigService])
], MailerController);
exports.MailerController = MailerController;
//# sourceMappingURL=email.controller.js.map