import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Get config with defaults
  const port = configService.get<number>('config.app.port', 3000);
  const corsOrigin = configService.get<string | string[]>(
    'config.app.corsOrigin',
    ['http://localhost:3000', 'http://localhost:5173'],
  );
  const apiPrefix = configService.get<string>('config.app.apiPrefix', 'api');

  // Enable CORS with type safety
  if (typeof corsOrigin === 'string') {
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });
  }

  // Set global prefix with fallback
  app.setGlobalPrefix(apiPrefix || 'api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port || 3000);
  console.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
}


bootstrap();
