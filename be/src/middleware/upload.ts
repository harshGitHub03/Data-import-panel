import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const ALLOWED_EXTENSIONS = new Set(['.xlsx', '.xls', '.csv']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    cb(new Error('Only .xlsx, .xls and .csv files are allowed'));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
