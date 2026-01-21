import { useState } from 'react'
import { Users, UserCheck, UserX, GraduationCap, Database } from 'lucide-react'
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
import ImportStudentModal from '@/components/modals/ImportStudentModal'
import ExportStudentModal from '@/components/modals/ExportStudentModal'
import DapodikSyncModal from '@/components/modals/DapodikSyncModal'
import { useStudents, useStudentMutations } from '@/hooks/useStudents'
import type { Student } from '@/types'

export default function StudentList() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

    // Modal states
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [isDapodikModalOpen, setIsDapodikModalOpen] = useState(false)

    const { students, loading, error, meta, refetch } = useStudents({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
    })

    const { deleteStudent, loading: isDeleting } = useStudentMutations()

    // ... stats calculation code ...
    const totalStudents = meta?.total || 0
    const activeStudents = students.filter(s => s.status === 'ACTIVE').length
    const inactiveStudents = students.filter(s => s.status === 'INACTIVE').length

    const stats = [
        { label: 'Total Siswa', value: totalStudents.toLocaleString(), icon: Users, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Siswa Aktif', value: activeStudents.toString(), icon: UserCheck, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Siswa Tidak Aktif', value: inactiveStudents.toString(), icon: UserX, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
        { label: 'Siswa Baru', value: '-', icon: GraduationCap, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
    ]

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student)
    }

    const handleConfirmDelete = async () => {
        if (!studentToDelete) return

        const success = await deleteStudent(studentToDelete.id)
        if (success) {
            refetch()
            setStudentToDelete(null)
        }
    }

    // Handlers for modals - now just refetch after successful operations
    const handleImport = () => {
        refetch()
    }

    const handleDapodikSync = () => {
        refetch()
    }

    const columns: Column<Student>[] = [
        {
            key: 'photo',
            header: '',
            className: 'w-12',
            render: (student) => (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {student.photo ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL}${student.photo}`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-semibold text-xs">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}
                </div>
            ),
        },
        { key: 'nis', header: 'NIS' },
        { key: 'name', header: 'Nama Lengkap', render: (s) => <span className="font-medium">{s.name}</span> },
        {
            key: 'class',
            header: 'Kelas',
            render: (s) => s.classEnrollments?.[0]?.class?.name || '-'
        },
        {
            key: 'gender',
            header: 'Jenis Kelamin',
            render: (s) => s.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'
        },
        {
            key: 'status',
            header: 'Status',
            render: (student) => (
                <StatusBadge
                    status={student.status === 'ACTIVE' ? 'active' : student.status === 'INACTIVE' ? 'inactive' : 'pending'}
                    label={student.status === 'ACTIVE' ? 'Aktif' : student.status === 'INACTIVE' ? 'Tidak Aktif' : student.status}
                />
            ),
        },
    ]

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Siswa"
                subtitle="Kelola data siswa sekolah"
                breadcrumb={[
                    { label: 'Manajemen Siswa', path: '/students' },
                    { label: 'Data Siswa' },
                ]}
                actions={
                    <button
                        onClick={() => setIsDapodikModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Database size={18} />
                        Sync Dapodik
                    </button>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama, NIS..."
                onSearch={handleSearch}
                filters={[
                    {
                        label: 'Semua Status',
                        options: [
                            { label: 'Aktif', value: 'ACTIVE' },
                            { label: 'Tidak Aktif', value: 'INACTIVE' },
                            { label: 'Lulus', value: 'GRADUATED' },
                        ],
                        value: statusFilter,
                        onChange: (value) => {
                            setStatusFilter(value)
                            setPage(1)
                        }
                    },
                ]}
                onAdd={() => navigate('/students/new')}
                addLabel="Tambah Siswa"
                onExport={() => setIsExportModalOpen(true)}
                onImport={() => setIsImportModalOpen(true)}
            />

            {loading ? (
                <LoadingSpinner fullPage text="Memuat data siswa..." />
            ) : error ? (
                <ErrorState message={error} onRetry={refetch} />
            ) : students.length === 0 ? (
                <EmptyState
                    title="Tidak Ada Siswa"
                    description="Belum ada data siswa yang tersedia."
                    action={{ label: 'Tambah Siswa', onClick: () => navigate('/students/new') }}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={students}
                    onView={(student) => navigate(`/students/${student.id}`)}
                    onEdit={(student) => navigate(`/students/${student.id}/edit`)}
                    onDelete={handleDeleteClick}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!studentToDelete}
                onClose={() => setStudentToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Hapus Siswa"
                message={`Apakah Anda yakin ingin menghapus siswa ${studentToDelete?.name}? Data akan dipindahkan ke sampah.`}
                confirmLabel="Hapus"
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Import Modal */}
            <ImportStudentModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />

            {/* Export Modal */}
            <ExportStudentModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                totalStudents={totalStudents}
            />

            {/* Dapodik Sync Modal */}
            <DapodikSyncModal
                isOpen={isDapodikModalOpen}
                onClose={() => setIsDapodikModalOpen(false)}
                onSync={handleDapodikSync}
            />
        </div>
    )
}

