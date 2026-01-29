import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appConfig } from './configs/env.config';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { FILE_ROOT } from './configs/file-manager.config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // Public resources
  fs.mkdirSync(FILE_ROOT, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useStaticAssets(FILE_ROOT, { prefix: '/resources' });

  app.use(json({ limit: '50mb', type: ['application/json', 'text/plain'] }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = appConfig.port;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

void bootstrap();
