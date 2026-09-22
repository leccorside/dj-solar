import { useAuthStore } from '../store/auth-store';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Olá, {user?.name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Você está autenticado como <strong>{user?.roleName}</strong>. Métricas, gráficos e
        atalhos do dashboard chegam no Passo 19.
      </p>
    </div>
  );
}
