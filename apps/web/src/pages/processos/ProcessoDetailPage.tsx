import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { processosService } from '@/services/processos.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Pencil, Plus, Clock } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function ProcessoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showMovForm, setShowMovForm] = useState(false);
  const [movForm, setMovForm] = useState({ titulo: '', descricao: '' });

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo', id],
    queryFn: () => processosService.get(id!),
    enabled: !!id,
  });

  const addMovMutation = useMutation({
    mutationFn: (data: { titulo: string; descricao: string }) =>
      processosService.addMovimentacao(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processo', id] });
      setShowMovForm(false);
      setMovForm({ titulo: '', descricao: '' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (!processo) return <div>Processo não encontrado</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary px-2 py-2">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{processo.titulo}</h1>
            {processo.numeroCnj && (
              <p className="text-sm text-gray-400">{processo.numeroCnj}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate(`/processos/${id}/editar`)}
          className="btn-secondary gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Info */}
        <div className="card p-5 lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-gray-900">Informações</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Área', processo.area],
              ['Status', processo.status],
              ['Tribunal', processo.tribunal || '-'],
              ['Vara', processo.vara || '-'],
              ['Comarca', processo.comarca || '-'],
              ['Instância', processo.instancia || '-'],
              ['Valor da Causa', processo.valorCausa
                ? `R$ ${Number(processo.valorCausa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : '-'],
              ['Distribuição', processo.dataDistribuicao
                ? format(new Date(processo.dataDistribuicao), 'dd/MM/yyyy', { locale: ptBR })
                : '-'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          {processo.descricao && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Descrição</p>
              <p className="text-sm text-gray-700">{processo.descricao}</p>
            </div>
          )}
        </div>

        {/* Responsável */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Responsável</h2>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-medium">
              {(processo as any).responsavel?.nome?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{(processo as any).responsavel?.nome}</p>
              <p className="text-xs text-gray-400">{(processo as any).responsavel?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Movimentações */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Movimentações</h2>
          <button onClick={() => setShowMovForm(true)} className="btn-secondary text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        </div>

        {showMovForm && (
          <div className="border-b border-gray-100 px-5 py-4 bg-gray-50">
            <form
              onSubmit={(e) => { e.preventDefault(); addMovMutation.mutate(movForm); }}
              className="space-y-3"
            >
              <input
                className="form-input"
                placeholder="Título da movimentação"
                value={movForm.titulo}
                onChange={(e) => setMovForm(f => ({ ...f, titulo: e.target.value }))}
                required
              />
              <textarea
                className="form-input"
                placeholder="Descrição"
                rows={2}
                value={movForm.descricao}
                onChange={(e) => setMovForm(f => ({ ...f, descricao: e.target.value }))}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs">Salvar</button>
                <button type="button" onClick={() => setShowMovForm(false)} className="btn-secondary text-xs">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {(processo as any).movimentacoes?.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Nenhuma movimentação</p>
          )}
          {(processo as any).movimentacoes?.map((mov: any) => (
            <div key={mov.id} className="flex gap-4 px-5 py-4">
              <div className="mt-1 flex-shrink-0">
                <Clock className="h-4 w-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{mov.titulo}</p>
                <p className="text-sm text-gray-600 mt-0.5">{mov.descricao}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(mov.dataMovimentacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
