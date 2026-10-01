import { Request, Response } from 'express';
import fs from 'fs';
import { parseSpreadsheet } from '../utils/parseSpreadsheet';
import { validateRows } from '../utils/mapRows';
import RecordModel from '../models/Record';

export async function importRecords(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { rows } = parseSpreadsheet(req.file.path);
  const { valid, errors } = validateRows(rows);

  let inserted: unknown[] = [];
  if (valid.length > 0) {
    inserted = await RecordModel.insertMany(valid);
  }

  fs.unlink(req.file.path, () => {});

  res.json({
    imported: inserted.length,
    skipped: errors.length,
    errors,
  });
}
