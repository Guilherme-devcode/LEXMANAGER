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

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded animate-pulse"
            style={{ background: 'var(--bg-overlay)', width: `${55 + (i * 17) % 35}%` }}
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
      {/* Table wrapper */}
      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: '1px solid var(--border-soft)' }}
      >
        <table className="min-w-full lex-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest ${col.className || ''}`}
                  style={{
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody style={{ background: 'var(--bg-raised)' }}>
            {isLoading ? (
              <>
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
              </>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: 'default' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.025)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3.5 text-sm ${col.className || ''}`}
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as any)[col.key] ?? '')}
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
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Mostrando{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            de{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{meta.total}</span>{' '}
            registros
          </p>

          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => onPageChange?.(1)} disabled={meta.page === 1}>
              <ChevronsLeft className="h-3.5 w-3.5" />
            </PaginationBtn>
            <PaginationBtn onClick={() => onPageChange?.(meta.page - 1)} disabled={meta.page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </PaginationBtn>

            <span
              className="px-3 py-1.5 text-xs font-semibold rounded-lg"
              style={{
                color: 'var(--gold-400)',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              {meta.page} / {meta.totalPages}
            </span>

            <PaginationBtn onClick={() => onPageChange?.(meta.page + 1)} disabled={meta.page === meta.totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </PaginationBtn>
            <PaginationBtn onClick={() => onPageChange?.(meta.totalPages)} disabled={meta.page === meta.totalPages}>
              <ChevronsRight className="h-3.5 w-3.5" />
            </PaginationBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg p-1.5 transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
          (e.currentTarget as HTMLElement).style.color = 'var(--gold-400)';
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
