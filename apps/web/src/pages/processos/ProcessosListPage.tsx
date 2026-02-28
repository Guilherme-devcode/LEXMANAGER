import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { processosService } from '@/services/processos.service';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Plus, Eye, Pencil, Trash2, Search } from 'lucide-react';
import { ProcessoDto, ProcessoStatus, AreaDireito } from '@lexmanager/shared';
import clsx from 'clsx';

const statusColors: Record<ProcessoStatus, string> = {
  ATIVO: 'bg-emerald-100 text-emerald-700',
  SUSPENSO: 'bg-amber-100 text-amber-700',
  ARQUIVADO: 'bg-gray-100 text-gray-600',
  GANHO: 'bg-blue-100 text-blue-700',
  PERDIDO: 'bg-red-100 text-red-700',
};

const statusLabels: Record<ProcessoStatus, string> = {
  ATIVO: 'Ativo',
  SUSPENSO: 'Suspenso',
  ARQUIVADO: 'Arquivado',
  GANHO: 'Ganho',
  PERDIDO: 'Perdido',
};

export default function ProcessosListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProcessoStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['processos', { search, status, page }],
    queryFn: () =>
      processosService.list({ search: search || undefined, status: status || undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: processosService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['processos'] }),
  });

  const columns: Column<ProcessoDto>[] = [
    {
      key: 'titulo',
      label: 'Processo',
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900">{p.titulo}</p>
          {p.numeroCnj && <p className="text-xs text-gray-400">{p.numeroCnj}</p>}
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Área',
      render: (p) => (
        <span className="badge bg-gray-100 text-gray-600">{p.area}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <span className={clsx('badge', statusColors[p.status])}>
          {statusLabels[p.status]}
        </span>
      ),
    },
    {
      key: 'responsavel' as any,
      label: 'Responsável',
      render: (p) => <span>{(p as any).responsavel?.nome ?? '-'}</span>,
    },
    {
      key: 'actions' as any,
      label: '',
      className: 'w-24',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/processos/${p.id}`)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/processos/${p.id}/editar`)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Excluir este processo?')) deleteMutation.mutate(p.id);
            }}
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
          <h1 className="text-xl font-bold text-gray-900">Processos</h1>
          <p className="text-sm text-gray-500">{data?.meta.total ?? 0} processos</p>
        </div>
        <button onClick={() => navigate('/processos/novo')} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Processo
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="form-input pl-9"
              placeholder="Buscar por título, número CNJ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-input w-full sm:w-48"
            value={status}
            onChange={(e) => { setStatus(e.target.value as ProcessoStatus | ''); setPage(1); }}
          >
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="Nenhum processo encontrado"
      />
    </div>
  );
}
