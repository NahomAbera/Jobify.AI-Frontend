import { NavLink, useLocation } from 'react-router-dom';
import { ChartPieIcon, TableCellsIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';

const links = [
  { to: '/', label: 'Dashboard', icon: ChartPieIcon },
  { to: '/applications', label: 'Applications', icon: TableCellsIcon },
  { to: '/interviews', label: 'Interviews', icon: TableCellsIcon },
  { to: '/offers', label: 'Offers', icon: TableCellsIcon },
  { to: '/rejections', label: 'Rejections', icon: TableCellsIcon },
];

export default function Sidebar() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname === '/request-access') {
    return null; // hide sidebar on auth pages
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <aside className="bg-gray-900/80 backdrop-blur-md text-white h-screen w-64 hidden md:flex flex-col p-6 gap-6 sticky top-0">
      <h1 className="text-2xl font-bold">Jobify.AI</h1>
      <nav className="flex-1 flex flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition ${
                isActive ? 'bg-primary/30' : ''
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600/20 transition text-sm"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
      </button>
    </aside>
  );
}
