import mongoose, { Schema, Document } from 'mongoose';
import { RECORD_TYPES, LINK_STATUSES, DOWNLOAD_STATUSES, RecordType, LinkStatus, DownloadStatus } from '../constants';

export interface IRecord extends Document {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  organisation?: string;
  type: RecordType;
  linkStatus: LinkStatus;
  downloadStatus: DownloadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    organisation: { type: String, trim: true },
    type: { type: String, enum: RECORD_TYPES, required: true },
    linkStatus: { type: String, enum: LINK_STATUSES, default: 'Pending' },
    downloadStatus: { type: String, enum: DOWNLOAD_STATUSES, default: 'Pending' },
  },
  { timestamps: true }
);

recordSchema.index({ name: 'text', email: 'text', phone: 'text' });

export default mongoose.model<IRecord>('Record', recordSchema);
