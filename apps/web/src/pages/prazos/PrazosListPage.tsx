import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prazosService } from '@/services/prazos.service';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Plus, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { PrazoDto, PrazoStatus, PrazoTipo } from '@lexmanager/shared';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

const tipoColors: Record<PrazoTipo, string> = {
  FATAL: 'bg-red-100 text-red-700',
  NORMAL: 'bg-blue-100 text-blue-700',
  AUDIENCIA: 'bg-purple-100 text-purple-700',
  PERICIA: 'bg-orange-100 text-orange-700',
  REUNIAO: 'bg-teal-100 text-teal-700',
  TAREFA: 'bg-gray-100 text-gray-600',
};

export default function PrazosListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<PrazoStatus | ''>(PrazoStatus.PENDENTE);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['prazos', { status, page }],
    queryFn: () => prazosService.list({ status: status || undefined, page }),
  });

  const concluirMutation = useMutation({
    mutationFn: (id: string) =>
      prazosService.update(id, { status: PrazoStatus.CONCLUIDO, dataConclusao: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prazos'] }),
  });

  const removeMutation = useMutation({
    mutationFn: prazosService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prazos'] }),
  });

  const columns: Column<PrazoDto>[] = [
    {
      key: 'titulo',
      label: 'Prazo',
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900">{p.titulo}</p>
          {(p as any).processo && (
            <p className="text-xs text-gray-400">{(p as any).processo.titulo}</p>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (p) => <span className={clsx('badge', tipoColors[p.tipo])}>{p.tipo}</span>,
    },
    {
      key: 'dataVencimento',
      label: 'Vencimento',
      render: (p) => {
        const dias = differenceInDays(new Date(p.dataVencimento), new Date());
        return (
          <div>
            <p className="text-sm">{format(new Date(p.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
            {p.status === PrazoStatus.PENDENTE && (
              <p className={clsx('text-xs font-medium', dias <= 0 ? 'text-red-600' : dias <= 7 ? 'text-amber-600' : 'text-gray-400')}>
                {dias <= 0 ? 'Vencido' : `${dias} dia(s)`}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'responsavel' as any,
      label: 'Responsável',
      render: (p) => <span>{(p as any).responsavel?.nome ?? '-'}</span>,
    },
    {
      key: 'actions' as any,
      label: '',
      className: 'w-28',
      render: (p) => (
        <div className="flex items-center gap-1">
          {p.status === PrazoStatus.PENDENTE && (
            <button
              onClick={() => concluirMutation.mutate(p.id)}
              title="Marcar como concluído"
              className="rounded p-1 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => navigate(`/prazos/${p.id}/editar`)}
            title="Editar"
            className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Excluir este prazo?')) removeMutation.mutate(p.id);
            }}
            title="Excluir"
            className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Prazos</h1>
          <p className="text-sm text-gray-500">{data?.meta.total ?? 0} prazos</p>
        </div>
        <button onClick={() => navigate('/prazos/novo')} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Prazo
        </button>
      </div>

      <div className="card p-4">
        <select
          className="form-input w-48"
          value={status}
          onChange={(e) => { setStatus(e.target.value as PrazoStatus | ''); setPage(1); }}
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="CONCLUIDO">Concluídos</option>
          <option value="PERDIDO">Perdidos</option>
        </select>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="Nenhum prazo encontrado"
      />
    </div>
  );
}
