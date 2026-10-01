import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, type AppUser } from '../api/users.api';
import UserFormModal from '../components/UserFormModal';

const LIMIT = 10;

export default function Users() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchUsers(page, LIMIT)
      .then((res) => {
        setUsers(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [page]);

  async function handleSave(payload: { email: string; password: string; role: string }) {
    if (editing) {
      const update: any = { email: payload.email, role: payload.role };
      if (payload.password) update.password = payload.password;
      await updateUser(editing._id, update);
    } else {
      await createUser(payload);
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    await deleteUser(id);
    setDeletingId(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">All admin accounts with access to this panel.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white font-medium"
        >
          Add User
        </button>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Joined</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500">Loading...</td></tr>}
            {!loading && users.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500">No users found.</td></tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u._id} className="border-t border-slate-100">
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{u.role}</span>
                </td>
                <td className="px-3 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <button onClick={() => setEditing(u)} className="text-indigo-600 hover:underline mr-3">Update</button>
                  <button onClick={() => setDeletingId(u._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
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

      {(showForm || editing) && (
        <UserFormModal
          user={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-sm p-5">
            <p className="text-sm text-slate-700">Are you sure you want to delete this user?</p>
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
