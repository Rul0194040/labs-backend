import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { OnlineService } from './online.service';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>(ConfigKeys.REDIS_HOST),
        port: configService.get<number>(ConfigKeys.REDIS_PORT),
        db: configService.get<number>(ConfigKeys.REDIS_DB),
        password: configService.get<string>(ConfigKeys.REDIS_PASSWORD),
      }),
    }),
  ],
  providers: [OnlineService],
})
export class OnlineModule {}
