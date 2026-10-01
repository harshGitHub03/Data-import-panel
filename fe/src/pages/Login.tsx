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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white shadow-xl shadow-slate-200/60 border border-slate-100 rounded-2xl p-8 space-y-4">
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
            A
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mt-3">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sign in to manage your data</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
