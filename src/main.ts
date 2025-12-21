import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appConfig } from './configs/env.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = appConfig.port;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

void bootstrap();
