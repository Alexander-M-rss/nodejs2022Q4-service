import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { finished } from 'stream';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  private startTime: number;

  use(req: Request, resp: Response, next: NextFunction) {
    this.startTime = Date.now();
    finished(req, () => {
      this.startTime = Date.now();
    });
    next();
    finished(resp, () => {
      const time = Date.now() - this.startTime;
      const logMessage = this.formatLogMessage(time, req, resp);

      this.logger.log(logMessage, LoggerMiddleware.name);
    });
  }

  private formatLogMessage(time: number, req: Request, resp: Response) {
    const { method, originalUrl, query, params, body } = req;
    const { statusCode, statusMessage } = resp;
    const reqLog = `
  ${method} ${originalUrl}
  query: ${JSON.stringify(query)}
  params: ${JSON.stringify(params)}
  body: ${JSON.stringify(body)}\n`;
    const respLog = `status code: ${statusCode}\nstatus message: ${statusMessage}`;
    const log = `\nRequest has proceeded in ${time} ms${reqLog}${respLog}`;

    return log;
  }
}
