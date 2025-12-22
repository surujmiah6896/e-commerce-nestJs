// src/modules/redis/redis.module.ts - UPDATED
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('config.redis.host', 'localhost'),
            port: configService.get<number>('config.redis.port', 6379),
          },
          password: configService.get<string>('config.redis.password'),
          ttl: configService.get<number>('config.redis.ttl', 300) * 1000, // Convert to ms
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          store: () => store,
        } as any; // Type assertion for now
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
