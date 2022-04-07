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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const paginationPrimeNg_dto_1 = require("../../DTO/paginationPrimeNg.dto");
const configkeys_enum_1 = require("../../enum/configkeys.enum");
const typeorm_1 = require("typeorm");
const nodemailer_1 = require("nodemailer");
const ejs = require("ejs");
const path_1 = require("path");
const email_entity_1 = require("./email.entity");
const logger_1 = require("../../../logger");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_1.MyLogger(MailService_1.name);
        this.configured = false;
        this.appDir = path_1.dirname(require.main.filename);
        this.fromName = configService.get(configkeys_enum_1.ConfigKeys.SMTP_FROM_NAME);
        this.fromEmail = configService.get(configkeys_enum_1.ConfigKeys.SMTP_FROM_EMAIL);
        this.host = configService.get(configkeys_enum_1.ConfigKeys.SMTP_HOST);
        this.port = configService.get(configkeys_enum_1.ConfigKeys.SMTP_PORT);
        this.ignoreTLS = configService.get(configkeys_enum_1.ConfigKeys.SMTP_IGNORE_TLS);
        this.secure = configService.get(configkeys_enum_1.ConfigKeys.SMTP_SECURE);
        this.user = configService.get(configkeys_enum_1.ConfigKeys.SMTP_USER);
        this.password = configService.get(configkeys_enum_1.ConfigKeys.SMTP_PASSWORD);
    }
    async init() {
        if (this.host &&
            this.port &&
            this.user &&
            this.password &&
            !this.configured) {
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
            this.nodemailerTransporter = nodemailer_1.createTransport(options);
            return this.configured;
        }
        this.logger.warn('SMTP Transport is not configured.');
        return false;
    }
    async send(options, template, data, templateRoute = 'common/services/mailer/templates') {
        await this.init();
        options.html = await ejs.renderFile(`${this.appDir}/${templateRoute}/${template}.ejs`, data);
        if (this.configured) {
            try {
                options.from = `"${this.fromName}" <${this.fromEmail}>`;
                this.logger.log(`Sending email to ${options.to}`);
                const result = await this.nodemailerTransporter.sendMail(options);
                this.logger.log(`Response: ${result.response}`);
                this.logger.log(`MessageId: ${result.messageId}`);
                return result.messageId;
            }
            catch (error) {
                return false;
            }
        }
        else {
            this.logger.warn('El servicio SMTP no está configurado.');
            this.logger.log(`Email no enviado: ${options.html}`);
            return false;
        }
    }
    async get() {
        return await typeorm_1.getRepository(email_entity_1.EmailEntity).find({ active: true });
    }
    async getEmailById(id) {
        return await typeorm_1.getRepository(email_entity_1.EmailEntity).findOne({ id: id, active: true });
    }
    async save(email) {
        await typeorm_1.getRepository(email_entity_1.EmailEntity).save(email);
    }
    async delete(id) {
        return await typeorm_1.getRepository(email_entity_1.EmailEntity).delete(id);
    }
    async paginate(options) {
        const data = await typeorm_1.getRepository(email_entity_1.EmailEntity).find({
            order: options.sort,
            skip: options.skip,
            take: options.take,
        });
        return {
            data,
            skip: options.skip,
            totalItems: await typeorm_1.getRepository(email_entity_1.EmailEntity).count({}),
        };
    }
};
MailService = MailService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=email.service.js.map