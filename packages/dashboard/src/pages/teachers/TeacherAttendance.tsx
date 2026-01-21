import { useState } from 'react'
import { FileText, Clock, Check, X, MoreVertical, CheckCircle, XCircle, Trash2, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import TeacherPermitFormModal from '@/components/modals/TeacherPermitFormModal'
import { useTeacherPermits, useTeacherPermitStats, useTeacherPermitMutations, type TeacherPermit, type TeacherPermitFormData } from '@/hooks/useTeacherPermits'
import { useToast } from '@/contexts/ToastContext'

const TYPE_LABELS: Record<string, string> = {
    SICK: 'Sakit',
    FAMILY: 'Keluarga',
    OFFICIAL: 'Dinas/Resmi',
    OTHER: 'Lainnya'
}

const TYPE_COLORS: Record<string, string> = {
    SICK: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    FAMILY: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    OFFICIAL: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    OTHER: 'bg-slate-50 text-slate-700 dark:bg-gray-700 dark:text-gray-300'
}

export default function TeacherAttendance() {
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [deletingPermit, setDeletingPermit] = useState<TeacherPermit | null>(null)
    const [approvingPermit, setApprovingPermit] = useState<{ permit: TeacherPermit, action: 'APPROVED' | 'REJECTED' } | null>(null)

    const { permits, loading, error, refetch } = useTeacherPermits({
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined
    })

    const { stats } = useTeacherPermitStats()
    const { createPermit, updatePermitStatus, deletePermit, exportPermits, loading: mutating } = useTeacherPermitMutations()
    const toast = useToast()

    const handleCreate = async (data: TeacherPermitFormData) => {
        const result = await createPermit(data)
        if (result) {
            setIsFormOpen(false)
            refetch()
            toast.success('Izin berhasil diajukan', 'Menunggu persetujuan')
        } else {
            toast.error('Gagal mengajukan izin', 'Silakan coba lagi')
        }
    }

    const handleApprove = async () => {
        if (!approvingPermit) return
        const success = await updatePermitStatus(approvingPermit.permit.id, approvingPermit.action)
        if (success) {
            setApprovingPermit(null)
            refetch()
            toast.success(
                approvingPermit.action === 'APPROVED' ? 'Izin disetujui' : 'Izin ditolak',
                `Perizinan ${approvingPermit.permit.teacherName} telah ${approvingPermit.action === 'APPROVED' ? 'disetujui' : 'ditolak'}`
            )
        } else {
            toast.error('Gagal mengubah status', 'Silakan coba lagi')
        }
    }

    const handleDelete = async () => {
        if (!deletingPermit) return
        const success = await deletePermit(deletingPermit.id)
        if (success) {
            setDeletingPermit(null)
            refetch()
            toast.success('Perizinan berhasil dihapus')
        } else {
            toast.error('Gagal menghapus', 'Silakan coba lagi')
        }
    }

    const handleExport = async () => {
        const success = await exportPermits({ type: typeFilter, status: statusFilter })
        if (success) {
            toast.success('Export berhasil', 'File CSV telah diunduh')
        } else {
            toast.error('Export gagal', 'Silakan coba lagi')
        }
    }

    const statsItems = [
        { label: 'Total Izin', value: stats.total.toString(), icon: FileText, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Disetujui', value: stats.approved.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Menunggu', value: stats.pending.toString(), icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Ditolak', value: stats.rejected.toString(), icon: X, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    const columns: Column<TeacherPermit>[] = [
        {
            key: 'teacherName',
            header: 'Guru/Staff',
            render: (p) => (
                <div>
                    <span className="font-medium text-text-main dark:text-white">{p.teacherName}</span>
                    <p className="text-xs text-text-secondary">{p.teacherNip ? `NIP: ${p.teacherNip}` : 'NIP: -'}</p>
                </div>
            )
        },
        { key: 'position', header: 'Jabatan' },
        {
            key: 'type',
            header: 'Jenis',
            render: (p) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[p.type]}`}>
                    {TYPE_LABELS[p.type]}
                </span>
            ),
        },
        {
            key: 'startDate',
            header: 'Mulai',
            render: (p) => new Date(p.startDate).toLocaleDateString('id-ID')
        },
        {
            key: 'endDate',
            header: 'Selesai',
            render: (p) => new Date(p.endDate).toLocaleDateString('id-ID')
        },
        {
            key: 'reason',
            header: 'Alasan',
            render: (p) => (
                <span className="max-w-xs truncate block" title={p.reason}>{p.reason}</span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (p) => (
                <StatusBadge
                    status={p.status === 'APPROVED' ? 'success' : p.status === 'PENDING' ? 'pending' : 'error'}
                    label={p.status === 'APPROVED' ? 'Disetujui' : p.status === 'PENDING' ? 'Menunggu' : 'Ditolak'}
                />
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (p) => (
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === p.id ? null : p.id)
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <MoreVertical size={16} className="text-text-secondary" />
                    </button>
                    {activeDropdown === p.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-color dark:border-gray-700 py-1 z-10">
                            {p.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setApprovingPermit({ permit: p, action: 'APPROVED' })
                                            setActiveDropdown(null)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-emerald-600"
                                    >
                                        <CheckCircle size={14} /> Setujui
                                    </button>
                                    <button
                                        onClick={() => {
                                            setApprovingPermit({ permit: p, action: 'REJECTED' })
                                            setActiveDropdown(null)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-rose-600"
                                    >
                                        <XCircle size={14} /> Tolak
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    setDeletingPermit(p)
                                    setActiveDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-rose-500"
                            >
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ]

    if (loading) return <LoadingSpinner fullPage text="Memuat data perizinan..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kehadiran & Perizinan Guru"
                subtitle="Kelola cuti, izin sakit, dan dinas guru/staff"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: 'Kehadiran & Izin' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Download size={18} />
                            Export
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            + Ajukan Izin
                        </button>
                    </div>
                }
            />

            <StatsSummary items={statsItems} />

            <FilterBar
                searchPlaceholder="Cari nama guru..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Jenis',
                        value: typeFilter,
                        onChange: setTypeFilter,
                        options: [
                            { label: 'Sakit', value: 'SICK' },
                            { label: 'Keluarga', value: 'FAMILY' },
                            { label: 'Dinas', value: 'OFFICIAL' },
                            { label: 'Lainnya', value: 'OTHER' },
                        ],
                    },
                    {
                        label: 'Semua Status',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: 'Disetujui', value: 'APPROVED' },
                            { label: 'Menunggu', value: 'PENDING' },
                            { label: 'Ditolak', value: 'REJECTED' },
                        ],
                    },
                ]}
            />

            <DataTable
                columns={columns}
                data={permits}
                onView={() => { }}
                currentPage={1}
                totalPages={1}
                totalItems={permits.length}
            />

            {/* Form Modal */}
            <TeacherPermitFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreate}
                isLoading={mutating}
            />

            {/* Approval Confirmation */}
            <ConfirmationModal
                isOpen={!!approvingPermit}
                onClose={() => setApprovingPermit(null)}
                onConfirm={handleApprove}
                title={approvingPermit?.action === 'APPROVED' ? 'Setujui Perizinan' : 'Tolak Perizinan'}
                message={`Apakah Anda yakin ingin ${approvingPermit?.action === 'APPROVED' ? 'menyetujui' : 'menolak'} perizinan untuk ${approvingPermit?.permit.teacherName}?`}
                confirmLabel={approvingPermit?.action === 'APPROVED' ? 'Setujui' : 'Tolak'}
                variant={approvingPermit?.action === 'APPROVED' ? 'info' : 'danger'}
            />

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingPermit}
                onClose={() => setDeletingPermit(null)}
                onConfirm={handleDelete}
                title="Hapus Perizinan"
                message={`Apakah Anda yakin ingin menghapus perizinan ${deletingPermit?.teacherName}?`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </div>
    )
}
