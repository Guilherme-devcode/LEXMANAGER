import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { UserDto, UserRole } from '@lexmanager/shared';
import { Plus, UserCheck, UserX } from 'lucide-react';
import clsx from 'clsx';

const roleLabels: Record<UserRole, string> = {
  SOCIO: 'Sócio',
  ASSOCIADO: 'Associado',
  ESTAGIARIO: 'Estagiário',
  SECRETARIA: 'Secretária',
  FINANCEIRO: 'Financeiro',
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: UserRole.ASSOCIADO });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.list,
  });

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowForm(false);
      setForm({ nome: '', email: '', senha: '', role: UserRole.ASSOCIADO });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) =>
      usersService.update(id, { ativo }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Usuários</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Adicionar usuário</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <label className="form-label">Nome *</label>
              <input className="form-input" required value={form.nome} onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Senha *</label>
              <input className="form-input" type="password" required minLength={8} value={form.senha} onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Perfil *</label>
              <select className="form-input" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                {Object.entries(roleLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                {createMutation.isPending ? 'Criando...' : 'Criar usuário'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card divide-y divide-gray-100">
        {users?.map((user: UserDto) => (
          <div key={user.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-medium">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-primary-100 text-primary-700">{roleLabels[user.role]}</span>
              <button
                onClick={() => toggleActiveMutation.mutate({ id: user.id, ativo: !user.ativo })}
                className={clsx('rounded p-1.5', user.ativo ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100')}
                title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
              >
                {user.ativo ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
