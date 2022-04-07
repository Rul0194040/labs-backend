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
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_1 = require("../../logger");
const configkeys_enum_1 = require("../enum/configkeys.enum");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_1.MyLogger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { url, body } = request;
        const errorResponse = {
            path: url,
            timestamp: new Date().toISOString(),
            name: exception.name,
            message: exception.message,
            method: request.method,
            code: exception.getStatus(),
            exception: null,
            requestBody: null,
        };
        if (this.configService.get(configkeys_enum_1.ConfigKeys.NODE_ENV) !== 'production') {
            errorResponse.exception = exception;
            errorResponse.requestBody = body;
            this.logger.verbose(errorResponse);
        }
        response.status(exception.getStatus()).json(errorResponse);
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    common_1.Catch(common_1.HttpException),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exceptions.filter.js.map