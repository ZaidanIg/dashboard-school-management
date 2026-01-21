import { useState, useEffect } from 'react'
import { DollarSign, Search, Download, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsSummary from '@/components/common/StatsSummary'
import { api } from '@/lib/api'

interface SPPBilling {
    id: string
    studentId: string
    studentName: string
    studentNis: string
    className: string
    month: string
    year: number
    amount: number
    paidAmount: number
    status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE'
    paidAt?: string
}

export default function StaffSPP() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [loading, setLoading] = useState(true)
    const [billings, setBillings] = useState<SPPBilling[]>([])

    useEffect(() => {
        const fetchBillings = async () => {
            setLoading(true)
            try {
                // Fetch from existing API - placeholder data if API doesn't exist
                const res = await api.get<any>('/api/finance/spp', { month })
                setBillings(res.data || [])
            } catch (error) {
                // Use placeholder data
                setBillings([
                    { id: '1', studentId: '1', studentName: 'Ahmad Rizki', studentNis: '2024001', className: '10-A', month: 'Januari', year: 2026, amount: 500000, paidAmount: 500000, status: 'PAID', paidAt: '2026-01-15' },
                    { id: '2', studentId: '2', studentName: 'Dewi Sartika', studentNis: '2024002', className: '10-A', month: 'Januari', year: 2026, amount: 500000, paidAmount: 250000, status: 'PARTIAL' },
                    { id: '3', studentId: '3', studentName: 'Budi Santoso', studentNis: '2024003', className: '10-B', month: 'Januari', year: 2026, amount: 500000, paidAmount: 0, status: 'UNPAID' },
                    { id: '4', studentId: '4', studentName: 'Siti Aminah', studentNis: '2024004', className: '10-B', month: 'Januari', year: 2026, amount: 500000, paidAmount: 0, status: 'OVERDUE' },
                    { id: '5', studentId: '5', studentName: 'Rudi Hartono', studentNis: '2024005', className: '11-A', month: 'Januari', year: 2026, amount: 500000, paidAmount: 500000, status: 'PAID', paidAt: '2026-01-10' }
                ])
            } finally {
                setLoading(false)
            }
        }
        fetchBillings()
    }, [month])

    const filteredBillings = billings.filter(b => {
        if (search && !b.studentName.toLowerCase().includes(search.toLowerCase()) && !b.studentNis.includes(search)) return false
        if (statusFilter && b.status !== statusFilter) return false
        return true
    })

    const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0)
    const totalPaid = billings.reduce((sum, b) => sum + b.paidAmount, 0)
    const paidCount = billings.filter(b => b.status === 'PAID').length
    const unpaidCount = billings.filter(b => b.status === 'UNPAID' || b.status === 'OVERDUE').length

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const stats = [
        { label: 'Total Tagihan', value: formatCurrency(totalAmount), icon: DollarSign, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
        { label: 'Sudah Terbayar', value: formatCurrency(totalPaid), icon: CheckCircle, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Lunas', value: paidCount.toString() + ' siswa', icon: CheckCircle, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Belum Lunas', value: unpaidCount.toString() + ' siswa', icon: AlertCircle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' }
    ]

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PAID': return { status: 'success' as const, label: 'Lunas', icon: CheckCircle }
            case 'PARTIAL': return { status: 'warning' as const, label: 'Sebagian', icon: Clock }
            case 'UNPAID': return { status: 'info' as const, label: 'Belum Bayar', icon: XCircle }
            case 'OVERDUE': return { status: 'error' as const, label: 'Terlambat', icon: AlertCircle }
            default: return { status: 'info' as const, label: status, icon: Clock }
        }
    }

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="SPP Siswa"
                subtitle="Kelola pembayaran SPP bulanan siswa"
                breadcrumb={[
                    { label: 'Keuangan', path: '/staff-portal/finance/salary' },
                    { label: 'SPP' }
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                        <Download size={18} />
                        Export Laporan
                    </button>
                }
            />

            <StatsSummary items={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIS siswa..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Status</option>
                    <option value="PAID">Lunas</option>
                    <option value="PARTIAL">Sebagian</option>
                    <option value="UNPAID">Belum Bayar</option>
                    <option value="OVERDUE">Terlambat</option>
                </select>
            </div>

            {/* SPP Table */}
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">NIS</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Nama Siswa</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Kelas</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Tagihan</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Terbayar</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Sisa</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {filteredBillings.map((billing) => {
                                    const statusConfig = getStatusConfig(billing.status)
                                    const remaining = billing.amount - billing.paidAmount
                                    return (
                                        <tr key={billing.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    {billing.studentNis}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-text-main dark:text-white">
                                                {billing.studentName}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">{billing.className}</td>
                                            <td className="px-4 py-3 text-right text-sm">{formatCurrency(billing.amount)}</td>
                                            <td className="px-4 py-3 text-right text-sm text-emerald-600">
                                                {formatCurrency(billing.paidAmount)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm">
                                                {remaining > 0 ? (
                                                    <span className="text-rose-600">{formatCurrency(remaining)}</span>
                                                ) : (
                                                    <span className="text-emerald-600">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={statusConfig.status} label={statusConfig.label} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {billing.status !== 'PAID' && (
                                                    <button className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">
                                                        Bayar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
