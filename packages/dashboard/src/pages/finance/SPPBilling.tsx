import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, AlertCircle, Check, Clock, Bell, MessageSquare } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import { useBillings, useBillingActions } from '@/hooks/useFinance'
import { useToast } from '@/contexts/ToastContext'
import type { SPPBilling } from '@/types'

export default function SPPBillingPage() {
    const navigate = useNavigate()
    const { billings, loading, error, meta, refetch } = useBillings()
    const { sendNotification, loading: actionLoading } = useBillingActions()
    const toast = useToast()

    // Stats (Mock for now or Calculate from billings if paginated? 
    // Usually dashboard provides stats. Here we can sum up current page or fetch stats separately.
    // I'll keep simulated stats or zero for now to match dashboard)
    const stats = [
        { label: 'Total Tagihan', value: 'Rp -', icon: CreditCard, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Sudah Lunas', value: 'Rp -', icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Belum Bayar', value: 'Rp -', icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Tertunggak', value: 'Rp -', icon: AlertCircle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    const handleNotify = async (billingId: string) => {
        const result = await sendNotification(billingId)
        if (result) {
            toast.success('Notifikasi berhasil dikirim ke orang tua')
        } else {
            toast.error('Gagal mengirim notifikasi')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
    }

    const columns: Column<SPPBilling>[] = [
        {
            key: 'student',
            header: 'Nama Siswa',
            // @ts-ignore
            render: (b) => <span className="font-medium">{b.student?.name || 'Unknown'}</span>
        },
        {
            key: 'month',
            header: 'Bulan/Tahun',
            render: (b) => <span>{b.month}/{b.year}</span>
        },
        {
            key: 'amount',
            header: 'Jumlah',
            render: (b) => formatCurrency(Number(b.amount))
        },
        {
            key: 'dueDate',
            header: 'Jatuh Tempo',
            render: (b) => new Date(b.dueDate).toLocaleDateString('id-ID')
        },
        {
            key: 'status',
            header: 'Status',
            render: (billing) => (
                <StatusBadge
                    status={billing.status === 'PAID' ? 'success' : billing.status === 'PENDING' ? 'warning' : 'error'}
                    label={billing.status === 'PAID' ? 'Lunas' : billing.status === 'PENDING' ? 'Belum Bayar' : 'Tertunggak'}
                />
            ),
        },
        {
            key: 'id',
            header: 'Aksi',
            render: (b) => (
                <div className="flex items-center gap-2">
                    {b.status !== 'PAID' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNotify(b.id); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            title="Kirim Notifikasi ke Orang Tua"
                            disabled={actionLoading}
                        >
                            <MessageSquare size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ]

    if (loading) return <LoadingSpinner fullPage text="Memuat tagihan..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tagihan SPP"
                subtitle="Kelola tagihan SPP siswa dan notifikasi"
                breadcrumb={[
                    { label: 'Keuangan', path: '/finance' },
                    { label: 'Tagihan SPP' },
                ]}
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama siswa..."
                filters={[
                    {
                        label: 'Status',
                        options: [
                            { label: 'Lunas', value: 'PAID' },
                            { label: 'Belum Bayar', value: 'PENDING' },
                            { label: 'Tertunggak', value: 'OVERDUE' },
                        ],
                    },
                    {
                        label: 'Bulan',
                        options: [
                            // Should be dynamic, but hardcoded for now
                            { label: 'Januari', value: '1' },
                            { label: 'Februari', value: '2' },
                        ],
                    },
                ]}
                onExport={() => { }}
            />

            <DataTable
                columns={columns}
                // @ts-ignore
                data={billings}
                onView={(billing) => {
                    // Navigate to billing detail? Or just show modal?
                    // navigate(`/finance/billing/${billing.id}`)
                }}
                currentPage={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                totalItems={meta?.total || 0}
            />
        </div>
    )
}
