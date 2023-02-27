import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const resp = ctx.getResponse<Response>();

    const { statusCode, statusMessage, stack } =
      exception instanceof HttpException
        ? {
            statusCode: exception.getStatus(),
            statusMessage:
              exception.getResponse()['message'] || exception.getResponse(),
            stack: exception.stack,
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            statusMessage: 'Internal server error has occurred',
            stack: JSON.stringify(exception),
          };
    const logMessage = this.formatLogMessage(req, statusCode, statusMessage);

    this.logger.error(logMessage, stack);
    resp.status(statusCode).json({ statusMessage, timestamp: Date.now() });
  }

  private formatLogMessage(
    req: Request,
    statusCode: number,
    statusMessage: string,
  ) {
    const { method, originalUrl, query, params, body } = req;
    const reqLog = `
  ${method} ${originalUrl}
  query: ${JSON.stringify(query)}
  params: ${JSON.stringify(params)}
  body: ${JSON.stringify(body)}\n`;
    const respLog = `status code: ${statusCode}\nstatus message: ${statusMessage}`;
    const log = `${reqLog}${respLog}`;

    return log;
  }
}
