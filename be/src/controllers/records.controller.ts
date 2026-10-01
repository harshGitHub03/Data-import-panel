import { Request, Response } from 'express';
import RecordModel from '../models/Record';
import { RECORD_TYPES } from '../constants';

export async function listRecords(req: Request, res: Response) {
  const { type, search, linkStatus, downloadStatus, dateFrom, dateTo } = req.query as Record<string, string>;
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);

  const filter: Record<string, unknown> = {};

  if (type && type !== 'All') filter.type = type;
  if (linkStatus && linkStatus !== 'All') filter.linkStatus = linkStatus;
  if (downloadStatus && downloadStatus !== 'All') filter.downloadStatus = downloadStatus;

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.$gte = new Date(dateFrom);
    if (dateTo) createdAt.$lte = new Date(dateTo);
    filter.createdAt = createdAt;
  }

  const [data, total] = await Promise.all([
    RecordModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    RecordModel.countDocuments(filter),
  ]);

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getSummary(_req: Request, res: Response) {
  const counts = await RecordModel.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);

  const byType: Record<string, number> = {};
  RECORD_TYPES.forEach((t) => (byType[t] = 0));
  counts.forEach((c) => {
    byType[c._id] = c.count;
  });

  const total = Object.values(byType).reduce((sum, n) => sum + n, 0);

  res.json({
    all: total,
    students: byType.Student,
    teachers: byType.Teacher,
    institutes: byType.Institute,
    byType,
  });
}

export async function getRecord(req: Request, res: Response) {
  const record = await RecordModel.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
}

export async function updateRecord(req: Request, res: Response) {
  const { name, email, phone, address, organisation, type, linkStatus, downloadStatus } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and Type are required' });
  }

  const record = await RecordModel.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, address, organisation, type, linkStatus, downloadStatus },
    { new: true, runValidators: true }
  );

  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
}

export async function deleteRecord(req: Request, res: Response) {
  const record = await RecordModel.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json({ message: 'Record deleted' });
}
