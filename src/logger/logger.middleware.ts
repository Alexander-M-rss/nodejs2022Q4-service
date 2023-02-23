import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { finished } from 'stream';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private startTime: number;

  use(req: Request, resp: Response, next: NextFunction) {
    this.startTime = Date.now();
    finished(req, () => {
      this.startTime = Date.now();
    });
    next();
    finished(resp, () => {
      const time = Date.now() - this.startTime;
      const logMessage = this.formatLogMessage(this.startTime, time, req, resp);

      console.log('[LOG] ', logMessage);
    });
  }

  private formatLogMessage(
    startTime: number,
    time: number,
    req: Request,
    resp: Response,
  ) {
    const { method, originalUrl, query, params, body } = req;
    const { statusCode, statusMessage } = resp;
    const reqLog = `
  ${method} ${originalUrl}
  query: ${JSON.stringify(query)}
  params: ${JSON.stringify(params)}
  body: ${JSON.stringify(body)}\n`;
    const respLog = `status code: ${statusCode}\nstatus message: ${statusMessage}\n`;
    const timeStamp = new Date(startTime).toUTCString();
    const log = `${timeStamp} proceed in ${time} ms${reqLog}${respLog}\n`;

    return log;
  }
}
