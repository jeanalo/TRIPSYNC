import { Router, RequestHandler } from 'express';
import { getUsers, updateUser } from './users.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as RequestHandler, getUsers as RequestHandler);
router.patch('/:id', authMiddleware as RequestHandler, updateUser as RequestHandler);

export const usersRouter = router;
