import * as XLSX from 'xlsx';

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, unknown>[];
}

export function parseSpreadsheet(filePath: string): ParsedSheet {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { headers, rows };
}
