import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[150px] font-bold text-primary/10 leading-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <Search size={48} className="text-primary" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-text-secondary mb-8">
                    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Home size={18} />
                        Ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-color dark:border-gray-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-text-main dark:text-white"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-border-color dark:border-gray-700">
                    <p className="text-sm text-text-secondary mb-4">Halaman populer:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link to="/" className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-full text-sm text-text-secondary hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/students" className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-full text-sm text-text-secondary hover:text-primary transition-colors">
                            Siswa
                        </Link>
                        <Link to="/teachers" className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-full text-sm text-text-secondary hover:text-primary transition-colors">
                            Guru
                        </Link>
                        <Link to="/finance" className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-full text-sm text-text-secondary hover:text-primary transition-colors">
                            Keuangan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
