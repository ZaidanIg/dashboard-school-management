import { useState, useEffect } from 'react'
import { Plus, Search, Download, TrendingDown, Wallet, Calendar } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsSummary from '@/components/common/StatsSummary'

interface ExpenseRecord {
    id: string
    date: string
    category: string
    description: string
    amount: number
    vendor: string
    approvedBy?: string
}

const EXPENSE_CATEGORIES = [
    'Gaji',
    'Operasional',
    'Peralatan',
    'Pemeliharaan',
    'Kegiatan',
    'ATK',
    'Listrik & Air',
    'Lainnya'
]

export default function StaffExpenses() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [loading, setLoading] = useState(true)
    const [expenses, setExpenses] = useState<ExpenseRecord[]>([])

    useEffect(() => {
        // Simulated data load
        setTimeout(() => {
            setExpenses([
                { id: '1', date: '2026-01-21', category: 'Gaji', description: 'Gaji Guru Bulan Januari', amount: 85000000, vendor: 'Internal', approvedBy: 'Kepala Sekolah' },
                { id: '2', date: '2026-01-20', category: 'Listrik & Air', description: 'Tagihan PLN Januari', amount: 4500000, vendor: 'PLN', approvedBy: 'Bendahara' },
                { id: '3', date: '2026-01-18', category: 'Peralatan', description: 'Pembelian 5 Proyektor LCD', amount: 25000000, vendor: 'CV Elektronik Jaya', approvedBy: 'Kepala Sekolah' },
                { id: '4', date: '2026-01-15', category: 'ATK', description: 'Alat Tulis Kantor Semester 2', amount: 2500000, vendor: 'Toko ATK Makmur', approvedBy: 'Bendahara' },
                { id: '5', date: '2026-01-10', category: 'Pemeliharaan', description: 'Perbaikan AC Ruang Guru', amount: 1500000, vendor: 'Service AC Prima', approvedBy: 'Kepala TU' },
                { id: '6', date: '2026-01-08', category: 'Kegiatan', description: 'Biaya Pentas Seni Tahunan', amount: 8000000, vendor: 'Panitia OSIS', approvedBy: 'Kepala Sekolah' }
            ])
            setLoading(false)
        }, 500)
    }, [month])

    const filteredExpenses = expenses.filter(e => {
        if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false
        if (category && e.category !== category) return false
        return true
    })

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const stats = [
        { label: 'Total Pengeluaran', value: formatCurrency(totalExpenses), icon: TrendingDown, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
        { label: 'Transaksi', value: filteredExpenses.length.toString(), icon: Wallet, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Pengeluaran"
                subtitle="Kelola dan catat semua pengeluaran sekolah"
                breadcrumb={[
                    { label: 'Keuangan', path: '/staff-portal/finance/salary' },
                    { label: 'Pengeluaran' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Plus size={18} />
                            Tambah Pengeluaran
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari keterangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Kategori</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Expenses Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Keterangan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Vendor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Disetujui</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3 text-sm flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">
                                            {expense.description}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-secondary">{expense.vendor}</td>
                                        <td className="px-4 py-3 text-sm text-text-secondary">{expense.approvedBy || '-'}</td>
                                        <td className="px-4 py-3 text-right font-bold text-rose-600">
                                            -{formatCurrency(expense.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-rose-50 dark:bg-rose-900/20">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-right font-bold">Total:</td>
                                    <td className="px-4 py-3 text-right font-bold text-rose-700 dark:text-rose-400 text-lg">
                                        {formatCurrency(totalExpenses)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
