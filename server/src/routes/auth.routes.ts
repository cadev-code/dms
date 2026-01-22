import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from 'express';
import { validateInput } from '../middlewares/validateInput';
import { loginSchema } from '../schemas/auth.schema';
import { login } from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import prisma from '../prisma_client';

const router = Router();

router.post('/auth/login', validateInput(loginSchema), login);

router.get(
  '/auth/me',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, fullname: true, role: true },
      });

      if (!user) {
        res.status(404).json({
          message: 'Usuario no encontrado',
          error: 'USER_NOT_FOUND',
        });
        return;
      }

      res.json({
        userId: user.id,
        fullname: user.fullname,
        role: user.role,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('access_token').json({ message: 'Sesión cerrada' });
});

export default router;
