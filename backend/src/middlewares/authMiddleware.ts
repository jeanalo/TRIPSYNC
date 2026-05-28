import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../shared/types';
import { UserRole } from '../features/users/users.types';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email ?? '',
      name: (user.user_metadata?.full_name as string) ?? user.email ?? '',
      role: (profile?.role as UserRole) ?? 'user',
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
