import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white p-12">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-semibold">
            D
          </div>
          <span className="font-semibold tracking-tight">Data Import Panel</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight max-w-sm">
            Turn spreadsheets into structured, searchable data.
          </h1>
          <p className="text-indigo-200/80 mt-4 max-w-sm text-sm leading-relaxed">
            Import Excel or CSV records and manage them from one clean,
            real-time admin dashboard.
          </p>
        </div>

        <p className="text-xs text-indigo-300/60">© {new Date().getFullYear()} Data Import Panel</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-semibold">
              D
            </div>
            <span className="font-semibold text-slate-900">Data Import Panel</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your admin credentials to continue.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-shadow"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Access is restricted to authorized administrators.
          </p>
        </form>
      </div>
    </div>
  );
}
