import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as AuthRequest['user'];
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
