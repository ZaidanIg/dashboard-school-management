import { useState } from 'react'
import { Megaphone, Plus, Calendar, Edit, Trash2, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useAnnouncements, type Announcement, type AnnouncementFormData } from '@/hooks/useCommunication'
import { useToast } from '@/contexts/ToastContext'

const typeColors: Record<string, string> = {
    INFO: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MEETING: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    EXAM: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    URGENT: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Announcements() {
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState<string>('')
    const [filterStatus, setFilterStatus] = useState<string>('')

    // Convert filters to record for hook
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (filterType) params.type = filterType
    if (filterStatus) params.status = filterStatus

    const { announcements, loading, error, refetch, create, update, remove, mutationLoading } = useAnnouncements(params)
    const { addToast } = useToast()

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Announcement | null>(null)
    const [deletingItem, setDeletingItem] = useState<Announcement | null>(null)

    // Form
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: '',
        content: '',
        type: 'INFO',
        target: 'ALL',
        status: 'PUBLISHED',
        authorId: ''
    })

    const handleOpenCreate = () => {
        setFormData({
            title: '',
            content: '',
            type: 'INFO',
            target: 'ALL',
            status: 'PUBLISHED',
            authorId: ''
        })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (item: Announcement) => {
        setEditingItem(item)
        setFormData({
            title: item.title,
            content: item.content,
            type: item.type,
            target: item.target,
            status: item.status,
            authorId: item.authorId || ''
        })
    }

    const handleSaveCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.content) {
            addToast('error', 'Judul dan konten pengumuman wajib diisi')
            return
        }

        try {
            const res = await create(formData)
            if (!res) {
                addToast('error', 'Gagal membuat pengumuman')
                return
            }
            addToast('success', 'Pengumuman berhasil dibuat')
            setIsCreateOpen(false)
            await refetch()
        } catch {
            addToast('error', 'Gagal membuat pengumuman')
        }
    }

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem) return

        try {
            const res = await update(editingItem.id, formData)
            if (!res) {
                addToast('error', 'Gagal memperbarui pengumuman')
                return
            }
            addToast('success', 'Pengumuman berhasil diperbarui')
            setEditingItem(null)
            await refetch()
        } catch {
            addToast('error', 'Gagal memperbarui pengumuman')
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        try {
            await remove(deletingItem.id)
            addToast('success', 'Pengumuman berhasil dihapus')
            setDeletingItem(null)
            refetch()
        } catch {
            addToast('error', 'Gagal menghapus pengumuman')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pengumuman"
                subtitle="Kelola pengumuman sekolah"
                breadcrumb={[
                    { label: 'Komunikasi', path: '/communication' },
                    { label: 'Pengumuman' },
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
                            Buat Pengumuman
                        </button>
                    </div>
                }
            />

            <FilterBar
                searchPlaceholder="Cari pengumuman..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Tipe',
                        options: [
                            { label: 'Info', value: 'INFO' },
                            { label: 'Meeting', value: 'MEETING' },
                            { label: 'Exam', value: 'EXAM' },
                            { label: 'Urgent', value: 'URGENT' },
                        ],
                        onChange: (val) => setFilterType(val)
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Published', value: 'PUBLISHED' },
                            { label: 'Draft', value: 'DRAFT' },
                            { label: 'Archived', value: 'ARCHIVED' },
                        ],
                        onChange: (val) => setFilterStatus(val)
                    },
                ]}
                onAdd={handleOpenCreate}
                addLabel="Buat Pengumuman"
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : !Array.isArray(announcements) || announcements.length === 0 ? (
                <div className="text-center py-12 text-text-secondary bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">Belum ada pengumuman</p>
                    <p className="text-xs text-gray-500 mt-1">Klik tombol &quot;Buat Pengumuman&quot; untuk menambahkan kabar baru.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {(Array.isArray(announcements) ? announcements : []).map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 shadow-sm hover:border-blue-200 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-text-main dark:text-white">
                                                {announcement.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColors[announcement.type] || 'bg-gray-100 text-gray-700'}`}>
                                                {announcement.type}
                                            </span>
                                            {announcement.status === 'DRAFT' && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-secondary mb-2 whitespace-pre-wrap">{announcement.content}</p>
                                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                            <span>Target: {announcement.target}</span>
                                            {announcement.author?.name && <span>Oleh: {announcement.author.name}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenEdit(announcement)}
                                        className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Edit Pengumuman"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingItem(announcement)}
                                        className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                        title="Hapus Pengumuman"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tambah / Edit Pengumuman */}
            {(isCreateOpen || editingItem) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
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
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Judul Pengumuman</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Pengumuman Libur Hari Raya"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tipe</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="INFO">Info</option>
                                        <option value="MEETING">Rapat</option>
                                        <option value="EXAM">Ujian</option>
                                        <option value="URGENT">Mendesak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Target</label>
                                    <select
                                        value={formData.target}
                                        onChange={e => setFormData({ ...formData, target: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="ALL">Semua</option>
                                        <option value="STUDENTS">Siswa</option>
                                        <option value="TEACHERS">Guru</option>
                                        <option value="PARENTS">Orang Tua</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="PUBLISHED">Dipublikasikan</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="ARCHIVED">Arsip</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Isi Pengumuman</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Tulis detail isi pengumuman..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                    {mutationLoading ? 'Menyimpan...' : editingItem ? 'Perbarui Pengumuman' : 'Publikasikan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus Pengumuman"
                message={`Apakah Anda yakin ingin menghapus pengumuman "${deletingItem?.title}"?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
