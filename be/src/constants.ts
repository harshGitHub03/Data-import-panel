export const RECORD_TYPES = ['Student', 'Teacher', 'Mentor', 'JobSeeker', 'Institute', 'Other'] as const;
export const LINK_STATUSES = ['Pending', 'Sent'] as const;
export const DOWNLOAD_STATUSES = ['Pending', 'Downloaded'] as const;

export type RecordType = (typeof RECORD_TYPES)[number];
export type LinkStatus = (typeof LINK_STATUSES)[number];
export type DownloadStatus = (typeof DOWNLOAD_STATUSES)[number];
