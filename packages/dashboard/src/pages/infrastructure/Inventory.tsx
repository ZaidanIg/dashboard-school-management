import { useState } from 'react'
import { Package, Wrench, AlertTriangle, Check, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useInventory } from '@/hooks/useInfrastructure'
import type { InventoryItem } from '@/hooks/useInfrastructure'

export default function Inventory() {
    const [search, setSearch] = useState('')
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        condition: ''
    })
    const [page, setPage] = useState(1)

    // Build params
    const params: Record<string, string | number> = {
        page,
        limit: 10
    }
    if (search) params.search = search
    if (activeFilters.category) params.category = activeFilters.category
    if (activeFilters.condition) params.condition = activeFilters.condition

    const { inventory, loading, error, refetch, meta } = useInventory(params)

    const columns: Column<InventoryItem>[] = [
        {
            key: 'code',
            header: 'Kode',
            render: (i) => <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">{i.code}</span>,
        },
        { key: 'name', header: 'Nama Barang', render: (i) => <span className="font-medium">{i.name}</span> },
        { key: 'category', header: 'Kategori' },
        { key: 'location', header: 'Lokasi' },
        { key: 'quantity', header: 'Jumlah', render: (i) => `${i.quantity} unit` },
        {
            key: 'condition',
            header: 'Kondisi',
            render: (i) => (
                <StatusBadge
                    status={i.condition === 'GOOD' ? 'success' : i.condition === 'FAIR' ? 'warning' : 'error'}
                    label={i.condition === 'GOOD' ? 'Baik' : i.condition === 'FAIR' ? 'Cukup' : 'Rusak'}
                />
            ),
        },
        { key: 'lastMaintenance', header: 'Cek Terakhir', render: (i) => i.lastMaintenance ? new Date(i.lastMaintenance).toLocaleDateString('id-ID') : '-' },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }

    // Stats (Mock for now or if API provides aggregation later)
    const stats = [
        { label: 'Total Inventaris', value: meta ? meta.total.toString() : '...', icon: Package, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Kondisi Baik', value: inventory.filter(i => i.condition === 'GOOD').length.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Perlu Perbaikan', value: inventory.filter(i => i.condition === 'FAIR').length.toString(), icon: Wrench, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Rusak Berat', value: inventory.filter(i => i.condition === 'POOR' || i.condition === 'DAMAGED').length.toString(), icon: AlertTriangle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventaris"
                subtitle="Kelola inventaris dan aset sekolah"
                breadcrumb={[
                    { label: 'Infrastruktur', path: '/infrastructure' },
                    { label: 'Inventaris' },
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
                            Tambah Barang
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama barang..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Kategori',
                        options: [
                            { label: 'Elektronik', value: 'Elektronik' },
                            { label: 'Furnitur', value: 'Furnitur' },
                            { label: 'Perlengkapan', value: 'Perlengkapan' },
                        ],
                        onChange: (val) => handleFilterChange('category', val)
                    },
                    {
                        label: 'Kondisi',
                        options: [
                            { label: 'Baik', value: 'GOOD' },
                            { label: 'Cukup', value: 'FAIR' },
                            { label: 'Rusak', value: 'POOR' }, // Assuming POOR/DAMAGED mapped
                        ],
                        onChange: (val) => handleFilterChange('condition', val)
                    },
                ]}
                onAdd={() => { }}
                addLabel="Tambah Barang"
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
                    data={inventory}
                    onView={() => { }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
