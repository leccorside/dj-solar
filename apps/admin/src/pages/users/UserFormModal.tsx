import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { apiClient } from '../../lib/api-client';
import type { AdminUser, Role } from '../../types/domain';

const createSchema = z.object({
  name: z.string().min(2, 'Mínimo de 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, 'Precisa conter letra e número'),
  roleId: z.string().min(1, 'Selecione um papel'),
});

const updateSchema = z.object({
  name: z.string().min(2, 'Mínimo de 2 caracteres'),
  roleId: z.string().min(1, 'Selecione um papel'),
  isActive: z.boolean(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

interface Props {
  user: AdminUser | null;
  onClose: () => void;
  onSaved: () => void;
}

export function UserFormModal({ user, onClose, onSaved }: Props) {
  const isEditing = !!user;
  const queryClient = useQueryClient();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await apiClient.get<Role[]>('/roles')).data,
  });

  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema) });
  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: user
      ? { name: user.name, roleId: user.roleId, isActive: user.isActive }
      : undefined,
  });

  const form = isEditing ? updateForm : createForm;

  const mutation = useMutation({
    mutationFn: async (values: CreateForm | UpdateForm) =>
      isEditing ? apiClient.patch(`/users/${user!.id}`, values) : apiClient.post('/users', values),
    onSuccess: () => {
      toast.success(isEditing ? 'Usuário atualizado.' : 'Usuário criado.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSaved();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao salvar usuário.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          {isEditing ? 'Editar usuário' : 'Novo usuário'}
        </h2>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="user-name" className="mb-1 block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="user-name"
              {...(form.register as (name: string) => ReturnType<typeof createForm.register>)('name')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {!isEditing && (
            <>
              <div>
                <label htmlFor="user-email" className="mb-1 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <input
                  id="user-email"
                  {...createForm.register('email')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                {createForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="user-password" className="mb-1 block text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  id="user-password"
                  type="password"
                  {...createForm.register('password')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                {createForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {createForm.formState.errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="user-role" className="mb-1 block text-sm font-medium text-slate-700">
              Papel
            </label>
            <select
              id="user-role"
              {...(form.register as (name: string) => ReturnType<typeof createForm.register>)('roleId')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Selecione…</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {isEditing && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...updateForm.register('isActive')} />
              Usuário ativo
            </label>
          )}

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
              {mutation.isPending ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
