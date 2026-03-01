import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { prazosService } from '@/services/prazos.service';
import { PrazoTipo } from '@lexmanager/shared';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PrazoFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    titulo: '',
    tipo: PrazoTipo.NORMAL,
    dataVencimento: '',
    descricao: '',
    processoId: '',
  });

  const { data: prazo } = useQuery({
    queryKey: ['prazo', id],
    queryFn: () => prazosService.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (prazo) {
      setForm({
        titulo: prazo.titulo,
        tipo: prazo.tipo,
        dataVencimento: prazo.dataVencimento.slice(0, 10),
        descricao: prazo.descricao ?? '',
        processoId: prazo.processoId ?? '',
      });
    }
  }, [prazo]);

  const createMutation = useMutation({
    mutationFn: prazosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prazos'] });
      navigate('/prazos');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof prazosService.update>[1]) =>
      prazosService.update(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prazos'] });
      queryClient.invalidateQueries({ queryKey: ['prazo', id] });
      navigate('/prazos');
    },
  });

  const mutation = isEdit ? updateMutation : createMutation;

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titulo: form.titulo,
      tipo: form.tipo as PrazoTipo,
      dataVencimento: form.dataVencimento,
      descricao: form.descricao || undefined,
      processoId: form.processoId || undefined,
    } as any;

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-secondary px-2 py-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Editar Prazo' : 'Novo Prazo'}
        </h1>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Título *</label>
            <input className="form-input" required {...field('titulo')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tipo *</label>
              <select className="form-input" value={form.tipo} onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value as PrazoTipo }))}>
                {Object.values(PrazoTipo).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Data de Vencimento *</label>
              <input className="form-input" type="date" required {...field('dataVencimento')} />
            </div>
          </div>

          <div>
            <label className="form-label">Descrição</label>
            <textarea className="form-input" rows={3} {...field('descricao')} />
          </div>

          {mutation.error && (
            <p className="text-sm text-red-600">
              {(mutation.error as any).response?.data?.message || 'Erro ao salvar'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar prazo'}
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
