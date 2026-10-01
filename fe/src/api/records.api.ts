import { api } from './client';
import type { DataRecord } from '../types';

export interface RecordFilters {
  type?: string;
  search?: string;
  linkStatus?: string;
  downloadStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface RecordsResult {
  data: DataRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Summary {
  all: number;
  students: number;
  teachers: number;
  institutes: number;
  byType: Record<string, number>;
}

export async function fetchRecords(filters: RecordFilters) {
  const res = await api.get<RecordsResult>('/records', { params: filters });
  return res.data;
}

export async function fetchSummary() {
  const res = await api.get<Summary>('/records/summary');
  return res.data;
}

export async function fetchRecord(id: string) {
  const res = await api.get<DataRecord>(`/records/${id}`);
  return res.data;
}

export async function updateRecord(id: string, payload: Partial<DataRecord>) {
  const res = await api.patch<DataRecord>(`/records/${id}`, payload);
  return res.data;
}

export async function deleteRecord(id: string) {
  await api.delete(`/records/${id}`);
}
