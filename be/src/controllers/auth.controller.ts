import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user._id, email: user.email, role: user.role } });
}

export async function logout(_req: AuthRequest, res: Response) {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response) {
  res.json({ user: req.user });
}
