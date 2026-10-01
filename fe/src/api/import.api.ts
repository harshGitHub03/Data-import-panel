import { api } from './client';

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export async function importFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post<ImportResult>('/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
