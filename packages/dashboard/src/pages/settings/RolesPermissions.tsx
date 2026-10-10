import { Shield, Users, Check, X, Edit, ChevronRight, Plus, Trash2, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useRoles, useRoleMutations } from '@/hooks/useSettings'
import { useToast } from '@/contexts/ToastContext'
import type { Role } from '@/types'

const permissionModules = [
    { id: 'dashboard', name: 'Dashboard & Statistik', actions: ['view'] },
    { id: 'students', name: 'Manajemen Siswa', actions: ['view', 'manage', 'delete'] },
    { id: 'teachers', name: 'Manajemen Guru', actions: ['view', 'manage', 'delete'] },
    { id: 'academic', name: 'Akademik & Jadwal', actions: ['view', 'manage'] },
    { id: 'grading', name: 'Penilaian & Rapor', actions: ['view', 'manage'] },
    { id: 'finance', name: 'Keuangan & SPP', actions: ['view', 'manage'] },
    { id: 'infrastructure', name: 'Sarana & Prasarana', actions: ['view', 'manage'] },
    { id: 'communication', name: 'Komunikasi & Pengumuman', actions: ['view', 'manage'] },
    { id: 'settings', name: 'Pengaturan Sistem', actions: ['view', 'manage'] },
]

const roleCardColors = [
    'bg-rose-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500'
]

export default function RolesPermissions() {
    const { roles, loading, refetch } = useRoles()
    const { createRole, updateRole, deleteRole, loading: isMutating } = useRoleMutations()
    const { addToast } = useToast()

    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [currentPermissions, setCurrentPermissions] = useState<string[]>([])
    const [isSavingPermissions, setIsSavingPermissions] = useState(false)

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [deletingRole, setDeletingRole] = useState<Role | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0])
            setCurrentPermissions(roles[0].permissions || [])
        } else if (selectedRole) {
            const found = roles.find(r => r.id === selectedRole.id)
            if (found) {
                setCurrentPermissions(found.permissions || [])
            }
        }
    }, [roles, selectedRole])

    const handleSelectRole = (role: Role) => {
        setSelectedRole(role)
        setCurrentPermissions(role.permissions || [])
    }

    const hasPermission = (module: string, action: string) => {
        if (currentPermissions.includes('all')) return true
        return currentPermissions.includes(`${module}:${action}`) || currentPermissions.includes(`${module}:all`)
    }

    const togglePermission = (module: string, action: string) => {
        if (currentPermissions.includes('all')) {
            // Unpack all except the toggled one
            addToast('info', 'Role Super Admin memiliki akses penuh otomatis')
            return
        }

        const permKey = `${module}:${action}`
        if (currentPermissions.includes(permKey)) {
            setCurrentPermissions(currentPermissions.filter(p => p !== permKey))
        } else {
            setCurrentPermissions([...currentPermissions, permKey])
        }
    }

    const handleSavePermissions = async () => {
        if (!selectedRole) return
        setIsSavingPermissions(true)
        const ok = await updateRole(selectedRole.id, {
            permissions: currentPermissions
        })
        setIsSavingPermissions(false)
        if (ok) {
            addToast('success', `Hak akses untuk role ${selectedRole.name} berhasil disimpan`)
            await refetch()
        } else {
            addToast('error', 'Gagal menyimpan hak akses')
        }
    }

    const handleOpenCreate = () => {
        setFormData({ name: '', description: '' })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (e: React.MouseEvent, role: Role) => {
        e.stopPropagation()
        setEditingRole(role)
        setFormData({ name: role.name, description: role.description || '' })
    }

    const handleSubmitRole = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return

        if (editingRole) {
            const ok = await updateRole(editingRole.id, {
                name: formData.name,
                description: formData.description
            })
            if (ok) {
                addToast('success', 'Role berhasil diperbarui')
                setEditingRole(null)
                await refetch()
            } else {
                addToast('error', 'Gagal memperbarui role')
            }
        } else {
            const ok = await createRole({
                name: formData.name,
                description: formData.description,
                permissions: ['dashboard:view']
            })
            if (ok) {
                addToast('success', 'Role baru berhasil dibuat')
                setIsCreateOpen(false)
                await refetch()
            } else {
                addToast('error', 'Gagal membuat role')
            }
        }
    }

    const handleDeleteRole = async () => {
        if (!deletingRole) return
        const ok = await deleteRole(deletingRole.id)
        if (ok) {
            addToast('success', 'Role berhasil dihapus')
            setDeletingRole(null)
            if (selectedRole?.id === deletingRole.id) {
                setSelectedRole(null)
            }
            await refetch()
        } else {
            addToast('error', 'Gagal menghapus role')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles & Hak Akses"
                subtitle="Kelola role otorisasi dan matriks perizinan pengguna"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Roles & Hak Akses' },
                ]}
                actions={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Role Baru
                    </button>
                }
            />

            {/* Roles list */}
            {loading && roles.length === 0 ? (
                <div className="py-12 flex justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role, idx) => {
                        const isSelected = selectedRole?.id === role.id
                        const cardColor = roleCardColors[idx % roleCardColors.length]

                        return (
                            <div
                                key={role.id}
                                onClick={() => handleSelectRole(role)}
                                className={`bg-white dark:bg-gray-800 rounded-xl border p-5 transition-all cursor-pointer relative group ${
                                    isSelected
                                        ? 'border-primary ring-2 ring-primary/20 shadow-md'
                                        : 'border-border-color dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${cardColor} flex items-center justify-center text-white shadow-sm`}>
                                        <Shield size={20} />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleOpenEdit(e, role)}
                                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                                            title="Edit Nama Role"
                                        >
                                            <Edit size={15} />
                                        </button>
                                        {role.name !== 'Super Admin' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeletingRole(role)
                                                }}
                                                className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                                                title="Hapus Role"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-text-main dark:text-white mb-1 flex items-center gap-2">
                                    {role.name}
                                    {isSelected && (
                                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                                            Dipilih
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-text-secondary mb-3 min-h-[32px] line-clamp-2">
                                    {role.description || 'Hak akses operasional sekolah.'}
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700/60">
                                    <span className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                                        <Users size={14} /> {role.usersCount ?? 0} Pengguna
                                    </span>
                                    <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                                        Atur Izin <ChevronRight size={14} />
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Permission Matrix */}
            {selectedRole && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-border-color dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-gray-700/30">
                        <div>
                            <div className="flex items-center gap-2">
                                <Shield className="text-primary" size={20} />
                                <h3 className="font-bold text-text-main dark:text-white text-base">
                                    Matriks Hak Akses: <span className="text-primary font-extrabold">{selectedRole.name}</span>
                                </h3>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                                Klik tanda centang/silang pada kolom aksi untuk memberi atau mencabut izin akses.
                            </p>
                        </div>
                        <button
                            onClick={handleSavePermissions}
                            disabled={isSavingPermissions}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSavingPermissions ? 'Menyimpan...' : 'Simpan Hak Akses'}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-gray-700/70 text-text-secondary uppercase text-[11px] font-semibold tracking-wider">
                                    <th className="px-5 py-3.5 text-left">Modul / Fitur</th>
                                    <th className="px-5 py-3.5 text-center">Lihat (Read)</th>
                                    <th className="px-5 py-3.5 text-center">Kelola / Edit (Write)</th>
                                    <th className="px-5 py-3.5 text-center">Hapus (Delete)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {permissionModules.map((module) => {
                                    const canView = hasPermission(module.id, 'view')
                                    const canManage = hasPermission(module.id, 'manage')
                                    const canDelete = hasPermission(module.id, 'delete')

                                    return (
                                        <tr key={module.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-text-main dark:text-white">
                                                {module.name}
                                            </td>

                                            {/* View */}
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => togglePermission(module.id, 'view')}
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                                                        canView
                                                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200'
                                                            : 'bg-slate-100 dark:bg-gray-700 text-slate-400 hover:bg-slate-200'
                                                    }`}
                                                    title={canView ? 'Akses Aktif' : 'Akses Nonaktif'}
                                                >
                                                    {canView ? <Check size={16} /> : <X size={16} />}
                                                </button>
                                            </td>

                                            {/* Manage */}
                                            <td className="px-5 py-4 text-center">
                                                {module.actions.includes('manage') ? (
                                                    <button
                                                        onClick={() => togglePermission(module.id, 'manage')}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                                                            canManage
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200'
                                                                : 'bg-slate-100 dark:bg-gray-700 text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                        title={canManage ? 'Akses Aktif' : 'Akses Nonaktif'}
                                                    >
                                                        {canManage ? <Check size={16} /> : <X size={16} />}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-text-secondary">-</span>
                                                )}
                                            </td>

                                            {/* Delete */}
                                            <td className="px-5 py-4 text-center">
                                                {module.actions.includes('delete') ? (
                                                    <button
                                                        onClick={() => togglePermission(module.id, 'delete')}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                                                            canDelete
                                                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200'
                                                                : 'bg-slate-100 dark:bg-gray-700 text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                        title={canDelete ? 'Akses Aktif' : 'Akses Nonaktif'}
                                                    >
                                                        {canDelete ? <Check size={16} /> : <X size={16} />}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-text-secondary">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            {(isCreateOpen || editingRole) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingRole ? 'Edit Role Pengguna' : 'Tambah Role Baru'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsCreateOpen(false)
                                    setEditingRole(null)
                                }}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Nama Role *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Contoh: Koordinator Laboratorium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Deskripsi Role
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    placeholder="Tugas dan batasan wewenang role..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateOpen(false)
                                        setEditingRole(null)
                                    }}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 text-text-secondary hover:text-text-main rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isMutating}
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isMutating && <LoadingSpinner size="sm" />}
                                    {editingRole ? 'Simpan Perubahan' : 'Buat Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingRole}
                title="Hapus Role Otorisasi"
                message={`Apakah Anda yakin ingin menghapus role "${deletingRole?.name}"? Pengguna dengan role ini akan kehilangan hak akses yang ditentukan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteRole}
                onClose={() => setDeletingRole(null)}
            />
        </div>
    )
}
