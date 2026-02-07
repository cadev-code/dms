import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';
import prisma from '../prisma_client';

export const authMiddleware = async (
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

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.isActive) {
      throw new AppError(
        'Usuario deshabilitado o inexistente',
        401,
        'USER_DISABLED',
        'Intento de acción con usuario deshabilitado o inexistente',
      );
    }

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
