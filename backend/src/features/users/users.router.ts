import { Router } from 'express';
import { getUsers, updateUser } from './users.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as any, getUsers);
router.patch('/:id', authMiddleware as any, updateUser as any);

export const usersRouter = router;
