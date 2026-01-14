import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from '../utils/AppError';
import fs from 'fs';

export const validateInput =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const file = req.file;

      if (file) {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
      }

      return next(
        new AppError(
          'Datos inválidos o incompletos',
          400,
          'INVALID_INPUT',
          `Validation failed at ${req.method} ${req.originalUrl}: ${JSON.stringify(result.error.errors)}`,
        ),
      );
    }

    req.body = result.data;
    next();
  };
