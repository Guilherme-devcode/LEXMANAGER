import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '@/services/clientes.service';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { ClienteDto, ClienteTipo, ClienteStatus } from '@lexmanager/shared';
import clsx from 'clsx';

const statusColors: Record<ClienteStatus, string> = {
  ATIVO: 'bg-emerald-100 text-emerald-700',
  INATIVO: 'bg-gray-100 text-gray-600',
  LEAD: 'bg-blue-100 text-blue-700',
  PROSPECTO: 'bg-purple-100 text-purple-700',
};

export default function ClientesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['clientes', { search, page }],
    queryFn: () => clientesService.list({ search: search || undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: clientesService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
  });

  const columns: Column<ClienteDto>[] = [
    {
      key: 'nome',
      label: 'Nome',
      render: (c) => (
        <div>
          <p className="font-medium text-gray-900">{c.nome}</p>
          {c.cpfCnpj && <p className="text-xs text-gray-400">{c.cpfCnpj}</p>}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (c) => (
        <span className="badge bg-gray-100 text-gray-600">
          {c.tipo === ClienteTipo.PF ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (c) => <span className={clsx('badge', statusColors[c.status])}>{c.status}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (c) => <span>{c.email || '-'}</span>,
    },
    {
      key: 'telefone',
      label: 'Telefone',
      render: (c) => <span>{c.celular || c.telefone || '-'}</span>,
    },
    {
      key: 'actions' as any,
      label: '',
      className: 'w-20',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/clientes/${c.id}/editar`)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Excluir este cliente?')) deleteMutation.mutate(c.id);
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
          <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">{data?.meta.total ?? 0} clientes</p>
        </div>
        <button onClick={() => navigate('/clientes/novo')} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Buscar por nome, CPF/CNPJ, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente encontrado"
      />
    </div>
  );
}
