import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { financeiroService } from '@/services/financeiro.service';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Plus, CheckCircle } from 'lucide-react';
import { LancamentoDto, LancamentoTipo, LancamentoStatus } from '@lexmanager/shared';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

const statusColors: Record<LancamentoStatus, string> = {
  PENDENTE: 'bg-amber-100 text-amber-700',
  PAGO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-gray-100 text-gray-500',
};

export default function FinanceiroPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<LancamentoTipo | ''>('');
  const [status, setStatus] = useState<LancamentoStatus | ''>('PENDENTE');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['lancamentos', { tipo, status, page }],
    queryFn: () =>
      financeiroService.list({ tipo: tipo || undefined, status: status || undefined, page }),
  });

  const pagarMutation = useMutation({
    mutationFn: financeiroService.pagar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lancamentos'] }),
  });

  const columns: Column<LancamentoDto>[] = [
    {
      key: 'descricao',
      label: 'Descrição',
      render: (l) => (
        <div>
          <p className="font-medium text-gray-900">{l.descricao}</p>
          {l.categoria && <p className="text-xs text-gray-400">{l.categoria}</p>}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (l) => (
        <span className={clsx('badge', l.tipo === LancamentoTipo.RECEITA ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
          {l.tipo === LancamentoTipo.RECEITA ? 'Receita' : 'Despesa'}
        </span>
      ),
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (l) => (
        <span className={clsx('font-medium', l.tipo === LancamentoTipo.RECEITA ? 'text-emerald-700' : 'text-red-700')}>
          {l.tipo === LancamentoTipo.DESPESA && '-'}
          R$ {Number(l.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'dataVencimento',
      label: 'Vencimento',
      render: (l) => format(new Date(l.dataVencimento), 'dd/MM/yyyy', { locale: ptBR }),
    },
    {
      key: 'status',
      label: 'Status',
      render: (l) => <span className={clsx('badge', statusColors[l.status])}>{l.status}</span>,
    },
    {
      key: 'actions' as any,
      label: '',
      className: 'w-16',
      render: (l) =>
        l.status === LancamentoStatus.PENDENTE ? (
          <button
            onClick={() => pagarMutation.mutate(l.id)}
            title="Marcar como pago"
            className="rounded p-1 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500">Lançamentos</p>
        </div>
        <button onClick={() => navigate('/financeiro/novo')} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </button>
      </div>

      <div className="card p-4 flex gap-3">
        <select className="form-input w-48" value={tipo} onChange={(e) => { setTipo(e.target.value as LancamentoTipo | ''); setPage(1); }}>
          <option value="">Todos os tipos</option>
          <option value="RECEITA">Receitas</option>
          <option value="DESPESA">Despesas</option>
        </select>
        <select className="form-input w-48" value={status} onChange={(e) => { setStatus(e.target.value as LancamentoStatus | ''); setPage(1); }}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="PAGO">Pagos</option>
          <option value="CANCELADO">Cancelados</option>
        </select>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="Nenhum lançamento encontrado"
      />
    </div>
  );
}
