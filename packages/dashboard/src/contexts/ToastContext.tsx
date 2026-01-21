import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (type: ToastType, title: string, message?: string) => void
    removeToast: (id: string) => void
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(7)}`
        const newToast: Toast = { id, type, title, message }
        setToasts((prev) => [...prev, newToast])

        // Auto remove after duration (default 5 seconds, 8 seconds for errors)
        const actualDuration = type === 'error' ? 8000 : duration
        if (actualDuration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, actualDuration)
        }
    }, [removeToast])

    // Convenience methods
    const success = useCallback((title: string, message?: string) => {
        addToast('success', title, message)
    }, [addToast])

    const error = useCallback((title: string, message?: string) => {
        addToast('error', title, message)
    }, [addToast])

    const warning = useCallback((title: string, message?: string) => {
        addToast('warning', title, message)
    }, [addToast])

    const info = useCallback((title: string, message?: string) => {
        addToast('info', title, message)
    }, [addToast])

    const toastStyles = {
        success: {
            bg: 'bg-emerald-50 dark:bg-emerald-900/40',
            border: 'border-l-4 border-emerald-500',
            icon: CheckCircle,
            iconColor: 'text-emerald-500',
            titleColor: 'text-emerald-800 dark:text-emerald-200'
        },
        error: {
            bg: 'bg-rose-50 dark:bg-rose-900/40',
            border: 'border-l-4 border-rose-500',
            icon: AlertCircle,
            iconColor: 'text-rose-500',
            titleColor: 'text-rose-800 dark:text-rose-200'
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-900/40',
            border: 'border-l-4 border-amber-500',
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            titleColor: 'text-amber-800 dark:text-amber-200'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/40',
            border: 'border-l-4 border-blue-500',
            icon: Info,
            iconColor: 'text-blue-500',
            titleColor: 'text-blue-800 dark:text-blue-200'
        }
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none max-w-md">
                {toasts.map((toast) => {
                    const style = toastStyles[toast.type]
                    const Icon = style.icon

                    return (
                        <div
                            key={toast.id}
                            className={`
                                pointer-events-auto min-w-[320px] rounded-lg shadow-xl p-4 flex items-start gap-3 
                                transform transition-all duration-300 animate-slide-in-right
                                ${style.bg} ${style.border}
                            `}
                            role="alert"
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                <Icon size={20} className={style.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${style.titleColor}`}>
                                    {toast.title}
                                </p>
                                {toast.message && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {toast.message}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                            >
                                <X size={16} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}
