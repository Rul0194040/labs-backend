"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XquendaMiddleware = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const configkeys_enum_1 = require("../enum/configkeys.enum");
const config_1 = require("@nestjs/config");
let XquendaMiddleware = class XquendaMiddleware {
    constructor() {
        this.configService = new config_1.ConfigService();
        this.appPackage = JSON.parse(fs_1.readFileSync('package.json').toString());
    }
    use(req, res, next) {
        res.set('X-Powered-By', `${this.appPackage.author.name}`);
        res.set('X-Powered-Description', this.appPackage.description);
        res.set('X-Powered-Version', this.appPackage.version);
        res.set('X-Powered-Url', `${this.appPackage.author.url}`);
        res.set('X-Powered-Email', `${this.appPackage.author.email}`);
        res.set('X-Powered-Contact', this.appPackage.author.contact);
        res.set('X-Powered-License', this.appPackage.license);
        if (!this.configService.get(configkeys_enum_1.ConfigKeys.API_KEY)) {
            return next();
        }
        if (!req.headers['api-key']) {
            throw new common_1.HttpException('Missing api-key in headers.', common_1.HttpStatus.BAD_REQUEST);
        }
        const keys = this.configService
            .get(configkeys_enum_1.ConfigKeys.API_KEY)
            .split(',')
            .map((a) => a.trim());
        const apiKey = req.headers['api-key'].toString();
        if (keys.indexOf(apiKey) > -1) {
            return next();
        }
        throw new common_1.HttpException('Invalid api-key.', common_1.HttpStatus.BAD_REQUEST);
    }
};
XquendaMiddleware = __decorate([
    common_1.Injectable()
], XquendaMiddleware);
exports.XquendaMiddleware = XquendaMiddleware;
//# sourceMappingURL=xquenda.middleware.js.map