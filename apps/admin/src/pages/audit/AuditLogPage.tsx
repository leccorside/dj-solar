import type { PaginatedResult } from '@djsolar/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import type { AuditLogEntry } from '../../types/domain';

export function AuditLogPage() {
  const [entity, setEntity] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', entity],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<AuditLogEntry>>('/audit-logs', {
        params: { entity: entity || undefined, pageSize: 30 },
      });
      return data;
    },
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">Auditoria</h1>

      <select
        value={entity}
        onChange={(event) => setEntity(event.target.value)}
        className="mb-4 rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">Todas as entidades</option>
        <option value="User">Usuários</option>
        <option value="Role">Papéis</option>
        <option value="RolePermission">Permissões de papéis</option>
      </select>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Entidade</th>
              <th className="px-4 py-3">Alterações</th>
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
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {data?.items.map((log) => (
              <tr key={log.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {new Date(log.createdAt).toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-slate-700">{log.userEmail ?? '—'}</td>
                <td className="px-4 py-3 text-slate-700">{log.action}</td>
                <td className="px-4 py-3 text-slate-700">
                  {log.entity} <span className="text-xs text-slate-400">#{log.entityId.slice(0, 8)}</span>
                </td>
                <td className="px-4 py-3">
                  {log.changes && Object.keys(log.changes).length > 0 ? (
                    <ul className="space-y-0.5 text-xs text-slate-500">
                      {Object.entries(log.changes).map(([field, diff]) => (
                        <li key={field}>
                          <span className="font-mono">{field}</span>: {JSON.stringify(diff.before)} →{' '}
                          {JSON.stringify(diff.after)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
