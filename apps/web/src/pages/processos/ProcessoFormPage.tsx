import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { processosService } from '@/services/processos.service';
import { AreaDireito, ProcessoStatus } from '@lexmanager/shared';
import { ArrowLeft } from 'lucide-react';

const areaOptions = Object.values(AreaDireito);
const statusOptions = Object.values(ProcessoStatus);

export default function ProcessoFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['processo', id],
    queryFn: () => processosService.get(id!),
    enabled: isEditing,
  });

  const [form, setForm] = useState({
    titulo: '',
    area: AreaDireito.CIVEL,
    numeroCnj: '',
    descricao: '',
    vara: '',
    tribunal: '',
    comarca: '',
    instancia: '',
    valorCausa: '',
    dataDistribuicao: '',
    status: ProcessoStatus.ATIVO,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        titulo: existing.titulo || '',
        area: existing.area || AreaDireito.CIVEL,
        numeroCnj: existing.numeroCnj || '',
        descricao: existing.descricao || '',
        vara: existing.vara || '',
        tribunal: existing.tribunal || '',
        comarca: existing.comarca || '',
        instancia: existing.instancia || '',
        valorCausa: existing.valorCausa || '',
        dataDistribuicao: existing.dataDistribuicao
          ? existing.dataDistribuicao.split('T')[0]
          : '',
        status: existing.status || ProcessoStatus.ATIVO,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditing ? processosService.update(id!, data) : processosService.create(data),
    onSuccess: (processo) => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      navigate(`/processos/${processo.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      valorCausa: form.valorCausa ? Number(form.valorCausa) : undefined,
      dataDistribuicao: form.dataDistribuicao || undefined,
    });
  };

  const field = (key: keyof typeof form, type: string = 'text') => ({
    type,
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-secondary px-2 py-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Processo' : 'Novo Processo'}
          </h1>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Título *</label>
            <input className="form-input" required {...field('titulo')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Área do Direito *</label>
              <select className="form-input" value={form.area} onChange={(e) => setForm(f => ({ ...f, area: e.target.value as AreaDireito }))}>
                {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            {isEditing && (
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as ProcessoStatus }))}>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Número CNJ</label>
              <input className="form-input" placeholder="0000000-00.0000.0.00.0000" {...field('numeroCnj')} />
            </div>
            <div>
              <label className="form-label">Valor da Causa (R$)</label>
              <input className="form-input" min="0" step="0.01" {...field('valorCausa', 'number')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tribunal</label>
              <input className="form-input" {...field('tribunal')} />
            </div>
            <div>
              <label className="form-label">Vara</label>
              <input className="form-input" {...field('vara')} />
            </div>
            <div>
              <label className="form-label">Comarca</label>
              <input className="form-input" {...field('comarca')} />
            </div>
            <div>
              <label className="form-label">Instância</label>
              <input className="form-input" {...field('instancia')} />
            </div>
          </div>

          <div>
            <label className="form-label">Data de Distribuição</label>
            <input className="form-input" {...field('dataDistribuicao', 'date')} />
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
              {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar processo'}
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
