import { Request, Response } from 'express';
import { getJetlagService } from './jetlag.service';

export const getJetlag = (req: Request, res: Response) => {
  const jetlagPlan = getJetlagService();
  res.json(jetlagPlan);
};
