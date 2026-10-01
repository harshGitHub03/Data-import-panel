export const RECORD_TYPES = ['Student', 'Teacher', 'Mentor', 'JobSeeker', 'Institute', 'Other'] as const;
export const LINK_STATUSES = ['Pending', 'Sent'] as const;
export const DOWNLOAD_STATUSES = ['Pending', 'Downloaded'] as const;

export interface DataRecord {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  organisation?: string;
  type: (typeof RECORD_TYPES)[number];
  linkStatus: (typeof LINK_STATUSES)[number];
  downloadStatus: (typeof DOWNLOAD_STATUSES)[number];
  createdAt: string;
}
