import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS User Authentication API')
    .setDescription('Complete user authentication system with JWT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
