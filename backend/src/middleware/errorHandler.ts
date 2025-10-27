import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * 错误处理中间件
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    code: statusCode === 500 ? -1 : statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};

/**
 * 404 处理中间件
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    code: -1,
    message: `Route ${req.originalUrl} not found`
  });
};

