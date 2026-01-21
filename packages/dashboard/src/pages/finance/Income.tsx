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

export default function Income() {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Hooks
    const debouncedSearch = useDebounce(search)

    // We need to extend useTransactions to accept search/category if not already mapped in hook
    // Looking at useFinance.ts, it accepts `options` which is passed to api.get params.
    // So passing { type: 'INCOME', search: debouncedSearch, category: categoryFilter } works.

    const { transactions, loading, error, refetch, meta } = useTransactions({
        type: 'INCOME',
        // @ts-ignore - search and category are valid but not in typed options in hook definition yet, but passed to api
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
            toast.success('Pemasukan berhasil dicatat')
        } else {
            toast.error('Gagal mencatat pemasukan')
        }
    }

    const handleExport = async () => {
        const success = await exportReports({ type: 'INCOME', category: categoryFilter })
        if (success) {
            toast.success('Export berhasil', 'Laporan pemasukan telah diunduh')
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
                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {t.category}
                </span>
            ),
        },
        {
            key: 'amount',
            header: 'Jumlah',
            render: (t) => <span className="font-semibold text-emerald-600">{formatCurrency(t.amount)}</span>
        },
    ]

    if (loading) return <LoadingSpinner fullPage text="Memuat data pemasukan..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pemasukan"
                subtitle="Kelola data pemasukan keuangan"
                breadcrumb={[
                    { label: 'Keuangan', path: '/finance' },
                    { label: 'Pemasukan' },
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
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Pemasukan
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
                            { label: 'SPP', value: 'SPP' },
                            { label: 'Pendaftaran', value: 'Pendaftaran' },
                            { label: 'Dana BOS', value: 'Dana BOS' },
                            { label: 'Donasi', value: 'Donasi' },
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
                defaultType="INCOME"
            />
        </div>
    )
}
