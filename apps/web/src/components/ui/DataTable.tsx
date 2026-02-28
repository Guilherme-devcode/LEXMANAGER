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

export function DataTable<T extends { id: string }>({
  data,
  columns,
  meta,
  onPageChange,
  isLoading,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}>
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

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} de {meta.total} registros
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(1)}
              disabled={meta.page === 1}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={meta.page === 1}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange?.(meta.totalPages)}
              disabled={meta.page === meta.totalPages}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
