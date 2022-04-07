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
var TypeORMExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_1 = require("../../logger");
const typeorm_1 = require("typeorm");
const configkeys_enum_1 = require("../enum/configkeys.enum");
let TypeORMExceptionFilter = TypeORMExceptionFilter_1 = class TypeORMExceptionFilter {
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_1.MyLogger(TypeORMExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { url } = request;
        const { name, message } = exception;
        const errorResponse = {
            path: url,
            timestamp: new Date().toISOString(),
            name: name,
            message: message,
            exception: null,
        };
        if (this.configService.get(configkeys_enum_1.ConfigKeys.NODE_ENV) !== 'production') {
            errorResponse.exception = exception;
            this.logger.error(errorResponse);
            this.logger.log(exception.stack);
        }
        response.status(common_1.HttpStatus.BAD_REQUEST).json(errorResponse);
    }
};
TypeORMExceptionFilter = TypeORMExceptionFilter_1 = __decorate([
    common_1.Catch(typeorm_1.QueryFailedError),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeORMExceptionFilter);
exports.TypeORMExceptionFilter = TypeORMExceptionFilter;
//# sourceMappingURL=typeorm-exceptions.filter.js.map