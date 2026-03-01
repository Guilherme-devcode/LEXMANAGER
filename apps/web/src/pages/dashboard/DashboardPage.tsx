import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Scale, Calendar, TrendingUp, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

/* ── KPI Card ────────────────────────────────────────────── */
interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
  iconBg: string;
  delay?: string;
  trend?: string;
}

function KpiCard({ icon: Icon, label, value, iconColor, iconBg, delay = '', trend }: KpiCardProps) {
  return (
    <div
      className={`kpi-card card p-5 animate-fade-up cursor-default ${delay}`}
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.09em' }}>
            {label}
          </p>
          <p className="font-display text-3xl font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {trend && (
            <p className="mt-2 text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>

        <div
          className="rounded-xl p-3 flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton loader ─────────────────────────────────────── */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className}`}
      style={{ background: 'var(--bg-overlay)' }}
    />
  );
}

function KpiSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-2 w-16" />
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKpis(),
    refetchInterval: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Visão Geral
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              icon={Scale}
              label="Processos Ativos"
              value={kpis?.processosAtivos ?? 0}
              iconColor="#c9a84c"
              iconBg="rgba(201,168,76,0.12)"
              delay="anim-delay-0"
              trend="em andamento"
            />
            <KpiCard
              icon={Calendar}
              label="Prazos (7 dias)"
              value={kpis?.prazosProximos ?? 0}
              iconColor="#f59e0b"
              iconBg="rgba(245,158,11,0.12)"
              delay="anim-delay-75"
              trend="próximos vencimentos"
            />
            <KpiCard
              icon={TrendingUp}
              label="Receita do Mês"
              value={`R$ ${Number(kpis?.receitaMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              iconColor="#22c55e"
              iconBg="rgba(34,197,94,0.12)"
              delay="anim-delay-150"
              trend="mês atual"
            />
            <KpiCard
              icon={AlertTriangle}
              label="Inadimplência"
              value={`R$ ${Number(kpis?.inadimplencia || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              iconColor="#ef4444"
              iconBg="rgba(239,68,68,0.12)"
              delay="anim-delay-225"
              trend="valores em aberto"
            />
          </>
        )}
      </div>

      {/* Próximos Prazos */}
      <div className="card animate-fade-up anim-delay-300">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-lg p-1.5"
              style={{ background: 'rgba(245,158,11,0.12)' }}
            >
              <Clock className="h-4 w-4" style={{ color: '#f59e0b' }} />
            </div>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Próximos Prazos
            </h2>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
          >
            {kpis?.proximosPrazos?.length ?? 0} pendentes
          </span>
        </div>

        {/* List */}
        <div>
          {isLoading ? (
            <div className="px-5 py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-2.5 w-32" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          ) : kpis?.proximosPrazos?.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Nenhum prazo nos próximos dias
              </p>
            </div>
          ) : (
            kpis?.proximosPrazos?.map((prazo: any, idx: number) => {
              const diasRestantes = Math.ceil(
                (new Date(prazo.dataVencimento).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              );
              const critico = diasRestantes <= 1;
              const urgente = diasRestantes <= 3;

              return (
                <div
                  key={prazo.id}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors"
                  style={{
                    borderBottom: idx < (kpis?.proximosPrazos?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    {/* Urgency dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: critico ? '#ef4444' : urgente ? '#f59e0b' : '#c9a84c',
                        boxShadow: critico ? '0 0 6px rgba(239,68,68,0.5)' : undefined,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {prazo.titulo}
                      </p>
                      {prazo.processo && (
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {prazo.processo.titulo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                      {format(new Date(prazo.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={
                        critico
                          ? { background: 'rgba(239,68,68,0.12)', color: '#f87171' }
                          : urgente
                            ? { background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }
                            : { background: 'rgba(201,168,76,0.1)', color: 'var(--gold-400)' }
                      }
                    >
                      {diasRestantes}d
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
