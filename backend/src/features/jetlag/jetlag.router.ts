import { Router, RequestHandler } from 'express';
import { getJetlag } from './jetlag.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as RequestHandler, getJetlag as RequestHandler);

export const jetlagRouter = router;
