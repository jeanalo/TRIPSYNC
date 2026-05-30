import { Router, RequestHandler } from 'express';
import { getAuth, register, login, refresh, logout } from './auth.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as RequestHandler, getAuth as RequestHandler);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export const authRouter = router;