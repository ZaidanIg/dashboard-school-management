import { useState } from 'react'
import { Users, UserCheck, UserCog, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useTeachers, useTeacherMutations } from '@/hooks/useTeachers'
import { useToast } from '@/contexts/ToastContext'
import type { Teacher } from '@/types'

export default function TeacherList() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [positionFilter, setPositionFilter] = useState('')
    const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null)

    const { teachers, loading, error, meta, refetch } = useTeachers({
        page,
        limit: 20,
        search: search || undefined,
        position: positionFilter || undefined,
    })

    const { deleteTeacher, exportTeachers } = useTeacherMutations()
    const toast = useToast()

    const totalTeachers = meta?.total || 0
    const activeTeachers = teachers.filter(t => t.status === 'ACTIVE').length
    const certifiedTeachers = teachers.filter(t => t.isCertified).length

    const stats = [
        { label: 'Total Guru', value: totalTeachers.toString(), icon: Users, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Guru Aktif', value: activeTeachers.toString(), icon: UserCheck, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Staff', value: '-', icon: UserCog, iconBg: 'bg-purple-50 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
        { label: 'Bersertifikasi', value: certifiedTeachers.toString(), icon: Award, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
    ]

    const columns: Column<Teacher>[] = [
        {
            key: 'photo',
            header: '',
            className: 'w-12',
            render: (teacher) => (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
            ),
        },
        { key: 'nip', header: 'NIP', render: (t) => t.nip || '-' },
        { key: 'name', header: 'Nama Lengkap', render: (t) => <span className="font-medium">{t.name}</span> },
        {
            key: 'subjects',
            header: 'Mata Pelajaran',
            render: (t) => t.subjects?.map(s => s.subject.name).join(', ') || '-'
        },
        {
            key: 'position',
            header: 'Posisi',
            render: (t) => t.position === 'PNS' ? 'Guru PNS' : t.position === 'HONORER' ? 'Guru Honorer' : t.position
        },
        {
            key: 'status',
            header: 'Status',
            render: (teacher) => (
                <StatusBadge
                    status={teacher.status === 'ACTIVE' ? 'active' : 'inactive'}
                    label={teacher.status === 'ACTIVE' ? 'Aktif' : teacher.status}
                />
            ),
        },
    ]

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }



    const handleDelete = async () => {
        if (!deletingTeacher) return
        const success = await deleteTeacher(deletingTeacher.id)
        if (success) {
            setDeletingTeacher(null)
            refetch()
            toast.success('Guru berhasil dihapus')
        } else {
            toast.error('Gagal menghapus guru')
        }
    }

    const handleExport = async () => {
        const success = await exportTeachers({ search, position: positionFilter })
        if (success) {
            toast.success('Export berhasil', 'File CSV telah diunduh')
        } else {
            toast.error('Export gagal', 'Silakan coba lagi')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Guru & Staff"
                subtitle="Kelola data guru dan staff sekolah"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: 'Data Guru' },
                ]}
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama, NIP..."
                onSearch={handleSearch}
                filters={[
                    {
                        label: 'Posisi',
                        value: positionFilter,
                        onChange: (val) => {
                            setPositionFilter(val)
                            setPage(1)
                        },
                        options: [
                            { label: 'Semua Posisi', value: '' },
                            { label: 'PNS', value: 'PNS' },
                            { label: 'Honorer', value: 'HONORER' },
                            { label: 'P3K', value: 'P3K' },
                            { label: 'Staff', value: 'STAFF' },
                        ],
                    },
                ]}
                onAdd={() => navigate('/teachers/new')}
                addLabel="Tambah Guru"
                onExport={handleExport}
            />

            {loading ? (
                <LoadingSpinner fullPage text="Memuat data guru..." />
            ) : error ? (
                <ErrorState message={error} onRetry={refetch} />
            ) : teachers.length === 0 ? (
                <EmptyState
                    title="Tidak Ada Guru"
                    description="Belum ada data guru yang tersedia."
                    action={{ label: 'Tambah Guru', onClick: () => navigate('/teachers/new') }}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={teachers}
                    onView={(teacher) => navigate(`/teachers/${teacher.id}`)}
                    onEdit={(teacher) => navigate(`/teachers/${teacher.id}/edit`)}
                    onDelete={setDeletingTeacher}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingTeacher}
                onClose={() => setDeletingTeacher(null)}
                onConfirm={handleDelete}
                title="Hapus Guru"
                message={`Apakah Anda yakin ingin menghapus data guru "${deletingTeacher?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </div>
    )
}
