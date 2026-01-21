import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, Plus, Pencil, Trash2, MoreVertical } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import ClassFormModal, { type ClassFormData } from '@/components/modals/ClassFormModal'
import { useClasses, useClassMutations, type Class } from '@/hooks/useClasses'
import { useToast } from '@/contexts/ToastContext'

export default function ClassList() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [majorFilter, setMajorFilter] = useState('')
    const [gradeFilter, setGradeFilter] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingClass, setEditingClass] = useState<Class | null>(null)
    const [deletingClass, setDeletingClass] = useState<Class | null>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const { classes, loading, error, refetch } = useClasses({
        search: search || undefined,
        major: majorFilter || undefined,
        grade: gradeFilter ? parseInt(gradeFilter) : undefined
    })

    const { createClass, updateClass, deleteClass, loading: mutating } = useClassMutations()
    const toast = useToast()

    const handleCreate = async (data: ClassFormData) => {
        const result = await createClass(data)
        if (result) {
            setIsFormOpen(false)
            refetch()
            toast.success('Kelas berhasil ditambahkan', `Kelas ${result.name} telah dibuat`)
        } else {
            toast.error('Gagal menambahkan kelas', 'Silakan coba lagi')
        }
    }

    const handleUpdate = async (data: ClassFormData) => {
        if (!editingClass) return
        const result = await updateClass(editingClass.id, data)
        if (result) {
            setEditingClass(null)
            refetch()
            toast.success('Kelas berhasil diperbarui', `Kelas ${result.name} telah diupdate`)
        } else {
            toast.error('Gagal memperbarui kelas', 'Silakan coba lagi')
        }
    }

    const handleDelete = async () => {
        if (!deletingClass) return
        const success = await deleteClass(deletingClass.id)
        if (success) {
            const deletedName = deletingClass.name
            setDeletingClass(null)
            refetch()
            toast.success('Kelas berhasil dihapus', `Kelas ${deletedName} telah dihapus`)
        } else {
            toast.error('Gagal menghapus kelas', 'Kelas mungkin masih memiliki siswa aktif')
        }
    }

    const openEdit = (cls: Class) => {
        setEditingClass(cls)
        setActiveDropdown(null)
    }

    const openDelete = (cls: Class) => {
        setDeletingClass(cls)
        setActiveDropdown(null)
    }

    // Stats
    const totalStudents = classes.reduce((acc, cls) => acc + (cls._count?.enrollments || 0), 0)
    const gradeStats = {
        10: classes.filter(c => c.grade === 10).length,
        11: classes.filter(c => c.grade === 11).length,
        12: classes.filter(c => c.grade === 12).length
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data kelas..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kelas & Jurusan"
                subtitle="Kelola kelas dan jurusan siswa"
                breadcrumb={[
                    { label: 'Manajemen Siswa', path: '/students' },
                    { label: 'Kelas & Jurusan' },
                ]}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                    <p className="text-2xl font-bold text-primary">{classes.length}</p>
                    <p className="text-sm text-text-secondary">Total Kelas</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                    <p className="text-2xl font-bold text-emerald-600">{totalStudents}</p>
                    <p className="text-sm text-text-secondary">Total Siswa</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                    <p className="text-2xl font-bold text-amber-600">{gradeStats[10]}</p>
                    <p className="text-sm text-text-secondary">Kelas 10</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                    <p className="text-2xl font-bold text-purple-600">{gradeStats[11] + gradeStats[12]}</p>
                    <p className="text-sm text-text-secondary">Kelas 11 & 12</p>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Cari kelas..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Jurusan',
                        value: majorFilter,
                        onChange: setMajorFilter,
                        options: [
                            { label: 'IPA', value: 'IPA' },
                            { label: 'IPS', value: 'IPS' },
                            { label: 'Bahasa', value: 'BAHASA' },
                        ],
                    },
                    {
                        label: 'Semua Tingkat',
                        value: gradeFilter,
                        onChange: setGradeFilter,
                        options: [
                            { label: 'Kelas 10', value: '10' },
                            { label: 'Kelas 11', value: '11' },
                            { label: 'Kelas 12', value: '12' },
                        ],
                    },
                ]}
                onAdd={() => setIsFormOpen(true)}
                addLabel="Tambah Kelas"
            />

            {/* Class Cards Grid */}
            {classes.length === 0 ? (
                <EmptyState
                    title="Belum ada kelas"
                    description="Tambahkan kelas baru untuk memulai"
                    action={{
                        label: 'Tambah Kelas',
                        onClick: () => setIsFormOpen(true)
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => navigate('/students/classes/' + cls.id)}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow group relative cursor-pointer"
                        >
                            {/* Dropdown Menu */}
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveDropdown(activeDropdown === cls.id ? null : cls.id)
                                    }}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical size={16} className="text-text-secondary" />
                                </button>
                                {activeDropdown === cls.id && (
                                    <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 border border-border-color dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                openEdit(cls)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                openDelete(cls)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <BookOpen size={24} />
                                </div>
                                {cls.major && (
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-gray-700 rounded text-xs font-medium text-text-secondary">
                                        {cls.major}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                Kelas {cls.name}
                            </h3>
                            <p className="text-sm text-text-secondary mb-3">
                                Wali Kelas: {cls.homeroomTeacher?.name || '-'}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Users size={16} />
                                    <span>{cls._count?.enrollments || 0} / {cls.capacity} Siswa</span>
                                </div>
                                <span className="text-xs text-text-secondary">
                                    Kelas {cls.grade}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <div
                        onClick={() => setIsFormOpen(true)}
                        className="bg-slate-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-border-color dark:border-gray-700 p-5 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors min-h-[160px]"
                    >
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-text-secondary mb-2">
                            <Plus size={24} />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">Tambah Kelas Baru</span>
                    </div>
                </div>
            )
            }

            {/* Create/Edit Modal */}
            <ClassFormModal
                isOpen={isFormOpen || !!editingClass}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingClass(null)
                }}
                onSubmit={editingClass ? handleUpdate : handleCreate}
                classData={editingClass}
                isLoading={mutating}
            />

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingClass}
                onClose={() => setDeletingClass(null)}
                onConfirm={handleDelete}
                title="Hapus Kelas"
                message={`Apakah Anda yakin ingin menghapus kelas ${deletingClass?.name}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
                isLoading={mutating}
            />
        </div >
    )
}
