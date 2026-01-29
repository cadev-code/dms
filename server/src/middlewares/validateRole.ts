import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import prisma from '../prisma_client';

type Role = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'USER';

export const validateRole =
  (authorizedRole: Role) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (user?.role !== authorizedRole) {
        return next(
          new AppError(
            'Usuario no autorizado para realizar esta acción',
            403,
            'ROLE_UNAUTHORIZED',
            `Intento de acción con rol ${user?.role}, se requiere ${authorizedRole} - Intentado por usuario: ${user?.username || 'Unknown'}`,
          ),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
