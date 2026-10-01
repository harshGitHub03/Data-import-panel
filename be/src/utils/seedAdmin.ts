import bcrypt from 'bcryptjs';
import User from '../models/User';

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await User.findOne({ email });
  if (existing) return;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed, role: 'admin' });
  console.log(`Seeded admin user: ${email}`);
}
