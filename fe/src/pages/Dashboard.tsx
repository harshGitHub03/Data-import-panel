import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { fetchSummary, type Summary } from '../api/records.api';
import type { AuthUser } from '../api/auth.api';

const SHORTCUTS = [
  { to: '/manage-data', label: 'Manage Data', desc: 'Search, filter, update and delete records' },
  { to: '/upload-excel', label: 'Upload Excel', desc: 'Import new records from a spreadsheet' },
  { to: '/users', label: 'Users', desc: 'View admin accounts with access' },
];

export default function Dashboard() {
  const { user } = useOutletContext<{ user: AuthUser }>();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetchSummary().then(setSummary).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Welcome back, {user.email.split('@')[0]} 👋</h1>
        <p className="text-indigo-100 mt-1">Here's a quick look at your data today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <StatCard label="All Data" value={summary?.all} />
        <StatCard label="Students" value={summary?.students} />
        <StatCard label="Teachers" value={summary?.teachers} />
        <StatCard label="Institutes" value={summary?.institutes} />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mt-7 mb-2">Quick Links</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-slate-900">{s.label}</p>
            <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value ?? '-'}</p>
    </div>
  );
}
