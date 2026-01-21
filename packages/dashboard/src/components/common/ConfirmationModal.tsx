import { X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const variantStyles = {
        danger: {
            icon: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30',
            button: 'bg-rose-600 hover:bg-rose-700 text-white',
        },
        warning: {
            icon: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
            button: 'bg-amber-600 hover:bg-amber-700 text-white',
        },
        info: {
            icon: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
    }

    const style = variantStyles[variant]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-text-secondary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${style.icon}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-text-secondary dark:text-gray-300">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 ${style.button} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
