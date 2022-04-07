"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const online_service_1 = require("./online.service");
const redisStore = require("cache-manager-redis-store");
let OnlineModule = class OnlineModule {
};
OnlineModule = __decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    store: redisStore,
                    host: configService.get(configkeys_enum_1.ConfigKeys.REDIS_HOST),
                    port: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PORT),
                    db: configService.get(configkeys_enum_1.ConfigKeys.REDIS_DB),
                    password: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PASSWORD),
                }),
            }),
        ],
        providers: [online_service_1.OnlineService],
    })
], OnlineModule);
exports.OnlineModule = OnlineModule;
//# sourceMappingURL=online.module.js.map