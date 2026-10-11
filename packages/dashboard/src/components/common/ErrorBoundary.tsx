import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
    children: ReactNode
    fallbackTitle?: string
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    private handleReload = () => {
        window.location.reload()
    }

    private handleGoHome = () => {
        window.location.href = '/'
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">
                            {this.props.fallbackTitle || 'Terjadi Kendala Memuat Halaman'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Mohon maaf, halaman mengalami kendala saat memuat data. Silakan coba muat ulang atau kembali ke halaman beranda.
                        </p>

                        {this.state.error?.message && (
                            <div className="p-3 mb-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-mono text-left overflow-x-auto max-h-32">
                                {this.state.error.message}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                            >
                                <RefreshCw size={16} />
                                <span>Muat Ulang</span>
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors"
                            >
                                <Home size={16} />
                                <span>Ke Halaman Utama</span>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
