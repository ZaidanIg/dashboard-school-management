import { useState } from 'react'
import { Music, Palette, Trophy, Dribbble, Users, Calendar, Plus, MoreVertical, Pencil, Trash2, MapPin, Award } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import ExtracurricularFormModal from '@/components/modals/ExtracurricularFormModal'
import { useExtracurriculars, useExtracurricularMutations, type Extracurricular, type ExtracurricularFormData } from '@/hooks/useExtracurriculars'
import { useToast } from '@/contexts/ToastContext'

const categoryColors: Record<string, string> = {
    'Wajib': 'bg-rose-500',
    'Olahraga': 'bg-blue-500',
    'Seni': 'bg-purple-500',
    'Akademik': 'bg-emerald-500',
    'Teknologi': 'bg-cyan-500',
    'Bahasa': 'bg-amber-500'
}

const categoryIcons: Record<string, React.ElementType> = {
    'Wajib': Award,
    'Olahraga': Dribbble,
    'Seni': Palette,
    'Akademik': Trophy,
    'Teknologi': Users,
    'Bahasa': Music
}

export default function Extracurricular() {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEkskul, setEditingEkskul] = useState<Extracurricular | null>(null)
    const [deletingEkskul, setDeletingEkskul] = useState<Extracurricular | null>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const { extracurriculars, loading, error, refetch } = useExtracurriculars({
        search: search || undefined,
        category: categoryFilter || undefined
    })

    const { createExtracurricular, updateExtracurricular, deleteExtracurricular, loading: mutating } = useExtracurricularMutations()
    const toast = useToast()

    const handleCreate = async (data: ExtracurricularFormData) => {
        const result = await createExtracurricular(data)
        if (result) {
            setIsFormOpen(false)
            refetch()
            toast.success('Ekstrakurikuler berhasil ditambahkan', `${result.name} telah dibuat`)
        } else {
            toast.error('Gagal menambahkan', 'Silakan coba lagi')
        }
    }

    const handleUpdate = async (data: ExtracurricularFormData) => {
        if (!editingEkskul) return
        const result = await updateExtracurricular(editingEkskul.id, data)
        if (result) {
            setEditingEkskul(null)
            refetch()
            toast.success('Ekstrakurikuler berhasil diperbarui', `${result.name} telah diupdate`)
        } else {
            toast.error('Gagal memperbarui', 'Silakan coba lagi')
        }
    }

    const handleDelete = async () => {
        if (!deletingEkskul) return
        const success = await deleteExtracurricular(deletingEkskul.id)
        if (success) {
            setDeletingEkskul(null)
            refetch()
            toast.success('Ekstrakurikuler berhasil dihapus')
        } else {
            toast.error('Gagal menghapus', 'Masih ada anggota aktif')
        }
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data ekstrakurikuler..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Ekstrakurikuler"
                subtitle="Kelola kegiatan ekstrakurikuler sekolah"
                breadcrumb={[
                    { label: 'Manajemen Siswa', path: '/students' },
                    { label: 'Ekstrakurikuler' },
                ]}
                actions={
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah Ekskul
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari ekstrakurikuler..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Kategori',
                        value: categoryFilter,
                        onChange: setCategoryFilter,
                        options: [
                            { label: 'Wajib', value: 'Wajib' },
                            { label: 'Olahraga', value: 'Olahraga' },
                            { label: 'Seni', value: 'Seni' },
                            { label: 'Akademik', value: 'Akademik' },
                            { label: 'Teknologi', value: 'Teknologi' },
                            { label: 'Bahasa', value: 'Bahasa' },
                        ],
                    },
                ]}
            />

            {extracurriculars.length === 0 ? (
                <EmptyState
                    title="Belum ada ekstrakurikuler"
                    description="Mulai dengan menambahkan kegiatan ekstrakurikuler baru"
                    action={{ label: 'Tambah Ekskul', onClick: () => setIsFormOpen(true) }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {extracurriculars.map((ekskul) => {
                        const IconComponent = categoryIcons[ekskul.category] || Users
                        return (
                            <div
                                key={ekskul.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow relative"
                            >
                                {/* Dropdown */}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === ekskul.id ? null : ekskul.id)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <MoreVertical size={18} className="text-text-secondary" />
                                    </button>
                                    {activeDropdown === ekskul.id && (
                                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-color dark:border-gray-700 py-1 z-10">
                                            <button
                                                onClick={() => {
                                                    setEditingEkskul(ekskul)
                                                    setActiveDropdown(null)
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                            >
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingEkskul(ekskul)
                                                    setActiveDropdown(null)
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-rose-500"
                                            >
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-lg ${categoryColors[ekskul.category] || 'bg-gray-500'} flex items-center justify-center text-white`}>
                                        <IconComponent size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-text-main dark:text-white">{ekskul.name}</h3>
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-700 rounded text-xs font-medium text-text-secondary">
                                            {ekskul.category}
                                        </span>
                                    </div>
                                </div>

                                {ekskul.advisor && (
                                    <p className="text-sm text-text-secondary mb-2">
                                        Pembina: {ekskul.advisor.name}
                                    </p>
                                )}

                                {ekskul.schedule && (
                                    <div className="flex items-center gap-1 text-sm text-text-secondary mb-2">
                                        <Calendar size={14} />
                                        {ekskul.schedule}
                                    </div>
                                )}

                                {ekskul.location && (
                                    <div className="flex items-center gap-1 text-sm text-text-secondary mb-2">
                                        <MapPin size={14} />
                                        {ekskul.location}
                                    </div>
                                )}

                                <div className="mt-3 pt-3 border-t border-border-color dark:border-gray-700 flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-sm text-text-secondary">
                                        <Users size={14} />
                                        {ekskul._count.members} anggota
                                        {ekskul.maxMembers && ` / ${ekskul.maxMembers}`}
                                    </span>
                                    {!ekskul.isActive && (
                                        <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-xs font-medium rounded">
                                            Nonaktif
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Form Modal */}
            <ExtracurricularFormModal
                isOpen={isFormOpen || !!editingEkskul}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingEkskul(null)
                }}
                onSubmit={editingEkskul ? handleUpdate : handleCreate}
                extracurricular={editingEkskul}
                isLoading={mutating}
            />

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingEkskul}
                onClose={() => setDeletingEkskul(null)}
                onConfirm={handleDelete}
                title="Hapus Ekstrakurikuler"
                message={`Apakah Anda yakin ingin menghapus "${deletingEkskul?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </div>
    )
}
