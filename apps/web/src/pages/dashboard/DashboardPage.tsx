import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Scale, Calendar, TrendingUp, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/* ── Skeleton ────────────────────────────────────────────── */
function Sk({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: 'var(--border)' }}
    />
  );
}

/* ── KPI Card ────────────────────────────────────────────── */
interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  delay?: string;
}

function KpiCard({ icon: Icon, label, value, trend, trendUp, iconColor, iconBg, accentColor, delay = '' }: KpiCardProps) {
  return (
    <div
      className={`kpi-card card p-5 animate-fade-up ${delay}`}
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {label}
          </p>
          <p className="font-display font-bold text-2xl sm:text-3xl leading-none mb-2" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trendUp !== undefined && (
                trendUp
                  ? <ArrowUpRight className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
                  : <ArrowDownRight className="h-3.5 w-3.5" style={{ color: 'var(--danger)' }} />
              )}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{trend}</span>
            </div>
          )}
        </div>
        <div
          className="rounded-xl p-2.5 flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKpis(),
    refetchInterval: 1000 * 60 * 5,
  });

  const fmtBRL = (val: string | number) =>
    `R$ ${Number(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="animate-fade-up">
        <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
        <h1 className="font-display font-bold text-xl sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
          Visão Geral
        </h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Sk className="h-3 w-24" />
              <Sk className="h-8 w-28" />
              <Sk className="h-3 w-16" />
            </div>
          ))
        ) : (
          <>
            <KpiCard
              icon={Scale}
              label="Processos Ativos"
              value={kpis?.processosAtivos ?? 0}
              trend="em andamento"
              iconColor="#7C5CFC"
              iconBg="var(--accent-light)"
              accentColor="var(--accent)"
              delay="anim-delay-0"
            />
            <KpiCard
              icon={Calendar}
              label="Prazos (7 dias)"
              value={kpis?.prazosProximos ?? 0}
              trend="próximos vencimentos"
              iconColor="#F59E0B"
              iconBg="var(--warning-bg)"
              accentColor="#F59E0B"
              delay="anim-delay-75"
            />
            <KpiCard
              icon={TrendingUp}
              label="Receita do Mês"
              value={fmtBRL(kpis?.receitaMensal ?? 0)}
              trend="mês atual"
              trendUp={true}
              iconColor="#10B981"
              iconBg="var(--success-bg)"
              accentColor="#10B981"
              delay="anim-delay-150"
            />
            <KpiCard
              icon={AlertTriangle}
              label="Inadimplência"
              value={fmtBRL(kpis?.inadimplencia ?? 0)}
              trend="valores em aberto"
              trendUp={false}
              iconColor="#EF4444"
              iconBg="var(--danger-bg)"
              accentColor="#EF4444"
              delay="anim-delay-225"
            />
          </>
        )}
      </div>

      {/* Próximos Prazos */}
      <div className="card animate-fade-up anim-delay-300">
        {/* Card header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg p-1.5" style={{ background: 'var(--warning-bg)' }}>
              <Clock className="h-4 w-4" style={{ color: '#F59E0B' }} />
            </div>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Próximos Prazos
            </h2>
          </div>
          {!isLoading && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--warning-bg)', color: '#F59E0B' }}
            >
              {kpis?.proximosPrazos?.length ?? 0} pendentes
            </span>
          )}
        </div>

        {/* Rows */}
        <div>
          {isLoading ? (
            <div className="px-5 py-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sk className="w-2 h-2 rounded-full" />
                    <div className="space-y-1.5">
                      <Sk className="h-3.5 w-44" />
                      <Sk className="h-3 w-28" />
                    </div>
                  </div>
                  <Sk className="h-6 w-14 rounded-full" />
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
              const urgente  = diasRestantes <= 3;

              const dotColor = critico ? '#EF4444' : urgente ? '#F59E0B' : 'var(--accent)';
              const badgeBg  = critico ? 'var(--danger-bg)' : urgente ? 'var(--warning-bg)' : 'var(--accent-light)';
              const badgeColor = critico ? '#EF4444' : urgente ? '#F59E0B' : 'var(--accent)';

              return (
                <div
                  key={prazo.id}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors"
                  style={{
                    borderBottom: idx < (kpis?.proximosPrazos?.length ?? 0) - 1
                      ? '1px solid var(--border)'
                      : 'none',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: dotColor,
                        boxShadow: critico ? `0 0 6px ${dotColor}` : undefined,
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
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: badgeBg, color: badgeColor }}
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
