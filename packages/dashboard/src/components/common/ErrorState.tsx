import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
}

export default function ErrorState({ title = 'Terjadi Kesalahan', message, onRetry }: ErrorStateProps) {
    return (
        <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-main dark:text-white">{title}</h3>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{message}</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <RefreshCw size={16} />
                        Coba Lagi
                    </button>
                )}
            </div>
        </div>
    )
}
