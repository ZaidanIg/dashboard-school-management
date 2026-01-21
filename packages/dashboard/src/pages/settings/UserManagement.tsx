import { useState } from 'react'
import { Users, Shield, Check, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useUsers } from '@/hooks/useSettings'
import type { User } from '@/types'

const stats = [
    { label: 'Total User', value: '156', icon: Users, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
    { label: 'User Aktif', value: '148', icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
    { label: 'User Nonaktif', value: '8', icon: X, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    { label: 'Role', value: '6', icon: Shield, iconBg: 'bg-purple-50 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
]

const roleColors: Record<string, string> = {
    'Super Admin': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Kepala Sekolah': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Guru': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Staff': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export default function UserManagement() {
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState({
        role: '',
        status: '',
        search: ''
    })

    const { users, loading, error, meta, refetch } = useUsers({
        page,
        limit: 10,
        ...filters
    })

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'User',
            render: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-semibold">
                        {u.name ? u.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
                    </div>
                    <div>
                        <p className="font-medium text-text-main dark:text-white">{u.name}</p>
                        <p className="text-xs text-text-secondary">{u.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            render: (u) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[u.role] || 'bg-slate-100 text-slate-700'}`}>
                    {u.role}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (u) => (
                <StatusBadge
                    status={u.status === 'ACTIVE' ? 'active' : 'inactive'}
                    label={u.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                />
            ),
        },
        {
            key: 'lastLogin' as keyof User,
            header: 'Login Terakhir',
            render: (u) => (u as any).lastLogin ? new Date((u as any).lastLogin).toLocaleString('id-ID') : '-'
        },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Management"
                subtitle="Kelola akun pengguna sistem"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'User Management' },
                ]}
                actions={
                    <button
                        onClick={() => refetch()}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Refresh
                    </button>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama atau email..."
                onSearch={(val) => handleFilterChange('search', val)}
                filters={[
                    {
                        label: 'Semua Role',
                        options: [
                            { label: 'Super Admin', value: 'Super Admin' },
                            { label: 'Kepala Sekolah', value: 'Kepala Sekolah' },
                            { label: 'Guru', value: 'Guru' },
                            { label: 'Staff', value: 'Staff' },
                        ],
                        onChange: (val) => handleFilterChange('role', val)
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Aktif', value: 'ACTIVE' },
                            { label: 'Nonaktif', value: 'INACTIVE' },
                        ],
                        onChange: (val) => handleFilterChange('status', val)
                    },
                ]}
                onAdd={() => { }}
                addLabel="Tambah User"
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={users}
                    onView={() => { }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
