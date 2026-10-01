import { useEffect, useState } from 'react';
import { fetchRecords, fetchSummary, updateRecord, deleteRecord, type Summary } from '../api/records.api';
import type { DataRecord } from '../types';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import EditRecordModal from '../components/EditRecordModal';

const TABS = [
  { label: 'All Data', value: 'All' },
  { label: 'Students', value: 'Student' },
  { label: 'Teachers', value: 'Teacher' },
  { label: 'Mentors', value: 'Mentor' },
  { label: 'Job Seekers', value: 'JobSeeker' },
  { label: 'Institutes', value: 'Institute' },
  { label: 'Others', value: 'Other' },
];

const DATE_RANGES = [
  { label: 'All Time', value: 'All' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
];

const LIMIT = 10;

function dateRangeToFrom(range: string): string | undefined {
  const now = new Date();
  if (range === 'today') return new Date(now.setHours(0, 0, 0, 0)).toISOString();
  if (range === '7d') return new Date(now.getTime() - 7 * 86400000).toISOString();
  if (range === '30d') return new Date(now.getTime() - 30 * 86400000).toISOString();
  return undefined;
}

export default function ManageData() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [linkStatus, setLinkStatus] = useState('All');
  const [downloadStatus, setDownloadStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState<DataRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<DataRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function loadSummary() {
    fetchSummary().then(setSummary).catch(() => {});
  }

  function loadRecords() {
    setLoading(true);
    setError(null);
    fetchRecords({
      type: tab,
      search: search || undefined,
      linkStatus,
      downloadStatus,
      dateFrom: dateRangeToFrom(dateRange),
      page,
      limit: LIMIT,
    })
      .then((res) => {
        setRecords(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setSelected(new Set());
      })
      .catch(() => setError('Failed to load records. Please try again.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadSummary, []);

  useEffect(() => {
    const timeout = setTimeout(loadRecords, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, linkStatus, downloadStatus, dateRange, page]);

  function resetFilters() {
    setSearch('');
    setLinkStatus('All');
    setDownloadStatus('All');
    setDateRange('All');
    setPage(1);
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave(id: string, payload: Partial<DataRecord>) {
    await updateRecord(id, payload);
    loadRecords();
    loadSummary();
  }

  async function handleDelete(id: string) {
    await deleteRecord(id);
    setDeletingId(null);
    loadRecords();
    loadSummary();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Manage Data</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <SummaryCard label="All Data" value={summary?.all} />
        <SummaryCard label="Students" value={summary?.students} />
        <SummaryCard label="Teachers" value={summary?.teachers} />
        <SummaryCard label="Institutes" value={summary?.institutes} />
      </div>

      <div className="flex gap-1 mt-5 overflow-x-auto border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setTab(t.value); setPage(1); }}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${
              tab === t.value ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <input
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] border border-slate-300 rounded px-3 py-1.5 text-sm"
        />
        <select
          value={linkStatus}
          onChange={(e) => { setLinkStatus(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="All">All Status (Link)</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
        </select>
        <select
          value={downloadStatus}
          onChange={(e) => { setDownloadStatus(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="All">All Status (Download)</option>
          <option value="Pending">Pending</option>
          <option value="Downloaded">Downloaded</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded px-2 py-1.5 text-sm"
        >
          {DATE_RANGES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <button onClick={resetFilters} className="px-3 py-1.5 text-sm rounded border border-slate-300">
          Reset Filters
        </button>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2 text-left">S.N.</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone No.</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">Organisation</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Link Status</th>
              <th className="px-3 py-2 text-left">Download Status</th>
              <th className="px-3 py-2 text-left">Added On</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={12} className="px-3 py-6 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={12} className="px-3 py-6 text-center text-red-600">{error}</td></tr>
            )}
            {!loading && !error && records.length === 0 && (
              <tr><td colSpan={12} className="px-3 py-6 text-center text-slate-500">No records match your search/filters.</td></tr>
            )}
            {!loading && !error && records.map((r, i) => (
              <tr key={r._id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelected(r._id)} />
                </td>
                <td className="px-3 py-2">{(page - 1) * LIMIT + i + 1}</td>
                <td className="px-3 py-2 max-w-[140px] truncate" title={r.name}>{r.name}</td>
                <td className="px-3 py-2 max-w-[160px] truncate" title={r.email}>{r.email || '-'}</td>
                <td className="px-3 py-2">{r.phone || '-'}</td>
                <td className="px-3 py-2 max-w-[140px] truncate" title={r.address}>{r.address || '-'}</td>
                <td className="px-3 py-2 max-w-[140px] truncate" title={r.organisation}>{r.organisation || '-'}</td>
                <td className="px-3 py-2"><TypeBadge type={r.type} /></td>
                <td className="px-3 py-2"><StatusBadge status={r.linkStatus} /></td>
                <td className="px-3 py-2"><StatusBadge status={r.downloadStatus} /></td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <button onClick={() => setEditing(r)} className="text-indigo-600 hover:underline mr-3">Update</button>
                  <button onClick={() => setDeletingId(r._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && records.length > 0 && (
        <div className="flex items-center justify-between mt-3 text-sm text-slate-600">
          <span>Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border border-slate-300 rounded disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-slate-300 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editing && (
        <EditRecordModal record={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-sm p-5">
            <p className="text-sm text-slate-700">Are you sure you want to delete this record?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeletingId(null)} className="px-3 py-1.5 text-sm rounded border border-slate-300">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value ?? '-'}</p>
    </div>
  );
}
