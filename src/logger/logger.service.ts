import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LOGS_PATH = 'logs';

const LEVELS: LogLevel[] = ['error', 'log', 'warn', 'debug', 'verbose'];
const ENV_LOG_LEVEL = isNaN(+process.env.LOG_LEVEL)
  ? -1
  : +process.env.LOG_LEVEL;
const LOG_LEVEL =
  ENV_LOG_LEVEL > 0 && ENV_LOG_LEVEL <= LEVELS.length ? ENV_LOG_LEVEL : 2;
const logLevels = LEVELS.slice(0, LOG_LEVEL);
const MAX_SIZE_TRESHOLD =
  +process.env.LOG_MAX_SIZE_TRESHOLD_KB > 0
    ? +process.env.LOG_MAX_SIZE_TRESHOLD_KB
    : 10;

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private logTime: number;
  private errLogTime: number;
  private readonly logsPath: string;
  private readonly maxSizeTreshold: number;
  constructor() {
    super();
    this.setLogLevels(logLevels);
    this.logsPath = join(process.cwd(), LOGS_PATH);
    this.logTime = Date.now();
    this.errLogTime = this.logTime;
    this.maxSizeTreshold = MAX_SIZE_TRESHOLD * 1000;
  }

  error(message: any, stack: any, ...optionalParams: any) {
    this.logToFile(message, stack, 'ERROR');
    super.error(message, stack, ...optionalParams);
  }
  log(message: any, context: any, ...optionalParams: any) {
    this.logToFile(message, context, 'LOG');
    super.log(message, context, ...optionalParams);
  }
  warn(message: any, context: any, ...optionalParams: any) {
    this.logToFile(message, context, 'WARN');
    super.warn(message, context, ...optionalParams);
  }
  debug(message: any, context: any, ...optionalParams: any) {
    this.logToFile(message, context, 'DEBUG');
    super.debug(message, context, ...optionalParams);
  }
  verbose(message: any, context: any, ...optionalParams: any) {
    this.logToFile(message, context, 'VERBOSE');
    super.verbose(message, context, ...optionalParams);
  }

  private logToFile(message: any, context: any, type: string) {
    if (!existsSync(this.logsPath)) {
      mkdirSync(this.logsPath, { recursive: true });
    }

    const logMessage = `[${this.getTimestamp()}][${type}][${context}] ${message}\n`;
    let filePath = this.getLogPath(type);

    try {
      const { size } = statSync(filePath);

      if (size >= this.maxSizeTreshold) {
        if (type === 'ERROR') {
          this.errLogTime = Date.now();
        } else {
          this.logTime = Date.now();
        }

        filePath = this.getLogPath(type);
      }
    } catch {
    } finally {
      writeFileSync(filePath, logMessage, { flag: 'as' });
    }
  }

  private getLogPath(type: string) {
    const path = join(
      this.logsPath,
      `/${
        type === 'ERROR' ? `errors-${this.errLogTime}` : `logs-${this.logTime}`
      }.log`,
    );

    return path;
  }
}
