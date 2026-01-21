import { useState } from 'react'
import { Wrench, AlertTriangle, Clock, Check, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useMaintenance } from '@/hooks/useInfrastructure'
import type { MaintenanceRecord } from '@/hooks/useInfrastructure'

const priorityColors: Record<string, string> = {
    HIGH: 'bg-rose-50 text-rose-700',
    MEDIUM: 'bg-amber-50 text-amber-700',
    LOW: 'bg-slate-100 text-slate-700',
}

export default function Maintenance() {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        status: '',
        type: ''
    })
    const [page, setPage] = useState(1)

    const params: Record<string, string | number> = {
        page,
        limit: 10
    }
    if (search) params.search = search
    if (filters.status) params.status = filters.status

    const { maintenance, loading, error, refetch, meta } = useMaintenance(params)

    const columns: Column<MaintenanceRecord>[] = [
        { key: 'inventory.name' as keyof MaintenanceRecord, header: 'Item', render: (m) => <span className="font-medium">{m.inventory?.name || 'Unknown'}</span> },
        { key: 'description' as keyof MaintenanceRecord, header: 'Deskripsi' }, // Location might be in inventory relation
        { key: 'technician', header: 'Teknisi' },
        { key: 'date', header: 'Tanggal', render: (m) => new Date(m.date).toLocaleDateString('id-ID') },
        {
            key: 'type',
            header: 'Tipe', // No priority in MaintenanceRecord type, using Type instead? Or maybe add priority to type if needed.
            render: (m) => (
                <span className="px-2 py-1 rounded text-xs bg-slate-100">{m.type}</span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (m) => (
                <StatusBadge
                    status={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'pending'}
                    label={m.status}
                />
            ),
        },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }

    const stats = [
        { label: 'Total Request', value: meta ? meta.total.toString() : '...', icon: Wrench, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Dalam Proses', value: maintenance.filter(m => m.status === 'IN_PROGRESS').length.toString(), icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Selesai', value: maintenance.filter(m => m.status === 'COMPLETED').length.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Scheduled', value: maintenance.filter(m => m.status === 'SCHEDULED').length.toString(), icon: AlertTriangle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pemeliharaan"
                subtitle="Kelola permintaan pemeliharaan dan perbaikan"
                breadcrumb={[
                    { label: 'Infrastruktur', path: '/infrastructure' },
                    { label: 'Pemeliharaan' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Plus size={18} />
                            Lapor Kerusakan
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari item..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Status',
                        options: [
                            { label: 'Pending/Scheduled', value: 'SCHEDULED' },
                            { label: 'Dalam Proses', value: 'IN_PROGRESS' },
                            { label: 'Selesai', value: 'COMPLETED' },
                        ],
                        onChange: (val) => handleFilterChange('status', val)
                    },
                ]}
                onExport={() => { }}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={maintenance}
                    onView={() => { }}
                    onEdit={() => { }}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
