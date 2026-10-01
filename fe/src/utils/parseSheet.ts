import * as XLSX from 'xlsx';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function parseSheet(file: File) {
  const workbook = XLSX.read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = sheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' }) : [];
  return { headers: rows[0] ? Object.keys(rows[0]) : [], rows };
}
