"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const moduleAlias = require("module-alias");
const configkeys_enum_1 = require("./common/enum/configkeys.enum");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path = require("path");
const morgan = require("morgan");
const Sentry = require("@sentry/node");
const http_exceptions_filter_1 = require("./common/filters/http-exceptions.filter");
const typeorm_exceptions_filter_1 = require("./common/filters/typeorm-exceptions.filter");
const helmet = require("helmet");
const redis_adapter_1 = require("./events/redis.adapter");
const logger_1 = require("./logger");
moduleAlias.addAliases({
    '@sanfrancisco': path.resolve(__dirname),
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const initLogger = new logger_1.MyLogger(app_module_1.AppModule.name);
    if (configService.get(configkeys_enum_1.ConfigKeys.REDIS_HOST) &&
        configService.get(configkeys_enum_1.ConfigKeys.REDIS_PORT) &&
        configService.get(configkeys_enum_1.ConfigKeys.REDIS_PASSWORD)) {
        initLogger.log('Web Sockets Redis.io adapter is enabled.');
        app.useWebSocketAdapter(new redis_adapter_1.RedisAdapter(app));
    }
    app.use(helmet());
    if (configService.get(configkeys_enum_1.ConfigKeys.SENTRY_DSN)) {
        initLogger.log('Sentry.io is enabled.');
        Sentry.init({
            dsn: configService.get(configkeys_enum_1.ConfigKeys.SENTRY_DSN),
        });
    }
    app.enableCors({
        origin: configService
            .get(configkeys_enum_1.ConfigKeys.BASE_URL)
            .split(',')
            .map((o) => o.trim()),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: [
            'Authorization',
            'Content-Type',
            'Accept',
            'User-Agent',
            'Api-Key',
        ],
    });
    app.set('trust proxy', 1);
    app.setGlobalPrefix(configService.get(configkeys_enum_1.ConfigKeys.API_ROUTE));
    const appPackage = JSON.parse(fs_1.readFileSync('package.json').toString());
    const options = new swagger_1.DocumentBuilder()
        .setTitle(appPackage.name)
        .setDescription(appPackage.description)
        .setVersion(appPackage.version)
        .setContact(appPackage.author.name, appPackage.author.url, appPackage.author.email)
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`${configService.get(configkeys_enum_1.ConfigKeys.API_ROUTE)}/${configService.get(configkeys_enum_1.ConfigKeys.API_SWAGGER)}`, app, document);
    app.useGlobalFilters(new typeorm_exceptions_filter_1.TypeORMExceptionFilter(configService), new http_exceptions_filter_1.HttpExceptionFilter(configService));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(morgan(configService.get(configkeys_enum_1.ConfigKeys.MORGAN_TYPE)));
    await app.listen(configService.get(configkeys_enum_1.ConfigKeys.PORT));
}
bootstrap();
//# sourceMappingURL=main.js.map