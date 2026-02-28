import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Scale, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { PrazoStatus } from '@lexmanager/shared';

function KpiCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: string | number; color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKpis(),
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral do escritório</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Scale}
          label="Processos Ativos"
          value={kpis?.processosAtivos ?? 0}
          color="bg-primary-700"
        />
        <KpiCard
          icon={Calendar}
          label="Prazos (próx. 7 dias)"
          value={kpis?.prazosProximos ?? 0}
          color="bg-amber-500"
        />
        <KpiCard
          icon={DollarSign}
          label="Receita do Mês"
          value={`R$ ${Number(kpis?.receitaMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          color="bg-emerald-600"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Inadimplência"
          value={`R$ ${Number(kpis?.inadimplencia || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          color="bg-red-600"
        />
      </div>

      {/* Próximos prazos */}
      <div className="card">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Próximos Prazos</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {kpis?.proximosPrazos?.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Nenhum prazo nos próximos dias</p>
          )}
          {kpis?.proximosPrazos?.map((prazo) => {
            const diasRestantes = Math.ceil(
              (new Date(prazo.dataVencimento).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
            );
            const urgente = diasRestantes <= 3;

            return (
              <div key={prazo.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{prazo.titulo}</p>
                  {prazo.processo && (
                    <p className="text-xs text-gray-400 truncate">{prazo.processo.titulo}</p>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {format(new Date(prazo.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <span
                    className={clsx(
                      'badge',
                      urgente ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    {diasRestantes}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
