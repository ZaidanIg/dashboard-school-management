import { useState } from 'react'
import { Users, Shield, Check, X, Plus, Mail, User as UserIcon, Lock } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useUsers, useUserMutations } from '@/hooks/useSettings'
import { useToast } from '@/contexts/ToastContext'
import type { User } from '@/types'

const roleColors: Record<string, string> = {
    'SUPER_ADMIN': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'PRINCIPAL': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'TEACHER': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'STAFF': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'PARENT': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'STUDENT': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const roleLabels: Record<string, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'PRINCIPAL': 'Kepala Sekolah',
    'TEACHER': 'Guru',
    'STAFF': 'Staff TU',
    'PARENT': 'Orang Tua',
    'STUDENT': 'Siswa',
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

    const { createUser, updateUser, deleteUser, loading: isMutating } = useUserMutations()
    const { addToast } = useToast()

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deletingUser, setDeletingUser] = useState<User | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
        status: 'ACTIVE'
    })

    const activeCount = users.filter(u => u.status === 'ACTIVE').length
    const inactiveCount = users.filter(u => u.status === 'INACTIVE').length

    const stats = [
        { label: 'Total User', value: (meta?.total || users.length).toString(), icon: Users, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'User Aktif', value: activeCount.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'User Nonaktif', value: inactiveCount.toString(), icon: X, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
        { label: 'Tipe Role', value: '6 Role', icon: Shield, iconBg: 'bg-purple-50 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
    ]

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.password) {
            addToast('error', 'Semua bidang wajib diisi!')
            return
        }

        const res = await createUser(formData)
        if (res) {
            addToast('success', 'User berhasil ditambahkan')
            setIsCreateOpen(false)
            setFormData({ name: '', email: '', password: '', role: 'STAFF', status: 'ACTIVE' })
            refetch()
        } else {
            addToast('error', 'Gagal menambahkan user. Pastikan email belum terdaftar.')
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        const res = await updateUser(editingUser.id, {
            name: formData.name,
            role: formData.role as any,
            status: formData.status as any
        })
        if (res) {
            addToast('success', 'User berhasil diperbarui')
            setEditingUser(null)
            refetch()
        } else {
            addToast('error', 'Gagal memperbarui user')
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return

        const success = await deleteUser(deletingUser.id)
        if (success) {
            addToast('success', `User ${deletingUser.name} berhasil dihapus`)
            setDeletingUser(null)
            refetch()
        } else {
            addToast('error', 'Gagal menghapus user')
        }
    }

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
                    {roleLabels[u.role] || u.role}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (u) => (
                <StatusBadge
                    status={u.status === 'ACTIVE' ? 'success' : 'error'}
                    label={u.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                />
            ),
        },
        {
            key: 'createdAt' as keyof User,
            header: 'Tanggal Dibuat',
            render: (u) => (u as any).createdAt ? new Date((u as any).createdAt).toLocaleDateString('id-ID') : '-'
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
                subtitle="Kelola akun pengguna dan hak akses sistem"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'User Management' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() => {
                                setFormData({ name: '', email: '', password: '', role: 'STAFF', status: 'ACTIVE' })
                                setIsCreateOpen(true)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Tambah User
                        </button>
                    </div>
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
                            { label: 'Super Admin', value: 'SUPER_ADMIN' },
                            { label: 'Kepala Sekolah', value: 'PRINCIPAL' },
                            { label: 'Guru', value: 'TEACHER' },
                            { label: 'Staff TU', value: 'STAFF' },
                            { label: 'Orang Tua', value: 'PARENT' },
                            { label: 'Siswa', value: 'STUDENT' },
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
                onAdd={() => {
                    setFormData({ name: '', email: '', password: '', role: 'STAFF', status: 'ACTIVE' })
                    setIsCreateOpen(true)
                }}
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
                    onView={(u) => {
                        setFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status })
                        setEditingUser(u)
                    }}
                    onEdit={(u) => {
                        setFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status })
                        setEditingUser(u)
                    }}
                    onDelete={(u) => setDeletingUser(u)}
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            )}

            {/* Modal Tambah User */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah User Baru</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nama Lengkap</label>
                                <div className="relative">
                                    <UserIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@sekolah.sch.id"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="STAFF">Staff TU</option>
                                        <option value="TEACHER">Guru</option>
                                        <option value="PRINCIPAL">Kepala Sekolah</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="STUDENT">Siswa</option>
                                        <option value="PARENT">Orang Tua</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="ACTIVE">Aktif</option>
                                        <option value="INACTIVE">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isMutating}
                                    className="px-4 py-2 text-sm bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isMutating ? 'Menyimpan...' : 'Simpan User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit User */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User: {editingUser.name}</h3>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="STAFF">Staff TU</option>
                                        <option value="TEACHER">Guru</option>
                                        <option value="PRINCIPAL">Kepala Sekolah</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="STUDENT">Siswa</option>
                                        <option value="PARENT">Orang Tua</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="ACTIVE">Aktif</option>
                                        <option value="INACTIVE">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isMutating}
                                    className="px-4 py-2 text-sm bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isMutating ? 'Menyimpan...' : 'Perbarui User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={!!deletingUser}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus user ${deletingUser?.name} (${deletingUser?.email})? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus User"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeletingUser(null)}
            />
        </div>
    )
}
