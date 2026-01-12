import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new AppError(
      'Usuario no autenticado',
      401,
      'UNAUTHORIZED',
      'Intento de acción sin token de autenticación',
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret',
    ) as { id: number };

    req.userId = decoded.id;

    next();
  } catch {
    throw new AppError(
      'Token inválido o expirado',
      401,
      'UNAUTHORIZED',
      'Intento de acción con token inválido o expirado',
    );
  }
};
