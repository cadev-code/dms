import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';

export const requireRole =
  (allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        throw new AppError(
          'Usuario no autorizado para esta acción.',
          403,
          'UNAUTHORIZED_ACCESS',
          `Intento de acción no autorizada por el usuario ${user?.username || 'Unknown'} (Rol: ${user?.role || 'N/A'})`,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
