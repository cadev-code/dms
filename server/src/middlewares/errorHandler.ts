import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // si es un error esperado
  if (err instanceof AppError) {
    logger.warn(`${err.code}: ${err.logMessage || err.message}`);
    res.status(err.status).json({ error: err.code, message: err.message });
    return;
  }

  // si es un error inesperado
  if (err instanceof Error) {
    logger.error(`Unexpected error: ${err.message}`);
  } else {
    logger.error(`Unexpected non-error value: ${JSON.stringify(err)}`);
  }

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Error en el servidor.',
  });
};
