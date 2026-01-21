import { useState } from 'react'
import { Calendar, BookOpen, Users, Plus, Pencil, Trash2, CheckCircle, MoreVertical } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import AcademicYearFormModal, { type AcademicYearFormData } from '@/components/modals/AcademicYearFormModal'
import { useAcademicYears, useAcademicYearMutations, type AcademicYear } from '@/hooks/useAcademicYears'

export default function AcademicYears() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
    const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const { years, loading, error, refetch } = useAcademicYears()
    const { createYear, updateYear, deleteYear, setActiveYear, loading: mutating, error: mutateError } = useAcademicYearMutations()

    const handleCreate = async (data: AcademicYearFormData) => {
        const result = await createYear(data)
        if (result) {
            setIsFormOpen(false)
            refetch()
        }
    }

    const handleUpdate = async (data: AcademicYearFormData) => {
        if (!editingYear) return
        const result = await updateYear(editingYear.id, data)
        if (result) {
            setEditingYear(null)
            refetch()
        }
    }

    const handleDelete = async () => {
        if (!deletingYear) return
        const success = await deleteYear(deletingYear.id)
        if (success) {
            setDeletingYear(null)
            refetch()
        }
    }

    const handleSetActive = async (year: AcademicYear) => {
        const success = await setActiveYear(year.id)
        if (success) {
            refetch()
        }
        setActiveDropdown(null)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data tahun ajaran..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tahun Ajaran"
                subtitle="Kelola tahun ajaran dan semester"
                breadcrumb={[
                    { label: 'Akademik', path: '/academic' },
                    { label: 'Tahun Ajaran' },
                ]}
                actions={
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tambah Tahun Ajaran
                    </button>
                }
            />

            {years.length === 0 ? (
                <EmptyState
                    title="Belum ada tahun ajaran"
                    description="Tambahkan tahun ajaran untuk memulai mengelola kelas dan siswa"
                    action={{
                        label: 'Tambah Tahun Ajaran',
                        onClick: () => setIsFormOpen(true)
                    }}
                />
            ) : (
                <div className="space-y-4">
                    {years.map((year) => (
                        <div
                            key={year.id}
                            className={`bg-white dark:bg-gray-800 rounded-xl border ${year.isActive
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border-color dark:border-gray-700'
                                } p-6 relative group`}
                        >
                            {/* Dropdown Menu */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === year.id ? null : year.id)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <MoreVertical size={18} className="text-text-secondary" />
                                </button>
                                {activeDropdown === year.id && (
                                    <div className="absolute right-0 top-10 w-44 bg-white dark:bg-gray-800 border border-border-color dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                setEditingYear(year)
                                                setActiveDropdown(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        {!year.isActive && (
                                            <button
                                                onClick={() => handleSetActive(year)}
                                                className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"
                                            >
                                                <CheckCircle size={14} /> Aktifkan
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setDeletingYear(year)
                                                setActiveDropdown(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${year.isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-slate-100 dark:bg-gray-700 text-text-secondary'
                                        }`}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                                Tahun Ajaran {year.name}
                                            </h3>
                                            <StatusBadge
                                                status={year.isActive ? 'active' : 'inactive'}
                                                label={year.isActive ? 'Aktif' : 'Selesai'}
                                            />
                                        </div>
                                        <p className="text-sm text-text-secondary">
                                            {formatDate(year.startDate)} - {formatDate(year.endDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Users size={18} />
                                        <span className="text-sm">{year.studentCount || 0} Siswa</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <BookOpen size={18} />
                                        <span className="text-sm">{year._count?.classes || 0} Kelas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AcademicYearFormModal
                isOpen={isFormOpen || !!editingYear}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingYear(null)
                }}
                onSubmit={editingYear ? handleUpdate : handleCreate}
                yearData={editingYear}
                isLoading={mutating}
            />

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingYear}
                onClose={() => setDeletingYear(null)}
                onConfirm={handleDelete}
                title="Hapus Tahun Ajaran"
                message={`Apakah Anda yakin ingin menghapus tahun ajaran ${deletingYear?.name}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
                isLoading={mutating}
            />

            {/* Error notification */}
            {mutateError && (
                <div className="fixed bottom-4 right-4 bg-rose-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
                    {mutateError}
                </div>
            )}
        </div>
    )
}
