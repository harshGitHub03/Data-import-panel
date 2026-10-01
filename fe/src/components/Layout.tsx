import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { AuthUser } from '../api/auth.api';

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden px-3 py-1 rounded bg-slate-900 text-white text-sm">
            Menu
          </button>
          <span className="hidden md:block" />
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{user.email} <span className="text-slate-400">({user.role})</span></span>
            <button onClick={onLogout} className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50">
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 md:p-6 flex-1">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
