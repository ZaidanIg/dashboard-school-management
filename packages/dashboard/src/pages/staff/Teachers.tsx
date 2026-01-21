import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Download } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useTeachers } from '@/hooks/useTeachers'
import type { Teacher } from '@/types/api'

export default function StaffTeachers() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [position, setPosition] = useState('')

    const params: Record<string, string | number> = { page, limit: 10 }
    if (search) params.search = search
    if (position) params.position = position

    const { teachers, loading, error, meta } = useTeachers(params)

    const positionLabels: Record<string, string> = {
        'PNS': 'PNS',
        'HONORER': 'Honorer',
        'P3K': 'P3K',
        'STAFF': 'Staff'
    }

    const columns: Column<Teacher>[] = [
        {
            key: 'nip',
            header: 'NIP',
            render: (t) => <span className="font-mono text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">{t.nip || '-'}</span>
        },
        {
            key: 'name',
            header: 'Nama',
            render: (t) => (
                <div className="flex items-center gap-3">
                    <div
                        className="size-8 rounded-full bg-cover bg-center bg-gray-200"
                        style={{
                            backgroundImage: t.photo
                                ? `url('${t.photo}')`
                                : `url('https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random')`
                        }}
                    />
                    <span className="font-medium">{t.name}</span>
                </div>
            )
        },
        {
            key: 'position',
            header: 'Jabatan',
            render: (t) => (
                <StatusBadge
                    status={t.position === 'PNS' ? 'success' : t.position === 'HONORER' ? 'warning' : 'info'}
                    label={positionLabels[t.position] || t.position}
                />
            )
        },
        { key: 'email', header: 'Email', render: (t) => t.email || '-' },
        { key: 'phone', header: 'Telepon', render: (t) => t.phone || '-' },
        {
            key: 'subjects',
            header: 'Mata Pelajaran',
            render: (t) => (
                <div className="flex flex-wrap gap-1">
                    {t.subjects?.slice(0, 2).map((s: any) => (
                        <span key={s.subject?.id || s.id} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">
                            {s.subject?.name || s.name}
                        </span>
                    ))}
                    {(t.subjects?.length || 0) > 2 && (
                        <span className="text-xs text-text-secondary">+{t.subjects!.length - 2}</span>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (t) => (
                <StatusBadge
                    status={t.status === 'ACTIVE' ? 'success' : 'warning'}
                    label={t.status === 'ACTIVE' ? 'Aktif' : t.status}
                />
            )
        }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Manajemen Guru"
                subtitle="Kelola data guru dan tenaga pendidik"
                breadcrumb={[{ label: 'Guru' }]}
                actions={
                    <Link
                        to="/teachers/new"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah Guru
                    </Link>
                }
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIP..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <select
                    value={position}
                    onChange={(e) => { setPosition(e.target.value); setPage(1) }}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Jabatan</option>
                    <option value="PNS">PNS</option>
                    <option value="HONORER">Honorer</option>
                    <option value="P3K">P3K</option>
                    <option value="STAFF">Staff</option>
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
                    data={teachers}
                    onView={(t) => window.open(`/teachers/${t.id}`, '_blank')}
                    onEdit={(t) => window.open(`/teachers/${t.id}/edit`, '_blank')}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
