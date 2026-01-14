import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from '../utils/AppError';

export const validateParam =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(
        new AppError(
          'Consulta inválida o incompleta',
          400,
          'INVALID_PARAM',
          `Param validation failed at ${req.method} ${req.originalUrl}: ${JSON.stringify(result.error.errors)}`,
        ),
      );
    }

    next();
  };
