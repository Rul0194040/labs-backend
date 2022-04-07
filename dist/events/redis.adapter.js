"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisAdapter = void 0;
const config_1 = require("@nestjs/config");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const redis_1 = require("redis");
const socket_io_redis_1 = require("socket.io-redis");
const configService = new config_1.ConfigService();
const pubClient = new redis_1.RedisClient({
    host: configService.get(configkeys_enum_1.ConfigKeys.REDIS_HOST),
    port: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PORT),
    auth_pass: configService.get(configkeys_enum_1.ConfigKeys.REDIS_PASSWORD),
});
const subClient = pubClient.duplicate();
const redisAdapter = socket_io_redis_1.createAdapter({ pubClient, subClient });
class RedisAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisAdapter = RedisAdapter;
//# sourceMappingURL=redis.adapter.js.map