import { type Request, type Response, Router } from 'express';
import { validateInput } from '../middlewares/validateInput';
import { loginSchema } from '../schemas/auth.schema';
import { login } from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/auth/login', validateInput(loginSchema), login);

router.get('/auth/me', authMiddleware, (req: Request, res: Response) => {
  res.json({
    userId: req.userId,
  });
});

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('access_token').json({ message: 'Sesión cerrada' });
});

export default router;
