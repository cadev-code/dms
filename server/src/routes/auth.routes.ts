import { Router } from 'express';
import { validateInput } from '../middlewares/validateInput';
import { loginSchema } from '../schemas/auth.schema';
import { login } from '../controllers/auth.controllers';

const router = Router();

router.post('/auth/login', validateInput(loginSchema), login);

export default router;
