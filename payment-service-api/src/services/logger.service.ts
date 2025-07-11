import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

// Formato personalizado para os logs
const customFormat = printf((info) => {
  const { level, message, timestamp, ...metadata } = info;
  
  let metadataStr = '';
  if (Object.keys(metadata).length > 0) {
    metadataStr = '\n' + JSON.stringify(metadata, null, 2);
  }

  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metadataStr}`;
});

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error'
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log'
    })
  ]
});

interface ContextLogger {
  error(message: string, metadata?: object): void;
  warn(message: string, metadata?: object): void;
  info(message: string, metadata?: object): void;
  http(message: string, metadata?: object): void;
  debug(message: string, metadata?: object): void;
}

// Função para criar um logger com contexto
export function createLogger(context: string): ContextLogger {
  return {
    error: (message: string, metadata: object = {}) => {
      logger.error(message, { context, ...metadata });
    },
    warn: (message: string, metadata: object = {}) => {
      logger.warn(message, { context, ...metadata });
    },
    info: (message: string, metadata: object = {}) => {
      logger.info(message, { context, ...metadata });
    },
    http: (message: string, metadata: object = {}) => {
      logger.http(message, { context, ...metadata });
    },
    debug: (message: string, metadata: object = {}) => {
      logger.debug(message, { context, ...metadata });
    }
  };
}

// Middleware para logs de requisições HTTP
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
}; 