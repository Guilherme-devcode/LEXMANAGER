import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function SkRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
          <div
            className="h-3.5 rounded-full animate-pulse"
            style={{ background: 'var(--border)', width: `${50 + (i * 19) % 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  meta,
  onPageChange,
  isLoading,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  return (
    <div>
      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
      >
        <table className="min-w-full lex-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkRow key={i} cols={columns.length} />)
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ padding: '64px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className={col.className}>
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Mostrando{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            de{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{meta.total}</span>{' '}
            registros
          </p>

          <div className="flex items-center gap-1">
            <PagBtn onClick={() => onPageChange?.(1)} disabled={meta.page === 1}>
              <ChevronsLeft className="h-3.5 w-3.5" />
            </PagBtn>
            <PagBtn onClick={() => onPageChange?.(meta.page - 1)} disabled={meta.page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </PagBtn>

            <span
              className="px-3 py-1.5 text-xs font-semibold rounded-lg"
              style={{
                color: 'var(--accent)',
                background: 'var(--accent-light)',
                border: '1px solid var(--accent)',
                borderOpacity: '0.3',
              }}
            >
              {meta.page} / {meta.totalPages}
            </span>

            <PagBtn onClick={() => onPageChange?.(meta.page + 1)} disabled={meta.page === meta.totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </PagBtn>
            <PagBtn onClick={() => onPageChange?.(meta.totalPages)} disabled={meta.page === meta.totalPages}>
              <ChevronsRight className="h-3.5 w-3.5" />
            </PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg p-1.5 transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
      }}
    >
      {children}
    </button>
  );
}
