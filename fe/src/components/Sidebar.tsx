import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/manage-data', label: 'Manage Data' },
  { to: '/upload-excel', label: 'Upload Excel' },
  { to: '/social-ads', label: 'Social & Ads' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-slate-900 text-slate-200 min-h-screen p-4 flex flex-col">
      <h1 className="text-lg font-semibold text-white mb-6 px-2">Admin Panel</h1>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <hr className="my-4 border-slate-700" />
      <nav>
        <NavLink to="/users" className={linkClass}>
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
