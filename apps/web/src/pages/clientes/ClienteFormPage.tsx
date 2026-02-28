import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '@/services/clientes.service';
import { ClienteTipo } from '@lexmanager/shared';
import { ArrowLeft } from 'lucide-react';

export default function ClienteFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clientesService.get(id!),
    enabled: isEditing,
  });

  const [form, setForm] = useState({
    tipo: ClienteTipo.PF,
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    celular: '',
    observacoes: '',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        tipo: existing.tipo,
        nome: existing.nome,
        cpfCnpj: existing.cpfCnpj || '',
        email: existing.email || '',
        telefone: existing.telefone || '',
        celular: existing.celular || '',
        observacoes: existing.observacoes || '',
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditing ? clientesService.update(id!, data) : clientesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      navigate('/clientes');
    },
  });

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-secondary px-2 py-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </h1>
      </div>

      <div className="card p-6">
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tipo *</label>
              <select className="form-input" value={form.tipo} onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value as ClienteTipo }))}>
                <option value={ClienteTipo.PF}>Pessoa Física</option>
                <option value={ClienteTipo.PJ}>Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="form-label">{form.tipo === ClienteTipo.PF ? 'CPF' : 'CNPJ'}</label>
              <input className="form-input" {...field('cpfCnpj')} />
            </div>
          </div>

          <div>
            <label className="form-label">Nome completo / Razão social *</label>
            <input className="form-input" required {...field('nome')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" {...field('email')} />
            </div>
            <div>
              <label className="form-label">Celular</label>
              <input className="form-input" {...field('celular')} />
            </div>
            <div>
              <label className="form-label">Telefone</label>
              <input className="form-input" {...field('telefone')} />
            </div>
          </div>

          <div>
            <label className="form-label">Observações</label>
            <textarea className="form-input" rows={3} {...field('observacoes')} />
          </div>

          {mutation.error && (
            <p className="text-sm text-red-600">
              {(mutation.error as any).response?.data?.message || 'Erro ao salvar'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar cliente'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
