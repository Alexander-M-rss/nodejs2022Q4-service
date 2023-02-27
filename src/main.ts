import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { parse } from 'yaml';
import { CustomLogger } from './logger/logger.service';

const PORT = +process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(CustomLogger);
  app.useLogger(logger);
  const source = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(source);
  SwaggerModule.setup('doc', app, document);

  process.on('unhandledRejection', (reason) => {
    logger.error(`Reason: ${reason}`, 'unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error(`${err}`, 'uncaughtException');
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
}
bootstrap();

// You can test logging of exception handlers by uncommenting lines:

// setTimeout(() => Promise.reject('unhandledRejection test'), 2000);

// setTimeout(() => {
//   throw new Error('uncaughtException test');
// }, 3000);
