import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export async function listUsers(req: Request, res: Response) {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);

  const [data, total] = await Promise.all([
    User.find()
      .select('email role createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(),
  ]);

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function createUser(req: Request, res: Response) {
  const { email, password, role } = req.body as { email?: string; password?: string; role?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(409).json({ message: 'A user with this email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase().trim(),
    password: hashed,
    role: role === 'admin' ? 'admin' : 'user',
  });
  res.status(201).json({ _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt });
}

export async function updateUser(req: Request, res: Response) {
  const { email, password, role } = req.body as { email?: string; password?: string; role?: string };
  const update: Record<string, unknown> = {};
  if (email) update.email = email.toLowerCase().trim();
  if (role) update.role = role;
  if (password) update.password = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select(
    'email role createdAt'
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
}
