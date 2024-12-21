import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable versioning
  app
    .setGlobalPrefix('/api')
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
