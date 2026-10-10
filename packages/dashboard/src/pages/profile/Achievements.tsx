import { Trophy, Medal, Star, Calendar, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useAchievements, type Achievement, type AchievementFormData } from '@/hooks/useProfile'

const levelColors: Record<string, string> = {
    INTERNASIONAL: 'bg-purple-600',
    NASIONAL: 'bg-rose-600',
    PROVINSI: 'bg-blue-600',
    KOTA: 'bg-emerald-600',
    SEKOLAH: 'bg-slate-600',
    Internasional: 'bg-purple-600',
    Nasional: 'bg-rose-600',
    Provinsi: 'bg-blue-600',
    Kota: 'bg-emerald-600',
}

const currentYear = new Date().getFullYear()

export default function Achievements() {
    const [search, setSearch] = useState('')
    const [filterLevel, setFilterLevel] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterYear, setFilterYear] = useState<number | undefined>(undefined)

    const { achievements, loading, createAchievement, updateAchievement, deleteAchievement } = useAchievements({
        category: filterCategory || undefined,
        level: filterLevel || undefined,
        year: filterYear,
    })

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Achievement | null>(null)
    const [deletingItem, setDeletingItem] = useState<Achievement | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState<AchievementFormData>({
        title: '',
        category: 'Akademik',
        level: 'NASIONAL',
        year: currentYear,
        description: ''
    })

    const handleOpenCreate = () => {
        setEditingItem(null)
        setFormData({
            title: '',
            category: 'Akademik',
            level: 'NASIONAL',
            year: currentYear,
            description: ''
        })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (achievement: Achievement) => {
        setEditingItem(achievement)
        setFormData({
            title: achievement.title,
            category: achievement.category,
            level: achievement.level,
            year: achievement.year,
            description: achievement.description || ''
        })
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title) return

        setSubmitting(true)
        let ok = false
        if (editingItem) {
            ok = await updateAchievement(editingItem.id, {
                ...formData,
                year: Number(formData.year)
            })
        } else {
            ok = await createAchievement({
                ...formData,
                year: Number(formData.year)
            })
        }
        setSubmitting(false)
        if (ok) {
            setIsCreateOpen(false)
            setEditingItem(null)
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        await deleteAchievement(deletingItem.id)
        setDeletingItem(null)
    }

    // Client-side search filtering
    const filteredAchievements = achievements.filter((item) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.student?.name && item.student.name.toLowerCase().includes(q))
        )
    })

    // Dynamic stats
    const totalCount = achievements.length
    const internationalCount = achievements.filter(a => a.level === 'INTERNASIONAL').length
    const nationalCount = achievements.filter(a => a.level === 'NASIONAL').length
    const provincialCount = achievements.filter(a => a.level === 'PROVINSI').length
    const cityCount = achievements.filter(a => a.level === 'KOTA').length

    return (
        <div className="space-y-6">
            <PageHeader
                title="Prestasi Sekolah"
                subtitle="Pencapaian dan penghargaan siswa dan sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Prestasi' },
                ]}
                actions={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Prestasi
                    </button>
                }
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white text-center shadow-sm">
                    <Star size={28} className="mx-auto mb-2 text-purple-200" />
                    <p className="text-3xl font-bold">{internationalCount}</p>
                    <p className="text-purple-100 text-xs font-medium uppercase tracking-wider mt-1">Internasional</p>
                </div>
                <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-xl p-5 text-white text-center shadow-sm">
                    <Trophy size={28} className="mx-auto mb-2 text-rose-200" />
                    <p className="text-3xl font-bold">{nationalCount}</p>
                    <p className="text-rose-100 text-xs font-medium uppercase tracking-wider mt-1">Nasional</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-5 text-white text-center shadow-sm">
                    <Medal size={28} className="mx-auto mb-2 text-blue-200" />
                    <p className="text-3xl font-bold">{provincialCount}</p>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mt-1">Provinsi</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5 text-white text-center shadow-sm">
                    <Medal size={28} className="mx-auto mb-2 text-emerald-200" />
                    <p className="text-3xl font-bold">{cityCount}</p>
                    <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mt-1">Kota / Kab</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white text-center shadow-sm col-span-2 sm:col-span-1">
                    <Trophy size={28} className="mx-auto mb-2 text-amber-200" />
                    <p className="text-3xl font-bold">{totalCount}</p>
                    <p className="text-amber-100 text-xs font-medium uppercase tracking-wider mt-1">Total Prestasi</p>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Cari nama prestasi atau siswa..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Tingkat',
                        value: filterLevel,
                        onChange: setFilterLevel,
                        options: [
                            { label: 'Semua Tingkat', value: '' },
                            { label: 'Internasional', value: 'INTERNASIONAL' },
                            { label: 'Nasional', value: 'NASIONAL' },
                            { label: 'Provinsi', value: 'PROVINSI' },
                            { label: 'Kota', value: 'KOTA' },
                            { label: 'Sekolah', value: 'SEKOLAH' },
                        ],
                    },
                    {
                        label: 'Kategori',
                        value: filterCategory,
                        onChange: setFilterCategory,
                        options: [
                            { label: 'Semua Kategori', value: '' },
                            { label: 'Akademik', value: 'Akademik' },
                            { label: 'Olahraga', value: 'Olahraga' },
                            { label: 'Seni', value: 'Seni' },
                            { label: 'Ekstrakurikuler', value: 'Ekstrakurikuler' },
                        ],
                    },
                    {
                        label: 'Tahun',
                        value: filterYear ? String(filterYear) : '',
                        onChange: (val) => setFilterYear(val ? Number(val) : undefined),
                        options: [
                            { label: 'Semua Tahun', value: '' },
                            { label: String(currentYear), value: String(currentYear) },
                            { label: String(currentYear - 1), value: String(currentYear - 1) },
                            { label: String(currentYear - 2), value: String(currentYear - 2) },
                            { label: String(currentYear - 3), value: String(currentYear - 3) },
                        ],
                    },
                ]}
            />

            {/* Achievements Content */}
            {loading ? (
                <div className="py-20 flex justify-center">
                    <LoadingSpinner />
                </div>
            ) : filteredAchievements.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                    <Trophy className="mx-auto text-gray-400 mb-3" size={48} />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-1">Tidak Ada Data Prestasi</h3>
                    <p className="text-sm text-text-secondary mb-4">Belum ada catatan prestasi yang sesuai dengan kriteria.</p>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        <Plus size={16} />
                        Tambah Prestasi Baru
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAchievements.map((achievement) => {
                        const levelBadge = levelColors[achievement.level] || 'bg-slate-600'
                        const recipient = achievement.student?.name || achievement.teacher?.name || achievement.description || 'Siswa Berprestasi'

                        return (
                            <div
                                key={achievement.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow relative group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center flex-shrink-0">
                                        <Trophy size={24} />
                                    </div>
                                    <div className="flex-1 pr-6">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-text-main dark:text-white leading-snug">
                                                {achievement.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 ${levelBadge} text-white rounded text-xs font-semibold uppercase flex-shrink-0`}>
                                                {achievement.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-3 font-medium">
                                            {recipient}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-gray-700 rounded-md font-medium text-text-main dark:text-gray-300">
                                                {achievement.category}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium">
                                                <Calendar size={13} /> {achievement.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEdit(achievement)}
                                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Edit Prestasi"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingItem(achievement)}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                        title="Hapus Prestasi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingItem ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
                            </h3>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Nama / Judul Prestasi *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Contoh: Juara 1 OSN Matematika Tingkat Nasional"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Tingkat Kejuaraan *
                                    </label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="INTERNASIONAL">Internasional</option>
                                        <option value="NASIONAL">Nasional</option>
                                        <option value="PROVINSI">Provinsi</option>
                                        <option value="KOTA">Kota / Kabupaten</option>
                                        <option value="SEKOLAH">Sekolah</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="Akademik">Akademik</option>
                                        <option value="Olahraga">Olahraga</option>
                                        <option value="Seni">Seni</option>
                                        <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Tahun Perolehan *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={2000}
                                        max={2100}
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Nama Peraih / Tim
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Contoh: Ahmad Rizki (XII MIPA 1)"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
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
                                    {editingItem ? 'Simpan Perubahan' : 'Simpan Prestasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus Prestasi"
                message={`Apakah Anda yakin ingin menghapus catatan prestasi "${deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
