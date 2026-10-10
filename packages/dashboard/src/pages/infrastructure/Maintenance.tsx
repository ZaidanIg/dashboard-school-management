import { useState } from 'react'
import { Wrench, AlertTriangle, Clock, Check, Plus, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useMaintenance, useInventory, type MaintenanceRecord, type MaintenanceFormData } from '@/hooks/useInfrastructure'
import { useToast } from '@/contexts/ToastContext'

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

    const { maintenance, loading, error, refetch, create, update, remove, mutationLoading } = useMaintenance(params)
    const { inventory } = useInventory({ limit: 100 })
    const { addToast } = useToast()

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MaintenanceRecord | null>(null)
    const [deletingItem, setDeletingItem] = useState<MaintenanceRecord | null>(null)

    // Form
    const [formData, setFormData] = useState<MaintenanceFormData>({
        inventoryId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'REPAIR',
        description: '',
        cost: 0,
        technician: '',
        status: 'SCHEDULED'
    })

    const handleOpenCreate = () => {
        setFormData({
            inventoryId: inventory[0]?.id || '',
            date: new Date().toISOString().split('T')[0],
            type: 'REPAIR',
            description: '',
            cost: 0,
            technician: '',
            status: 'SCHEDULED'
        })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (item: MaintenanceRecord) => {
        setEditingItem(item)
        setFormData({
            inventoryId: item.inventoryId,
            date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
            type: item.type,
            description: item.description,
            cost: item.cost || 0,
            technician: item.technician || '',
            status: item.status
        })
    }

    const handleSaveCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.description) {
            addToast('error', 'Deskripsi kerusakan wajib diisi')
            return
        }

        try {
            await create(formData)
            addToast('success', 'Laporan pemeliharaan berhasil dibuat')
            setIsCreateOpen(false)
            refetch()
        } catch {
            addToast('error', 'Gagal membuat laporan pemeliharaan')
        }
    }

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem) return

        try {
            await update(editingItem.id, formData)
            addToast('success', 'Data pemeliharaan berhasil diperbarui')
            setEditingItem(null)
            refetch()
        } catch {
            addToast('error', 'Gagal memperbarui data pemeliharaan')
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        try {
            await remove(deletingItem.id)
            addToast('success', 'Data pemeliharaan berhasil dihapus')
            setDeletingItem(null)
            refetch()
        } catch {
            addToast('error', 'Gagal menghapus data')
        }
    }

    const columns: Column<MaintenanceRecord>[] = [
        {
            key: 'inventory.name' as keyof MaintenanceRecord,
            header: 'Item',
            render: (m) => <span className="font-medium text-gray-900 dark:text-white">{m.inventory?.name || 'Item Umum'}</span>
        },
        { key: 'description' as keyof MaintenanceRecord, header: 'Deskripsi Masalah' },
        { key: 'technician', header: 'Teknisi / Penanggung Jawab', render: (m) => m.technician || '-' },
        { key: 'date', header: 'Tanggal', render: (m) => m.date ? new Date(m.date).toLocaleDateString('id-ID') : '-' },
        {
            key: 'type',
            header: 'Tipe',
            render: (m) => (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {m.type === 'REPAIR' ? 'Perbaikan' : m.type === 'ROUTINE' ? 'Rutin' : 'Penggantian'}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (m) => (
                <StatusBadge
                    status={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'pending'}
                    label={m.status === 'COMPLETED' ? 'Selesai' : m.status === 'IN_PROGRESS' ? 'Dikerjakan' : 'Terjadwal'}
                />
            ),
        },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }

    const stats = [
        { label: 'Total Request', value: maintenance.length.toString(), icon: Wrench, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Dalam Proses', value: maintenance.filter(m => m.status === 'IN_PROGRESS').length.toString(), icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Selesai', value: maintenance.filter(m => m.status === 'COMPLETED').length.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Terjadwal', value: maintenance.filter(m => m.status === 'SCHEDULED').length.toString(), icon: AlertTriangle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pemeliharaan"
                subtitle="Kelola permintaan pemeliharaan dan perbaikan aset sekolah"
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
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Lapor Kerusakan
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari item atau deskripsi..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Status',
                        options: [
                            { label: 'Terjadwal', value: 'SCHEDULED' },
                            { label: 'Dalam Proses', value: 'IN_PROGRESS' },
                            { label: 'Selesai', value: 'COMPLETED' },
                        ],
                        onChange: (val) => handleFilterChange('status', val)
                    },
                ]}
                onAdd={handleOpenCreate}
                addLabel="Lapor Kerusakan"
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
                    onView={(item) => handleOpenEdit(item)}
                    onEdit={(item) => handleOpenEdit(item)}
                    onDelete={(item) => setDeletingItem(item)}
                    currentPage={page}
                    totalPages={1}
                    totalItems={maintenance.length}
                    onPageChange={setPage}
                />
            )}

            {/* Modal Tambah / Edit Maintenance */}
            {(isCreateOpen || editingItem) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Data Pemeliharaan' : 'Lapor Kerusakan / Pemeliharaan'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsCreateOpen(false)
                                    setEditingItem(null)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={editingItem ? handleSaveEdit : handleSaveCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Barang Terkait</label>
                                <select
                                    value={formData.inventoryId}
                                    onChange={e => setFormData({ ...formData, inventoryId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Pilih barang inventaris (opsional)</option>
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ({item.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tipe Pemeliharaan</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="REPAIR">Perbaikan</option>
                                        <option value="ROUTINE">Rutin</option>
                                        <option value="REPLACEMENT">Penggantian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="SCHEDULED">Terjadwal</option>
                                        <option value="IN_PROGRESS">Dalam Proses</option>
                                        <option value="COMPLETED">Selesai</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Teknisi / Petugas</label>
                                <input
                                    type="text"
                                    value={formData.technician}
                                    onChange={e => setFormData({ ...formData, technician: e.target.value })}
                                    placeholder="Nama teknisi / kontraktor"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Deskripsi Kerusakan / Tugas</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Jelaskan detail kerusakan yang terjadi..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateOpen(false)
                                        setEditingItem(null)
                                    }}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutationLoading}
                                    className="px-4 py-2 text-sm bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {mutationLoading ? 'Menyimpan...' : editingItem ? 'Perbarui Data' : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus Data Pemeliharaan"
                message={`Apakah Anda yakin ingin menghapus data pemeliharaan ini?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
