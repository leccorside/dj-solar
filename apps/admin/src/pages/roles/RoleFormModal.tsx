import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { apiClient } from '../../lib/api-client';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Mínimo de 2 caracteres')
    .regex(/^[A-Z0-9_]+$/, 'Use apenas MAIÚSCULAS, números e "_"'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export function RoleFormModal({ onClose, onSaved }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => apiClient.post('/roles', values),
    onSuccess: () => {
      toast.success('Papel criado.');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onSaved();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao criar papel.';
      toast.error(message);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Novo papel</h2>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-4">
          <div>
            <label htmlFor="role-name" className="mb-1 block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="role-name"
              {...register('name')}
              placeholder="EX: SUPORTE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="role-description" className="mb-1 block text-sm font-medium text-slate-700">
              Descrição
            </label>
            <input
              id="role-description"
              {...register('description')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {mutation.isPending ? 'Salvando…' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
