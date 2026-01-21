interface StatusBadgeProps {
    status: 'active' | 'inactive' | 'pending' | 'success' | 'warning' | 'error' | 'info'
    label: string
}

const statusStyles = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
}

const statusDots = {
    active: 'bg-emerald-500',
    inactive: 'bg-slate-400',
    pending: 'bg-amber-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]}`}></span>
            {label}
        </span>
    )
}
