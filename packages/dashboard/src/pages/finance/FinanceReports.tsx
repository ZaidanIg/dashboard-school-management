import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { useTransactionMutations } from '@/hooks/useFinance'
import { useToast } from '@/contexts/ToastContext'

export default function FinanceReports() {
    const { exportReports, loading } = useTransactionMutations()
    const toast = useToast()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [type, setType] = useState('')

    const handleGenerate = async () => {
        if (!startDate || !endDate) {
            toast.error('Mohon pilih tanggal mulai dan selesai')
            return
        }

        const success = await exportReports({
            startDate,
            endDate,
            type: type || undefined
        })

        if (success) {
            toast.success('Laporan berhasil diunduh')
        } else {
            toast.error('Gagal mengunduh laporan')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Laporan Keuangan"
                subtitle="Generate dan unduh laporan keuangan"
                breadcrumb={[
                    { label: 'Keuangan', path: '/finance' },
                    { label: 'Laporan' },
                ]}
            />

            {/* Quick Generate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-main dark:text-white">Export Laporan Transaksi</h3>
                        <p className="text-sm text-text-secondary">Unduh data transaksi keuangan dalam format CSV</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Jenis Transaksi
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                        >
                            <option value="">Semua Transaksi</option>
                            <option value="INCOME">Pemasukan</option>
                            <option value="EXPENSE">Pengeluaran</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tanggal Selesai
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Mengunduh...' : (
                            <>
                                <Download size={18} />
                                Download CSV
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Catatan:</strong> Laporan yang diunduh mencakup detail transaksi lengkap termasuk tanggal, kategori, deskripsi, jumlah, dan nomor referensi. Gunakan filter tanggal untuk membatasi periode laporan.
                </p>
            </div>
        </div>
    )
}
