import { MorganTypes } from './common/enum/morganTypes.enum';
import * as Joi from '@hapi/joi';
export const AppConfig = {
  validationSchema: Joi.object({
    ENABLE_SYSLOG: Joi.boolean().default(true),
    MORGAN_TYPE: Joi.string().default(MorganTypes.COMBINED),
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().default(3000),
    API_ROUTE: Joi.string().default('api/v1'),
    API_SWAGGER: Joi.string().default('swagger'),
    PX_API_KEY: Joi.string().default('110719fd-de8c-4fae-a799-d00da4b52b32'),

    //jwt
    JWT_SECRET: Joi.string().default('changeme!'),
    JWT_EXPIRATION: Joi.string().default('8h'),
    JWT_REMEMBERME_EXPIRATION: Joi.string().default('30d'),

    //usuarios
    CREATE_USERS: Joi.boolean().default(true),
    FIRST_PASSWORD: Joi.string().default('password'),

    BASE_URL: Joi.string().default('http://localhost:4200,app://localhost'),

    //sentry.io
    SENTRY_DSN: Joi.string().default(''),

    //mysql
    MYSQL_DB: Joi.string().default('sanfrancisco'),
    MYSQL_HOST: Joi.string().default('localhost'),
    MYSQL_USER: Joi.string().default('sanfrancisco'),
    MYSQL_PORT: Joi.number().default(3306),
    MYSQL_PASSWORD: Joi.string().default('mysqlpassanfranciscosword'),

    //twilio
    TWILIO_NUMBER: Joi.string().default(''),
    TWILIO_ID: Joi.string().default(''),
    TWILIO_KEY: Joi.string().default(''),

    //smtp
    SMTP_USER: Joi.string().default(''),
    SMTP_PASSWORD: Joi.string().default(''),
    SMTP_FROM_EMAIL: Joi.string().default(''),
    SMTP_FROM_NAME: Joi.string().default('San Francisco Mailer'),
    SMTP_HOST: Joi.string().default('smtp.gmail.com'),
    SMTP_PORT: Joi.number().default(465),
    SMTP_SECURE: Joi.boolean().default(true),
    SMTP_IGNORE_TLS: Joi.boolean().default(true),
    SEND_USER_EMAILS: Joi.boolean().default(false),

    EMAILS_INBOX: Joi.string().default(''),
    SITE_NAME: Joi.string().default('San Francisco'),

    PX_LAB_SERVER: Joi.string().default(''),

    REDIS_HOST: Joi.string().default('127.0.0.1'),
    REDIS_PASSWORD: Joi.string().default(''),
    REDIS_PORT: Joi.number().default(6379),
    REDISDB: Joi.number().default(1),
    REDIS_PREFIX: Joi.string().default('labs'),

    GELF_SERVER_IP: Joi.string().default(''),
    GELF_PORT: Joi.number().default(12201),
    GELF_FACILITY: Joi.string().default('labs-back'),
    WACHABOT_TOKEN: Joi.string().default(''),
    WACHABOT_URL: Joi.string().default(
      'https://app.wachatbot.com:12345/api/message/send',
    ),
    WACHABOT_PREFIX: Joi.string().default('+52'),
    WACHABOT_EMPRESA: Joi.string().default('Laboratorio Clínico San Francisco'),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  isGlobal: true,
};
