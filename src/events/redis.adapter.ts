import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { RedisClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
const configService = new ConfigService();

const pubClient = new RedisClient({
  host: configService.get<string>(ConfigKeys.REDIS_HOST),
  port: configService.get<string>(ConfigKeys.REDIS_PORT),
  auth_pass: configService.get<string>(ConfigKeys.REDIS_PASSWORD),
});
const subClient = pubClient.duplicate();
const redisAdapter = createAdapter({ pubClient, subClient });

export class RedisAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}
