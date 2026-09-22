import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../../lib/api-client';
import type { Permission, Role } from '../../types/domain';

interface Props {
  role: Role;
  onClose: () => void;
  onSaved: () => void;
}

export function RolePermissionsModal({ role, onClose, onSaved }: Props) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set(role.permissionKeys));

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await apiClient.get<Permission[]>('/permissions')).data,
  });

  const mutation = useMutation({
    mutationFn: async () =>
      apiClient.put(`/roles/${role.id}/permissions`, { permissionKeys: Array.from(selected) }),
    onSuccess: () => {
      toast.success('Permissões atualizadas.');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onSaved();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao atualizar permissões.';
      toast.error(message);
    },
  });

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-slate-800">Permissões — {role.name}</h2>
        <p className="mb-4 text-xs text-slate-500">
          Selecione as permissões concedidas a este papel.
        </p>

        {isLoading && <p className="text-sm text-slate-400">Carregando…</p>}

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {permissions?.map((permission) => (
            <label
              key={permission.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.has(permission.key)}
                onChange={() => toggle(permission.key)}
              />
              <span className="font-mono text-slate-700">{permission.key}</span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {mutation.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
