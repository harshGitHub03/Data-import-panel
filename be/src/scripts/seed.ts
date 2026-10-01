import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../db';
import { seedAdmin } from '../utils/seedAdmin';

connectDB()
  .then(seedAdmin)
  .then(() => mongoose.disconnect())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
  });
