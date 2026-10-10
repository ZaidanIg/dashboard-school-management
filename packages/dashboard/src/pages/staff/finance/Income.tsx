import { useState, useEffect } from 'react'
import { Plus, Search, Download, TrendingUp, Wallet, Calendar } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsSummary from '@/components/common/StatsSummary'

interface IncomeRecord {
    id: string
    date: string
    category: string
    description: string
    amount: number
    source: string
}

const INCOME_CATEGORIES = [
    'SPP',
    'Dana BOS',
    'Donasi',
    'Pendaftaran',
    'Kegiatan',
    'Lainnya'
]

export default function StaffIncome() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [loading, setLoading] = useState(true)
    const [incomes, setIncomes] = useState<IncomeRecord[]>([])
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        // Simulated data load
        setTimeout(() => {
            setIncomes([
                { id: '1', date: '2026-01-21', category: 'SPP', description: 'Pembayaran SPP Januari - 25 siswa', amount: 12500000, source: 'Wali Murid' },
                { id: '2', date: '2026-01-20', category: 'Dana BOS', description: 'Dana BOS Triwulan 1', amount: 150000000, source: 'Kemendikbud' },
                { id: '3', date: '2026-01-18', category: 'Donasi', description: 'Donasi Alumni Angkatan 2020', amount: 5000000, source: 'Alumni' },
                { id: '4', date: '2026-01-15', category: 'Pendaftaran', description: 'Biaya PPDB 10 siswa baru', amount: 3500000, source: 'Pendaftaran' },
                { id: '5', date: '2026-01-10', category: 'Kegiatan', description: 'Kontribusi Pentas Seni', amount: 2000000, source: 'Panitia Acara' }
            ])
            setLoading(false)
        }, 500)
    }, [month])

    const filteredIncomes = incomes.filter(i => {
        if (search && !i.description.toLowerCase().includes(search.toLowerCase())) return false
        if (category && i.category !== category) return false
        return true
    })

    const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0)

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
        { label: 'Total Pemasukan', value: formatCurrency(totalIncome), icon: TrendingUp, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Transaksi', value: filteredIncomes.length.toString(), icon: Wallet, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Pemasukan"
                subtitle="Kelola dan catat semua pemasukan sekolah"
                breadcrumb={[
                    { label: 'Keuangan', path: '/staff-portal/finance/salary' },
                    { label: 'Pemasukan' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Pemasukan
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
                    {INCOME_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Income Table */}
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Sumber</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {filteredIncomes.map((income) => (
                                    <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3 text-sm flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {formatDate(income.date)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                                                {income.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">
                                            {income.description}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-secondary">{income.source}</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                            +{formatCurrency(income.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-emerald-50 dark:bg-emerald-900/20">
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
                                    <td className="px-4 py-3 text-right font-bold text-emerald-700 dark:text-emerald-400 text-lg">
                                        {formatCurrency(totalIncome)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Tambah Pemasukan */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Tambah Pemasukan</h3>
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const form = e.target as HTMLFormElement
                            const fd = new FormData(form)
                            const newRecord: IncomeRecord = {
                                id: Date.now().toString(),
                                date: (fd.get('date') as string) || new Date().toISOString().slice(0, 10),
                                category: (fd.get('category') as string) || 'Lainnya',
                                description: (fd.get('description') as string) || '',
                                amount: Number(fd.get('amount')) || 0,
                                source: (fd.get('source') as string) || ''
                            }
                            setIncomes(prev => [newRecord, ...prev])
                            setShowForm(false)
                        }} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Tanggal</label>
                                <input type="date" name="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full px-3 py-2 border border-border-color rounded-lg text-sm bg-slate-50 dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Kategori</label>
                                <select name="category" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm bg-slate-50 dark:bg-gray-700">
                                    {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Keterangan</label>
                                <input type="text" name="description" placeholder="Contoh: Pembayaran SPP" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm bg-slate-50 dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Jumlah (Rp)</label>
                                <input type="number" name="amount" placeholder="0" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm bg-slate-50 dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Sumber</label>
                                <input type="text" name="source" placeholder="Contoh: Wali Murid" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm bg-slate-50 dark:bg-gray-700" required />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border-color rounded-lg text-sm">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
