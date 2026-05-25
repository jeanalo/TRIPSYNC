import { Router } from 'express';
import { getJetlag } from './jetlag.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as any, getJetlag);

export const jetlagRouter = router;
