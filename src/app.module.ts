import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { configValidationSchema } from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Import your feature modules
// import { UsersModule } from './modules/users/users.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { ProductsModule } from './modules/products/products.module';
// import { CategoriesModule } from './modules/categories/categories.module';
// import { OrdersModule } from './modules/orders/orders.module';
// import { HealthModule } from './modules/health/health.module';
import { CategoryModule } from './modules/category/category.module';
import { GlobalModule } from './shared/global/global.module';

@Module({
  imports: [
    // 1. Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      cache: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 2. Database Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('config.database.host', 'localhost'),
        port: configService.get<number>('config.database.port', 5432),
        username: configService.get<string>(
          'config.database.username',
          'postgres',
        ),
        password: configService.get<string>(
          'config.database.password',
          'password',
        ),
        database: configService.get<string>(
          'config.database.database',
          'ecommerce_db',
        ),
        synchronize: configService.get<boolean>(
          'config.database.synchronize',
          true,
        ),
        logging: configService.get<boolean>('config.database.logging', false),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsTableName: 'typeorm_migrations',
        extra: {
          max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
        },
      }),
      inject: [ConfigService],
    }),

    RedisModule,

    // 4. Rate Limiting Module - FIXED: Return proper ThrottlerModuleOptions
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('config.security.rateLimit.ttl', 60),
            limit: configService.get<number>(
              'config.security.rateLimit.limit',
              100,
            ),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    AuthModule,

    UsersModule,
    CategoryModule,
    GlobalModule,

    // 6. Your Feature Modules
    // HealthModule,
    // AuthModule,
    // UsersModule,
    // ProductsModule,
    // CategoriesModule,
    // OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
