import { Router } from 'express';
import { getAuth, register, login } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, getAuth);
router.post('/register', register);
router.post('/login', login);

export const authRouter = router;