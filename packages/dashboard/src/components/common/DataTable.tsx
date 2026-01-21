import { ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'

export interface Column<T> {
    key: keyof T | string
    header: string
    render?: (item: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onView?: (item: T) => void
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    currentPage?: number
    totalPages?: number
    totalItems?: number
    onPageChange?: (page: number) => void
    isLoading?: boolean
}

export default function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onView,
    onEdit,
    onDelete,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    isLoading = false,
}: DataTableProps<T>) {
    const hasActions = onView || onEdit || onDelete

    const getValue = (item: T, key: string): unknown => {
        const keys = key.split('.')
        let value: unknown = item
        for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k]
        }
        return value
    }

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-gray-700/50 border-b border-border-color dark:border-gray-700">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {hasActions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color dark:divide-gray-700">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className={`px-4 py-4 text-sm text-text-main dark:text-white ${column.className || ''}`}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : String(getValue(item, String(column.key)) ?? '')}
                                    </td>
                                ))}
                                {hasActions && (
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-color dark:border-gray-700">
                <p className="text-sm text-text-secondary">
                    Showing {(currentPage - 1) * 10 + 1} to{' '}
                    {Math.min(currentPage * 10, totalItems)} of {totalItems} entries
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page: number
                        if (totalPages <= 5) {
                            page = i + 1
                        } else if (currentPage <= 3) {
                            page = i + 1
                        } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i
                        } else {
                            page = currentPage - 2 + i
                        }
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange?.(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <MoreHorizontal size={18} className="text-text-secondary" />
                            <button
                                onClick={() => onPageChange?.(totalPages)}
                                className="w-8 h-8 rounded-lg text-sm font-medium text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
