import { useState } from 'react';
import { RECORD_TYPES, LINK_STATUSES, DOWNLOAD_STATUSES, type DataRecord } from '../types';

interface Props {
  record: DataRecord;
  onClose: () => void;
  onSave: (id: string, payload: Partial<DataRecord>) => Promise<void>;
}

export default function EditRecordModal({ record, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name: record.name,
    email: record.email || '',
    phone: record.phone || '',
    address: record.address || '',
    organisation: record.organisation || '',
    type: record.type,
    linkStatus: record.linkStatus,
    downloadStatus: record.downloadStatus,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(record._id, form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg w-full max-w-md p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Update Record</h2>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phone No.</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Organisation</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={form.organisation}
            onChange={(e) => setForm({ ...form, organisation: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type *</label>
            <select
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DataRecord['type'] })}
            >
              {RECORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Link Status</label>
            <select
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
              value={form.linkStatus}
              onChange={(e) => setForm({ ...form, linkStatus: e.target.value as DataRecord['linkStatus'] })}
            >
              {LINK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Download Status</label>
            <select
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
              value={form.downloadStatus}
              onChange={(e) => setForm({ ...form, downloadStatus: e.target.value as DataRecord['downloadStatus'] })}
            >
              {DOWNLOAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm rounded border border-slate-300">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
