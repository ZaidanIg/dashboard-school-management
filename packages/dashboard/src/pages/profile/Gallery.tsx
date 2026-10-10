import { Image as ImageIcon, Plus, Grid, List, Trash2, Calendar, Tag, X, Edit2 } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useGallery, type GalleryItem, type GalleryItemFormData } from '@/hooks/useProfile'

const categories = ['Semua', 'Kegiatan', 'Acara', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler']

const colorGradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
]

const sampleImages = [
    { label: 'Lab Komputer', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' },
    { label: 'Upacara Bendera', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60' },
    { label: 'Perpustakaan', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=60' },
    { label: 'Olahraga Basket', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
]

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const { items, loading, createItem, updateItem, deleteItem } = useGallery(activeCategory)

    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
    const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState<GalleryItemFormData>({
        title: '',
        category: 'Kegiatan',
        imageUrl: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })

    const handleOpenUpload = () => {
        setEditingItem(null)
        setFormData({
            title: '',
            category: 'Kegiatan',
            imageUrl: sampleImages[0].url,
            description: '',
            date: new Date().toISOString().split('T')[0]
        })
        setIsUploadOpen(true)
    }

    const handleOpenEdit = (item: GalleryItem) => {
        setEditingItem(item)
        setFormData({
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl,
            description: item.description || '',
            date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0]
        })
        setIsUploadOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.imageUrl) return

        setSubmitting(true)
        let ok = false
        if (editingItem) {
            ok = await updateItem(editingItem.id, formData)
        } else {
            ok = await createItem(formData)
        }
        setSubmitting(false)
        if (ok) {
            setIsUploadOpen(false)
            setEditingItem(null)
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        await deleteItem(deletingItem.id)
        setDeletingItem(null)
    }

    const totalCategories = new Set(items.map(i => i.category)).size

    return (
        <div className="space-y-6">
            <PageHeader
                title="Galeri Sekolah"
                subtitle="Dokumentasi kegiatan, fasilitas, dan prestasi sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Galeri' },
                ]}
                actions={
                    <button
                        onClick={handleOpenUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Upload Foto
                    </button>
                }
            />

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-gray-700 text-text-secondary hover:text-text-main hover:bg-slate-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                            title="Grid View"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                            title="List View"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content State */}
            {loading ? (
                <div className="py-20 flex justify-center">
                    <LoadingSpinner />
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                    <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-1">Belum Ada Foto</h3>
                    <p className="text-sm text-text-secondary mb-4">Tambahkan dokumentasi foto kegiatan sekolah sekarang.</p>
                    <button
                        onClick={handleOpenUpload}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} />
                        Upload Foto Pertama
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        // fallback to gradient if broken url
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            ) : null}

                            {/* Fallback gradient if image not loaded or empty */}
                            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${colorGradients[index % colorGradients.length]} flex items-center justify-center text-white/30`}>
                                <ImageIcon size={48} />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                                <div className="flex justify-between items-start">
                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                                        {item.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenEdit(item)}
                                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-colors"
                                            title="Edit Foto"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeletingItem(item)}
                                            className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                                            title="Hapus Foto"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-base leading-tight drop-shadow-sm">{item.title}</p>
                                    {item.description && (
                                        <p className="text-white/80 text-xs mt-1 line-clamp-1">{item.description}</p>
                                    )}
                                    <p className="text-white/60 text-xs mt-1">
                                        {item.date ? new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : new Date(item.createdAt).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 divide-y divide-border-color dark:divide-gray-700">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${colorGradients[index % colorGradients.length]} flex items-center justify-center text-white/50`}>
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-text-main dark:text-white">{item.title}</p>
                                    <p className="text-sm text-text-secondary flex items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                                            <Tag size={12} /> {item.category}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {item.date ? new Date(item.date).toLocaleDateString('id-ID') : new Date(item.createdAt).toLocaleDateString('id-ID')}
                                        </span>
                                    </p>
                                    {item.description && (
                                        <p className="text-xs text-text-secondary mt-1 max-w-xl">{item.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleOpenEdit(item)}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edit Foto"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => setDeletingItem(item)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Hapus Foto"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">{items.length}</p>
                    <p className="text-sm text-text-secondary">Total Foto</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">{totalCategories}</p>
                    <p className="text-sm text-text-secondary">Kategori Aktif</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">
                        {items.filter(i => i.category === 'Kegiatan').length}
                    </p>
                    <p className="text-sm text-text-secondary">Kegiatan</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">
                        {new Date().getFullYear()}
                    </p>
                    <p className="text-sm text-text-secondary">Tahun Ajaran</p>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingItem ? 'Edit Foto Galeri' : 'Upload Foto Galeri'}
                            </h3>
                            <button
                                onClick={() => setIsUploadOpen(false)}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Judul Foto *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Contoh: Upacara Peringatan Hari Guru"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="Kegiatan">Kegiatan</option>
                                        <option value="Acara">Acara</option>
                                        <option value="Prestasi">Prestasi</option>
                                        <option value="Fasilitas">Fasilitas</option>
                                        <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    URL Gambar *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="https://..."
                                />
                                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                                    <span className="text-xs text-text-secondary">Pilihan cepat:</span>
                                    {sampleImages.map((s) => (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: s.url })}
                                            className="text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-text-main dark:text-gray-200"
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.imageUrl && (
                                <div className="h-32 rounded-lg overflow-hidden border border-border-color dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    placeholder="Keterangan singkat..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadOpen(false)}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 text-text-secondary hover:text-text-main rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <LoadingSpinner size="sm" />}
                                    {editingItem ? 'Simpan Perubahan' : 'Upload Foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Delete */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus Foto Galeri"
                message={`Apakah Anda yakin ingin menghapus foto "${deletingItem?.title}" dari galeri? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
