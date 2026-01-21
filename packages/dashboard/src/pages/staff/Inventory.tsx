import { useState } from 'react'
import { Plus, Search, Wrench, AlertTriangle, Check, Package, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsSummary from '@/components/common/StatsSummary'
import { useInventory } from '@/hooks/useInfrastructure'
import type { InventoryItem } from '@/hooks/useInfrastructure'

export default function StaffInventory() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [condition, setCondition] = useState('')
    const [category, setCategory] = useState('')

    const params: Record<string, string | number> = { page, limit: 10 }
    if (search) params.search = search
    if (condition) params.condition = condition
    if (category) params.category = category

    const { inventory, loading, error, meta, refetch } = useInventory(params)

    const columns: Column<InventoryItem>[] = [
        {
            key: 'code',
            header: 'Kode',
            render: (i) => <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">{i.code}</span>
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
            )
        },
        {
            key: 'lastMaintenance',
            header: 'Update Terakhir',
            render: (i) => i.lastMaintenance ? new Date(i.lastMaintenance).toLocaleDateString('id-ID') : '-'
        }
    ]

    const stats = [
        { label: 'Total Item', value: meta?.total?.toString() || '0', icon: Package, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
        { label: 'Kondisi Baik', value: inventory.filter(i => i.condition === 'GOOD').length.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Perlu Perbaikan', value: inventory.filter(i => i.condition === 'FAIR').length.toString(), icon: Wrench, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Rusak', value: inventory.filter(i => i.condition === 'POOR' || i.condition === 'DAMAGED').length.toString(), icon: AlertTriangle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Inventaris"
                subtitle="Kelola aset dan inventaris sekolah"
                breadcrumb={[{ label: 'Inventaris' }]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={18} />
                        Tambah Barang
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
                        placeholder="Cari nama barang..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Furnitur">Furnitur</option>
                    <option value="Perlengkapan">Perlengkapan</option>
                </select>
                <select
                    value={condition}
                    onChange={(e) => { setCondition(e.target.value); setPage(1) }}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Kondisi</option>
                    <option value="GOOD">Baik</option>
                    <option value="FAIR">Cukup</option>
                    <option value="POOR">Rusak</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                    <Download size={18} />
                    Export
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
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
