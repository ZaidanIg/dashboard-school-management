import { type LucideIcon, FileX } from 'lucide-react'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

export default function EmptyState({
    icon: Icon = FileX,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Icon size={32} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-text-secondary max-w-md mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}
