import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financeiroService } from '@/services/financeiro.service';
import { LancamentoTipo } from '@lexmanager/shared';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function LancamentoFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    tipo: LancamentoTipo.RECEITA,
    descricao: '',
    valor: '',
    dataVencimento: '',
    categoria: '',
    observacoes: '',
    processoId: '',
    clienteId: '',
  });

  const mutation = useMutation({
    mutationFn: financeiroService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      navigate('/financeiro');
    },
  });

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-secondary px-2 py-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Novo Lançamento</h1>
      </div>

      <div className="card p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({
              tipo: form.tipo as LancamentoTipo,
              descricao: form.descricao,
              valor: Number(form.valor),
              dataVencimento: form.dataVencimento,
              categoria: form.categoria || undefined,
              observacoes: form.observacoes || undefined,
              processoId: form.processoId || undefined,
              clienteId: form.clienteId || undefined,
            } as any);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tipo *</label>
              <select
                className="form-input"
                value={form.tipo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: e.target.value as LancamentoTipo }))
                }
              >
                <option value={LancamentoTipo.RECEITA}>Receita</option>
                <option value={LancamentoTipo.DESPESA}>Despesa</option>
              </select>
            </div>
            <div>
              <label className="form-label">Categoria</label>
              <input className="form-input" placeholder="Ex: Honorários" {...field('categoria')} />
            </div>
          </div>

          <div>
            <label className="form-label">Descrição *</label>
            <input className="form-input" required {...field('descricao')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Valor (R$) *</label>
              <input
                className="form-input"
                type="number"
                min="0.01"
                step="0.01"
                required
                {...field('valor')}
              />
            </div>
            <div>
              <label className="form-label">Data de Vencimento *</label>
              <input className="form-input" type="date" required {...field('dataVencimento')} />
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
              {mutation.isPending ? 'Salvando...' : 'Criar lançamento'}
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
