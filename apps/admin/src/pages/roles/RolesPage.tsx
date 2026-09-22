import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { apiClient } from '../../lib/api-client';
import type { Role } from '../../types/domain';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsModal } from './RolePermissionsModal';

export function RolesPage() {
  const queryClient = useQueryClient();
  const [managingRole, setManagingRole] = useState<Role | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await apiClient.get<Role[]>('/roles')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/roles/${id}`),
    onSuccess: () => {
      toast.success('Papel excluído.');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao excluir papel.';
      toast.error(message);
    },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Papéis e permissões</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Plus size={16} /> Novo papel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-slate-400">Carregando…</p>}
        {roles?.map((role) => (
          <div key={role.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{role.name}</h3>
                <p className="text-xs text-slate-500">{role.description || 'Sem descrição'}</p>
              </div>
              {role.name !== 'SUPER_ADMIN' && (
                <button
                  type="button"
                  onClick={() => setDeletingRole(role)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {role.usersCount} usuário(s) · {role.permissionKeys.length} permissão(ões)
            </p>
            <button
              type="button"
              onClick={() => setManagingRole(role)}
              disabled={role.name === 'SUPER_ADMIN'}
              className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <ShieldCheck size={16} />
              {role.name === 'SUPER_ADMIN' ? 'Acesso total (fixo)' : 'Gerenciar permissões'}
            </button>
          </div>
        ))}
      </div>

      {managingRole && (
        <RolePermissionsModal
          role={managingRole}
          onClose={() => setManagingRole(null)}
          onSaved={() => setManagingRole(null)}
        />
      )}

      {showCreate && <RoleFormModal onClose={() => setShowCreate(false)} onSaved={() => setShowCreate(false)} />}

      <ConfirmDialog
        open={!!deletingRole}
        title={`Excluir ${deletingRole?.name}?`}
        description="Só é possível excluir papéis sem usuários vinculados."
        confirmLabel="Excluir"
        onCancel={() => setDeletingRole(null)}
        onConfirm={() => {
          if (deletingRole) deleteMutation.mutate(deletingRole.id);
          setDeletingRole(null);
        }}
      />
    </div>
  );
}
