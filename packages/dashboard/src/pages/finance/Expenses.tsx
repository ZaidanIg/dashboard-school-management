import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import FinanceTransactionFormModal from '@/components/modals/FinanceTransactionFormModal'
import { useTransactions, useTransactionMutations } from '@/hooks/useFinance'
import { useDebounce } from '@/hooks/useShared'
import type { FinanceTransaction } from '@/types'
import { useToast } from '@/contexts/ToastContext'

export default function Expenses() {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Hooks
    const debouncedSearch = useDebounce(search)

    const { transactions, loading, error, refetch, meta } = useTransactions({
        type: 'EXPENSE',
        // @ts-ignore
        search: debouncedSearch,
        category: categoryFilter || undefined
    })

    const { createTransaction, exportReports, loading: mutating } = useTransactionMutations()
    const toast = useToast()

    const handleCreate = async (data: any) => {
        const result = await createTransaction(data)
        if (result) {
            setIsModalOpen(false)
            refetch()
            toast.success('Pengeluaran berhasil dicatat')
        } else {
            toast.error('Gagal mencatat pengeluaran')
        }
    }

    const handleExport = async () => {
        const success = await exportReports({ type: 'EXPENSE', category: categoryFilter })
        if (success) {
            toast.success('Export berhasil', 'Laporan pengeluaran telah diunduh')
        } else {
            toast.error('Export gagal')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
    }

    const columns: Column<FinanceTransaction>[] = [
        {
            key: 'date',
            header: 'Tanggal',
            render: (t) => new Date(t.date).toLocaleDateString('id-ID')
        },
        {
            key: 'description',
            header: 'Deskripsi',
            render: (t) => (
                <div>
                    <p className="font-medium text-text-main dark:text-white">{t.description}</p>
                    {t.referenceNumber && <p className="text-xs text-text-secondary">Ref: {t.referenceNumber}</p>}
                </div>
            )
        },
        {
            key: 'category',
            header: 'Kategori',
            render: (t) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                    {t.category}
                </span>
            ),
        },
        {
            key: 'amount',
            header: 'Jumlah',
            render: (t) => <span className="font-semibold text-rose-600">{formatCurrency(t.amount)}</span>
        },
    ]

    if (loading) return <LoadingSpinner fullPage text="Memuat data pengeluaran..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pengeluaran"
                subtitle="Kelola data pengeluaran keuangan"
                breadcrumb={[
                    { label: 'Keuangan', path: '/finance' },
                    { label: 'Pengeluaran' },
                ]}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Download size={18} />
                            Export
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Pengeluaran
                        </button>
                    </div>
                }
            />

            <FilterBar
                searchPlaceholder="Cari transaksi..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Kategori',
                        value: categoryFilter,
                        onChange: setCategoryFilter,
                        options: [
                            { label: 'Gaji', value: 'Gaji' },
                            { label: 'ATK', value: 'ATK' },
                            { label: 'Utilitas', value: 'Utilitas' },
                            { label: 'Pemeliharaan', value: 'Pemeliharaan' },
                            { label: 'Konsumsi', value: 'Konsumsi' },
                            { label: 'Lainnya', value: 'Lainnya' },
                        ],
                    }
                ]}
            />

            <DataTable
                columns={columns}
                data={transactions}
                onView={() => { }}
                currentPage={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                totalItems={meta?.total || 0}
            />

            <FinanceTransactionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={mutating}
                defaultType="EXPENSE"
            />
        </div>
    )
}
