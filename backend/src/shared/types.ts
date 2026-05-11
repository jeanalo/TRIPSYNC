import { Request } from 'express';
import { User } from '../features/users/users.types';

export interface AuthRequest extends Request {
  user?: User;
}

export interface RealtimeRecommendation {
  id: string;
  city: string;
  category: string;
  activityName: string;
  location: string;
  date: string;
  time: string;
  details?: string;
  imageUrl?: string;
}

