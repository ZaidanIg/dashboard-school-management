import { Shield, Users, Check, X, Edit, ChevronRight } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const roles = [
    {
        id: '1',
        name: 'Super Admin',
        description: 'Akses penuh ke semua fitur sistem',
        users: 2,
        permissions: ['all'],
        color: 'bg-rose-500',
    },
    {
        id: '2',
        name: 'Kepala Sekolah',
        description: 'Akses ke dashboard dan laporan',
        users: 1,
        permissions: ['view_dashboard', 'view_reports', 'view_students', 'view_teachers'],
        color: 'bg-purple-500',
    },
    {
        id: '3',
        name: 'Wakil Kepala Sekolah',
        description: 'Akses ke akademik dan kurikulum',
        users: 4,
        permissions: ['view_dashboard', 'manage_academic', 'manage_curriculum'],
        color: 'bg-indigo-500',
    },
    {
        id: '4',
        name: 'Guru',
        description: 'Akses ke jadwal dan penilaian',
        users: 82,
        permissions: ['view_schedule', 'manage_grades', 'view_students'],
        color: 'bg-blue-500',
    },
    {
        id: '5',
        name: 'Staff Keuangan',
        description: 'Akses ke modul keuangan',
        users: 5,
        permissions: ['manage_finance', 'view_reports'],
        color: 'bg-amber-500',
    },
    {
        id: '6',
        name: 'Staff Admin',
        description: 'Akses ke data siswa dan guru',
        users: 8,
        permissions: ['manage_students', 'manage_teachers', 'manage_communication'],
        color: 'bg-emerald-500',
    },
]

const permissionModules = [
    { id: 'dashboard', name: 'Dashboard', permissions: ['view', 'manage'] },
    { id: 'students', name: 'Manajemen Siswa', permissions: ['view', 'create', 'edit', 'delete'] },
    { id: 'teachers', name: 'Manajemen Guru', permissions: ['view', 'create', 'edit', 'delete'] },
    { id: 'finance', name: 'Keuangan', permissions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { id: 'academic', name: 'Akademik', permissions: ['view', 'manage'] },
    { id: 'grading', name: 'Penilaian', permissions: ['view', 'input', 'edit', 'publish'] },
    { id: 'settings', name: 'Pengaturan', permissions: ['view', 'manage'] },
]

export default function RolesPermissions() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles & Permissions"
                subtitle="Kelola role dan hak akses pengguna"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Roles & Permissions' },
                ]}
                actions={
                    <button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        + Tambah Role
                    </button>
                }
            />

            {/* Roles list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center text-white`}>
                                <Shield size={20} />
                            </div>
                            <button className="p-2 text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit size={16} />
                            </button>
                        </div>
                        <h3 className="font-semibold text-text-main dark:text-white mb-1">{role.name}</h3>
                        <p className="text-sm text-text-secondary mb-3">{role.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-text-secondary">
                                <Users size={14} /> {role.users} pengguna
                            </span>
                            <ChevronRight size={16} className="text-text-secondary" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Matrix */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-border-color dark:border-gray-700">
                    <h3 className="font-semibold text-text-main dark:text-white">Matriks Hak Akses</h3>
                    <p className="text-sm text-text-secondary">Kelola permission untuk role Guru</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-gray-700/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Modul</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Lihat</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Buat</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Edit</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Hapus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                            {permissionModules.map((module) => (
                                <tr key={module.id}>
                                    <td className="px-4 py-3 font-medium text-text-main dark:text-white">{module.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto">
                                            <Check size={14} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="w-6 h-6 rounded bg-slate-100 dark:bg-gray-700 text-text-secondary flex items-center justify-center mx-auto">
                                            <X size={14} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto">
                                            <Check size={14} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="w-6 h-6 rounded bg-slate-100 dark:bg-gray-700 text-text-secondary flex items-center justify-center mx-auto">
                                            <X size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
