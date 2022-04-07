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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const url_1 = require("url");
let WhatsappService = class WhatsappService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    send(message, targetPhone) {
        const token = this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_TOKEN);
        return new Promise((resolve, reject) => {
            if (!token) {
                return resolve(`"WACHABOT_TOKEN" no está configurado.`);
            }
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
            const data = new url_1.URLSearchParams({
                targetPhone,
                message,
                token,
            });
            this.httpService
                .post(this.configService.get(configkeys_enum_1.ConfigKeys.WACHABOT_URL), data.toString())
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
};
WhatsappService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], WhatsappService);
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsapp.service.js.map