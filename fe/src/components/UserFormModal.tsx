import { useState } from 'react';
import type { AppUser } from '../api/users.api';

interface Props {
  user: AppUser | null;
  onClose: () => void;
  onSave: (payload: { email: string; password: string; role: string }) => Promise<void>;
}

export default function UserFormModal({ user, onClose, onSave }: Props) {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'user');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || (!user && !password)) {
      setError('Email and password are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({ email: email.trim(), password, role });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg w-full max-w-sm p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{user ? 'Update User' : 'Add User'}</h2>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Password {user ? '(leave blank to keep unchanged)' : '*'}
          </label>
          <input
            type="password"
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
          <select
            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
