import { useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import FinanceTransactionFormModal from '@/components/modals/FinanceTransactionFormModal'
import { useFinanceDashboard, useTransactionMutations } from '@/hooks/useFinance'
import { useToast } from '@/contexts/ToastContext'

export default function FinanceDashboard() {
    const { data: dashboard, loading, error, refetch } = useFinanceDashboard()
    const { createTransaction, loading: creating } = useTransactionMutations()
    const toast = useToast()

    const [isIncomeModalOpen, setIncomeModalOpen] = useState(false)
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false)

    const handleCreate = async (data: any) => {
        const result = await createTransaction(data)
        if (result) {
            setIncomeModalOpen(false)
            setExpenseModalOpen(false)
            refetch()
            toast.success('Transaksi berhasil dicatat')
        } else {
            toast.error('Gagal mencatat transaksi')
        }
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data keuangan..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />
    if (!dashboard) return null

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
    }

    const cashBalance = (dashboard.totalIncome || 0) + (dashboard.paidAmount || 0) - (dashboard.totalExpense || 0)

    const stats = [
        {
            label: 'Saldo Kas (Estimasi)',
            value: formatCurrency(cashBalance),
            trend: 'Total Bersih',
            isUp: true,
            icon: Wallet,
            color: 'text-primary',
            bg: 'bg-blue-50 dark:bg-blue-900/30'
        },
        {
            label: 'Total Pemasukan (Non-SPP)',
            value: formatCurrency(dashboard.totalIncome),
            trend: 'Income Lain',
            isUp: true,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/30'
        },
        {
            label: 'Total Pengeluaran',
            value: formatCurrency(dashboard.totalExpense),
            trend: 'Expense',
            isUp: false,
            icon: TrendingDown,
            color: 'text-rose-600',
            bg: 'bg-rose-50 dark:bg-rose-900/30'
        },
        {
            label: 'Tunggakan SPP',
            value: formatCurrency(dashboard.overdueAmount),
            trend: 'Belum Lunas',
            isUp: false,
            icon: CreditCard,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/30'
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Keuangan"
                subtitle="Ringkasan keuangan sekolah real-time"
                breadcrumb={[
                    { label: 'Keuangan', path: '/finance' },
                    { label: 'Dashboard' },
                ]}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIncomeModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                        >
                            <Plus size={16} /> Pemasukan
                        </button>
                        <button
                            onClick={() => setExpenseModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium"
                        >
                            <Plus size={16} /> Pengeluaran
                        </button>
                    </div>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                        <p className="text-xl font-bold text-text-main dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="p-4 border-b border-border-color dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-text-main dark:text-white">Transaksi Terbaru</h3>
                        <a href="/finance/reports" className="text-sm text-primary font-medium hover:underline">Lihat Semua</a>
                    </div>
                    <div className="divide-y divide-border-color dark:divide-gray-700">
                        {dashboard.recentTransactions.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary text-sm">Belum ada transaksi</div>
                        ) : (
                            dashboard.recentTransactions.map((tx) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-rose-50 dark:bg-rose-900/30'}`}>
                                            {tx.type === 'INCOME' ? (
                                                <ArrowDownRight size={18} className="text-emerald-600" />
                                            ) : (
                                                <ArrowUpRight size={18} className="text-rose-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-main dark:text-white">{tx.description}</p>
                                            <p className="text-xs text-text-secondary">{new Date(tx.date).toLocaleDateString()} &bull; {tx.category}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <FinanceTransactionFormModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIncomeModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={creating}
                defaultType="INCOME"
            />

            <FinanceTransactionFormModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={creating}
                defaultType="EXPENSE"
            />
        </div>
    )
}
