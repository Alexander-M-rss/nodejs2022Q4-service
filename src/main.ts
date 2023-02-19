import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { parse } from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const source = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(source);
  SwaggerModule.setup('doc', app, document);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0')
    .build();
  const documentApi = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentApi);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
