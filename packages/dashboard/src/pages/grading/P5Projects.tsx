import { useState } from 'react'
import { Lightbulb, Users, Calendar, Plus, X, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useP5Projects, type P5Project } from '@/hooks/useGrading'
import { useToast } from '@/contexts/ToastContext'

const themeColors: Record<string, string> = {
    'Bhinneka Tunggal Ika': 'bg-rose-500',
    'Gaya Hidup Berkelanjutan': 'bg-emerald-500',
    'Kewirausahaan': 'bg-amber-500',
    'Rekayasa dan Teknologi': 'bg-blue-500',
    'Suara Demokrasi': 'bg-purple-500',
    'Kearifan Lokal': 'bg-indigo-500',
}

export default function P5Projects() {
    const { projects, loading, error, refetch, createProject, removeProject, mutationLoading } = useP5Projects()
    const { addToast } = useToast()

    const [search, setSearch] = useState('')
    const [themeFilter, setThemeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [deletingProject, setDeletingProject] = useState<P5Project | null>(null)

    // Form
    const [formData, setFormData] = useState({
        title: '',
        theme: 'Gaya Hidup Berkelanjutan',
        description: '',
        status: 'PLANNING' as 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    })

    const filteredProjects = projects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(search.toLowerCase())
        const matchTheme = themeFilter ? p.theme === themeFilter : true
        const matchStatus = statusFilter ? p.status === statusFilter : true
        return matchSearch && matchTheme && matchStatus
    })

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.theme) {
            addToast('error', 'Judul dan tema projek wajib diisi')
            return
        }

        try {
            await createProject({
                title: formData.title,
                theme: formData.theme,
                description: formData.description,
                status: formData.status,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
            })
            addToast('success', 'Projek P5 berhasil dibuat')
            setIsCreateOpen(false)
            setFormData({
                title: '',
                theme: 'Gaya Hidup Berkelanjutan',
                description: '',
                status: 'PLANNING',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            })
            refetch()
        } catch {
            addToast('error', 'Gagal membuat projek P5')
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingProject) return
        try {
            await removeProject(deletingProject.id)
            addToast('success', 'Projek P5 berhasil dihapus')
            setDeletingProject(null)
            refetch()
        } catch {
            addToast('error', 'Gagal menghapus projek')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Projek P5"
                subtitle="Projek Penguatan Profil Pelajar Pancasila"
                breadcrumb={[
                    { label: 'Penilaian', path: '/grading' },
                    { label: 'Projek P5' },
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
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Buat Projek Baru
                        </button>
                    </div>
                }
            />

            <FilterBar
                searchPlaceholder="Cari projek P5..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Tema',
                        options: [
                            { label: 'Gaya Hidup Berkelanjutan', value: 'Gaya Hidup Berkelanjutan' },
                            { label: 'Kearifan Lokal', value: 'Kearifan Lokal' },
                            { label: 'Bhinneka Tunggal Ika', value: 'Bhinneka Tunggal Ika' },
                            { label: 'Bangunlah Jiwa dan Raganya', value: 'Bangunlah Jiwa dan Raganya' },
                            { label: 'Suara Demokrasi', value: 'Suara Demokrasi' },
                            { label: 'Rekayasa dan Teknologi', value: 'Rekayasa dan Teknologi' },
                            { label: 'Kewirausahaan', value: 'Kewirausahaan' },
                        ],
                        onChange: setThemeFilter
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Perencanaan', value: 'PLANNING' },
                            { label: 'Berjalan', value: 'IN_PROGRESS' },
                            { label: 'Selesai', value: 'COMPLETED' },
                        ],
                        onChange: setStatusFilter
                    },
                ]}
                onAdd={() => setIsCreateOpen(true)}
                addLabel="Buat Projek Baru"
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-text-secondary bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50 text-amber-500" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">Belum ada projek P5</p>
                    <p className="text-xs text-gray-500 mt-1">Klik tombol &quot;Buat Projek Baru&quot; untuk memulai modul P5 sekolah.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 hover:shadow-md transition-shadow relative group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold text-white ${themeColors[project.theme] || 'bg-primary'} mb-2`}>
                                        {project.theme}
                                    </span>
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">
                                        {project.title}
                                    </h3>
                                    {project.description && (
                                        <p className="text-sm text-text-secondary mt-1">{project.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge
                                        status={project.status === 'COMPLETED' ? 'success' : project.status === 'IN_PROGRESS' ? 'warning' : 'pending'}
                                        label={project.status === 'COMPLETED' ? 'Selesai' : project.status === 'IN_PROGRESS' ? 'Berjalan' : 'Perencanaan'}
                                    />
                                    <button
                                        onClick={() => setDeletingProject(project)}
                                        className="text-gray-400 hover:text-rose-500 p-1 rounded transition-colors"
                                        title="Hapus Projek"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary pt-3 border-t border-border-color dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span>
                                        {project.startDate ? new Date(project.startDate).toLocaleDateString('id-ID') : '-'}
                                        {project.endDate ? ` s/d ${new Date(project.endDate).toLocaleDateString('id-ID')}` : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-gray-400" />
                                    <span>Fase Kurikulum Merdeka</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Buat Projek P5 */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buat Projek P5 Baru</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Judul Projek</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Pengolahan Sampah Organik Menjadi Kompos"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tema P5</label>
                                <select
                                    value={formData.theme}
                                    onChange={e => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="Gaya Hidup Berkelanjutan">Gaya Hidup Berkelanjutan</option>
                                    <option value="Kearifan Lokal">Kearifan Lokal</option>
                                    <option value="Bhinneka Tunggal Ika">Bhinneka Tunggal Ika</option>
                                    <option value="Bangunlah Jiwa dan Raganya">Bangunlah Jiwa dan Raganya</option>
                                    <option value="Suara Demokrasi">Suara Demokrasi</option>
                                    <option value="Rekayasa dan Teknologi">Rekayasa dan Teknologi</option>
                                    <option value="Kewirausahaan">Kewirausahaan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status Projek</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="PLANNING">Perencanaan</option>
                                    <option value="IN_PROGRESS">Berjalan</option>
                                    <option value="COMPLETED">Selesai</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Deskripsi Projek</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Jelaskan tujuan dan aktivitas projek..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
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
                                    disabled={mutationLoading}
                                    className="px-4 py-2 text-sm bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {mutationLoading ? 'Menyimpan...' : 'Simpan Projek'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={!!deletingProject}
                title="Hapus Projek P5"
                message={`Apakah Anda yakin ingin menghapus projek "${deletingProject?.title}"?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeletingProject(null)}
            />
        </div>
    )
}
