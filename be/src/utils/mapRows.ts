import { normalizeType, normalizeLinkStatus, normalizeDownloadStatus } from './normalize';

export function validateRows(rows: Record<string, unknown>[]) {
  const valid: any[] = [];
  const errors: string[] = [];

  const getValue = (row: Record<string, unknown>, field: string) => {
    const value = row[field];
    return value === undefined || value === null ? '' : String(value).trim();
  };

  rows.forEach((row, index) => {
    const name = getValue(row, 'name');
    const type = normalizeType(getValue(row, 'type'));

    if (!name || !type) {
      errors.push(`Row ${index + 2}: missing/invalid name or type`);
      return;
    }

    valid.push({
      name,
      email: getValue(row, 'email') || undefined,
      phone: getValue(row, 'phone') || undefined,
      address: getValue(row, 'address') || undefined,
      organisation: getValue(row, 'organisation') || undefined,
      type,
      linkStatus: normalizeLinkStatus(getValue(row, 'linkStatus')) || 'Pending',
      downloadStatus: normalizeDownloadStatus(getValue(row, 'downloadStatus')) || 'Pending',
    });
  });

  return { valid, errors };
}
