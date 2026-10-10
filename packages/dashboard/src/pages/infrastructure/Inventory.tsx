import { useState } from 'react'
import { Package, Wrench, AlertTriangle, Check, Plus, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useInventory, type InventoryItem, type InventoryFormData } from '@/hooks/useInfrastructure'
import { useToast } from '@/contexts/ToastContext'

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

    const { inventory, loading, error, refetch, create, update, remove, mutationLoading } = useInventory(params)
    const { addToast } = useToast()

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)

    // Form
    const [formData, setFormData] = useState<InventoryFormData>({
        code: '',
        name: '',
        category: 'Elektronik',
        location: '',
        quantity: 1,
        condition: 'GOOD',
        status: 'AVAILABLE'
    })

    const handleOpenCreate = () => {
        setFormData({
            code: `INV-${Date.now().toString().slice(-5)}`,
            name: '',
            category: 'Elektronik',
            location: '',
            quantity: 1,
            condition: 'GOOD',
            status: 'AVAILABLE'
        })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (item: InventoryItem) => {
        setEditingItem(item)
        setFormData({
            code: item.code,
            name: item.name,
            category: item.category,
            location: item.location || '',
            quantity: item.quantity,
            condition: item.condition,
            status: item.status
        })
    }

    const handleSaveCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.code) {
            addToast('error', 'Nama barang dan kode wajib diisi')
            return
        }

        try {
            await create(formData)
            addToast('success', 'Barang inventaris berhasil ditambahkan')
            setIsCreateOpen(false)
            refetch()
        } catch {
            addToast('error', 'Gagal menambahkan barang')
        }
    }

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem) return

        try {
            await update(editingItem.id, formData)
            addToast('success', 'Barang inventaris berhasil diperbarui')
            setEditingItem(null)
            refetch()
        } catch {
            addToast('error', 'Gagal memperbarui barang')
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        try {
            await remove(deletingItem.id)
            addToast('success', 'Barang inventaris berhasil dihapus')
            setDeletingItem(null)
            refetch()
        } catch {
            addToast('error', 'Gagal menghapus barang')
        }
    }

    const columns: Column<InventoryItem>[] = [
        {
            key: 'code',
            header: 'Kode',
            render: (i) => <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">{i.code}</span>,
        },
        { key: 'name', header: 'Nama Barang', render: (i) => <span className="font-medium text-gray-900 dark:text-white">{i.name}</span> },
        { key: 'category', header: 'Kategori' },
        { key: 'location', header: 'Lokasi', render: (i) => i.location || '-' },
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
    ]

    const handleFilterChange = (key: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }

    const stats = [
        { label: 'Total Inventaris', value: inventory.length.toString(), icon: Package, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Kondisi Baik', value: inventory.filter(i => i.condition === 'GOOD').length.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Perlu Perbaikan', value: inventory.filter(i => i.condition === 'FAIR').length.toString(), icon: Wrench, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Rusak Berat', value: inventory.filter(i => i.condition === 'POOR' || i.condition === 'DAMAGED').length.toString(), icon: AlertTriangle, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventaris"
                subtitle="Kelola inventaris dan aset fasilitas sekolah"
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
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Barang
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama atau kode barang..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Kategori',
                        options: [
                            { label: 'Elektronik', value: 'Elektronik' },
                            { label: 'Furnitur', value: 'Furnitur' },
                            { label: 'Perlengkapan', value: 'Perlengkapan' },
                            { label: 'Laboratorium', value: 'Laboratorium' },
                        ],
                        onChange: (val) => handleFilterChange('category', val)
                    },
                    {
                        label: 'Kondisi',
                        options: [
                            { label: 'Baik', value: 'GOOD' },
                            { label: 'Cukup', value: 'FAIR' },
                            { label: 'Rusak Ringan', value: 'POOR' },
                            { label: 'Rusak Berat', value: 'DAMAGED' },
                        ],
                        onChange: (val) => handleFilterChange('condition', val)
                    },
                ]}
                onAdd={handleOpenCreate}
                addLabel="Tambah Barang"
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
                    onView={(item) => handleOpenEdit(item)}
                    onEdit={(item) => handleOpenEdit(item)}
                    onDelete={(item) => setDeletingItem(item)}
                    currentPage={page}
                    totalPages={1}
                    totalItems={inventory.length}
                    onPageChange={setPage}
                />
            )}

            {/* Modal Tambah / Edit Barang */}
            {(isCreateOpen || editingItem) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Barang Inventaris' : 'Tambah Barang Baru'}
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
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Kode Barang</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Elektronik">Elektronik</option>
                                        <option value="Furnitur">Furnitur</option>
                                        <option value="Perlengkapan">Perlengkapan</option>
                                        <option value="Laboratorium">Laboratorium</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nama Barang</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Proyektor Epson EB-X400"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Lokasi Ruang</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Lab Komputer 1"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Jumlah (Unit)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Kondisi</label>
                                    <select
                                        value={formData.condition}
                                        onChange={e => setFormData({ ...formData, condition: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="GOOD">Baik</option>
                                        <option value="FAIR">Cukup</option>
                                        <option value="POOR">Rusak Ringan</option>
                                        <option value="DAMAGED">Rusak Berat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status Ketersediaan</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="AVAILABLE">Tersedia</option>
                                        <option value="IN_USE">Digunakan</option>
                                        <option value="MAINTENANCE">Perbaikan</option>
                                        <option value="DISPOSED">Dihapus</option>
                                    </select>
                                </div>
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
                                    {mutationLoading ? 'Menyimpan...' : editingItem ? 'Perbarui Barang' : 'Simpan Barang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus Inventaris"
                message={`Apakah Anda yakin ingin menghapus barang "${deletingItem?.name}" (${deletingItem?.code})?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
