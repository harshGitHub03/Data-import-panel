import { RECORD_TYPES, LINK_STATUSES, DOWNLOAD_STATUSES, RecordType, LinkStatus, DownloadStatus } from '../constants';

function matchEnum<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  return allowed.find((candidate) => candidate.toLowerCase() === normalized);
}

export function normalizeType(value: unknown): RecordType | undefined {
  return matchEnum(value, RECORD_TYPES);
}

export function normalizeLinkStatus(value: unknown): LinkStatus | undefined {
  return matchEnum(value, LINK_STATUSES);
}

export function normalizeDownloadStatus(value: unknown): DownloadStatus | undefined {
  return matchEnum(value, DOWNLOAD_STATUSES);
}
