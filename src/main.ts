import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as moduleAlias from 'module-alias';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter';
import { TypeORMExceptionFilter } from './common/filters/typeorm-exceptions.filter';
import * as helmet from 'helmet';
import { RedisAdapter } from './events/redis.adapter';
import { MyLogger } from './logger';

moduleAlias.addAliases({
  '@sanfrancisco': path.resolve(__dirname),
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const initLogger = new MyLogger(AppModule.name);

  if (
    configService.get<string>(ConfigKeys.REDIS_HOST) &&
    configService.get<string>(ConfigKeys.REDIS_PORT) &&
    configService.get<string>(ConfigKeys.REDIS_PASSWORD)
  ) {
    initLogger.log('Web Sockets Redis.io adapter is enabled.');
    app.useWebSocketAdapter(new RedisAdapter(app));
  }

  app.use(helmet());

  //sentry.io
  if (configService.get<string>(ConfigKeys.SENTRY_DSN)) {
    initLogger.log('Sentry.io is enabled.');
    Sentry.init({
      dsn: configService.get<string>(ConfigKeys.SENTRY_DSN),
    });
  }

  app.enableCors({
    origin: configService
      .get<string>(ConfigKeys.BASE_URL)
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

  //esta app estará detras de un reverse proxy en nginx
  app.set('trust proxy', 1);

  //prefijo global para todas las apis, configurado en app.module en los valores config default
  app.setGlobalPrefix(configService.get<string>(ConfigKeys.API_ROUTE));

  /**/
  //obtener valores del package.json
  const appPackage = JSON.parse(readFileSync('package.json').toString());
  //preparar la generacion de la documentación del api con los valores de json
  const options = new DocumentBuilder()
    .setTitle(appPackage.name)
    .setDescription(appPackage.description)
    .setVersion(appPackage.version)
    .setContact(
      appPackage.author.name,
      appPackage.author.url,
      appPackage.author.email,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  //ruta de acceso a la documentación del api
  SwaggerModule.setup(
    `${configService.get<string>(
      ConfigKeys.API_ROUTE,
    )}/${configService.get<string>(ConfigKeys.API_SWAGGER)}`,
    app,
    document,
  );
  /**/
  //filter global para las excepciones del orm y http
  app.useGlobalFilters(
    new TypeORMExceptionFilter(configService),
    new HttpExceptionFilter(configService),
  );

  //validacion pipe en todos los puntos del endpoint a travez del dto!
  app.useGlobalPipes(new ValidationPipe());

  //logs de los requests recibidos, con morgan
  app.use(morgan(configService.get<string>(ConfigKeys.MORGAN_TYPE)));

  await app.listen(configService.get<string>(ConfigKeys.PORT));
}
bootstrap();
