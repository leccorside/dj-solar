import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { Sidebar } from './Sidebar';

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div />
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">
              {user?.name} <span className="text-slate-400">· {user?.roleName}</span>
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
