import { History, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Cresce conforme cada passo entrega funcionalidade real — nada de itens
// para módulos que ainda não existem (item 111 do PROMPT.md).
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/usuarios', label: 'Usuários', icon: Users, end: false },
  { to: '/papeis', label: 'Papéis', icon: ShieldCheck, end: false },
  { to: '/auditoria', label: 'Auditoria', icon: History, end: false },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
        <img src="/logo-dj-solar.png" alt="DJ Solar" className="h-8 w-8 object-contain" />
        <span className="font-bold text-slate-800">DJ Solar</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
