import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Edit, Trash2, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useStudents } from '@/hooks/useStudents'
import type { Student } from '@/types/api'

export default function StaffStudents() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState('')

    const params: Record<string, string | number> = { page, limit: 10 }
    if (search) params.search = search
    if (status) params.status = status

    const { students, loading, error, meta } = useStudents(params)

    const columns: Column<Student>[] = [
        {
            key: 'nis',
            header: 'NIS',
            render: (s) => <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">{s.nis}</span>
        },
        {
            key: 'name',
            header: 'Nama',
            render: (s) => (
                <div className="flex items-center gap-3">
                    <div
                        className="size-8 rounded-full bg-cover bg-center bg-gray-200"
                        style={{
                            backgroundImage: s.photo
                                ? `url('${s.photo}')`
                                : `url('https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random')`
                        }}
                    />
                    <span className="font-medium">{s.name}</span>
                </div>
            )
        },
        { key: 'gender', header: 'L/P', render: (s) => s.gender === 'MALE' ? 'L' : 'P' },
        { key: 'email', header: 'Email', render: (s) => s.email || '-' },
        { key: 'phone', header: 'Telepon', render: (s) => s.phone || '-' },
        {
            key: 'status',
            header: 'Status',
            render: (s) => (
                <StatusBadge
                    status={s.status === 'ACTIVE' ? 'success' : s.status === 'GRADUATED' ? 'info' : 'warning'}
                    label={s.status === 'ACTIVE' ? 'Aktif' : s.status === 'GRADUATED' ? 'Lulus' : s.status}
                />
            )
        }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Manajemen Siswa"
                subtitle="Kelola data siswa sekolah"
                breadcrumb={[{ label: 'Siswa' }]}
                actions={
                    <Link
                        to="/students/new"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah Siswa
                    </Link>
                }
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIS..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Status</option>
                    <option value="ACTIVE">Aktif</option>
                    <option value="GRADUATED">Lulus</option>
                    <option value="INACTIVE">Tidak Aktif</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                    <Download size={18} />
                    Export
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={students}
                    onView={(s) => window.open(`/students/${s.id}`, '_blank')}
                    onEdit={(s) => window.open(`/students/${s.id}/edit`, '_blank')}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
