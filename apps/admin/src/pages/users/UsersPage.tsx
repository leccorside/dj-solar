import type { PaginatedResult } from '@djsolar/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { apiClient } from '../../lib/api-client';
import type { AdminUser } from '../../types/domain';
import { UserFormModal } from './UserFormModal';

export function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<AdminUser>>('/users', {
        params: { search: search || undefined, pageSize: 50 },
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('Usuário excluído.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao excluir usuário.';
      toast.error(message);
    },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Usuários</h1>
        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nome ou e-mail…"
        className="mb-4 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Carregando…
                </td>
              </tr>
            )}
            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {data?.items.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.role.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <UserFormModal user={editingUser} onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />
      )}

      <ConfirmDialog
        open={!!deletingUser}
        title={`Excluir ${deletingUser?.name}?`}
        description="O usuário perde acesso ao painel imediatamente."
        confirmLabel="Excluir"
        onCancel={() => setDeletingUser(null)}
        onConfirm={() => {
          if (deletingUser) deleteMutation.mutate(deletingUser.id);
          setDeletingUser(null);
        }}
      />
    </div>
  );
}
