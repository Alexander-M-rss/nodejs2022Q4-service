import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { CustomLogger } from './logger.service';

@Module({
  providers: [CustomLogger, LoggerMiddleware],
  exports: [CustomLogger, LoggerMiddleware],
})
export class LoggerModule {}
