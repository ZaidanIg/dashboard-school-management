import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, X, BookOpen } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useCurriculumModules, useCurriculum, type CurriculumModule } from '@/hooks/useCurriculum'
import { useToast } from '@/contexts/ToastContext'

export default function CurriculumDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { modules, loading, createModule, updateModule, deleteModule } = useCurriculumModules(id)
    const { curriculums, fetchCurriculums } = useCurriculum() // utilizing existing hook to get curriculum name if needed, or fetch specific one
    const { success, error } = useToast()

    const [currentCurriculum, setCurrentCurriculum] = useState<any>(null)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingModule, setEditingModule] = useState<CurriculumModule | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<CurriculumModule>>({
        subjectCode: '',
        title: '',
        grade: 10,
        semester: 'GANJIL',
        description: '',
        competencies: []
    })

    useEffect(() => {
        // Fetch specific curriculum info if not available in list or simply find from list if we have it
        // For simplicity, we can fetch all and find, or implement getCurriculum in hook. 
        // Let's assume we find it from the list for now, or fetch if empty.
        if (curriculums.length === 0) {
            fetchCurriculums()
        }
    }, [curriculums.length, fetchCurriculums])

    useEffect(() => {
        const found = curriculums.find(c => c.id === id)
        if (found) setCurrentCurriculum(found)
    }, [curriculums, id])


    const handleOpenModal = (module?: CurriculumModule) => {
        if (module) {
            setEditingModule(module)
            setFormData({
                subjectCode: module.subjectCode,
                title: module.title,
                grade: module.grade,
                semester: module.semester,
                description: module.description || '',
                competencies: module.competencies || []
            })
        } else {
            setEditingModule(null)
            setFormData({
                subjectCode: '',
                title: '',
                grade: 10,
                semester: 'GANJIL',
                description: '',
                competencies: []
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return

        const result = editingModule
            ? await updateModule(editingModule.id, formData)
            : await createModule(formData)

        if (result.success) {
            success(editingModule ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
                `Modul ${formData.title} berhasil ${editingModule ? 'diperbarui' : 'ditambahkan'}`)
            setIsModalOpen(false)
        } else {
            error('Gagal', result.error)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        const result = await deleteModule(deleteId)
        if (result.success) {
            success('Berhasil Dihapus', 'Modul berhasil dihapus')
            setDeleteId(null)
        } else {
            error('Gagal Menghapus', result.error)
        }
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/curriculum')}
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-2"
            >
                <ArrowLeft size={20} />
                Kembali ke Manajemen Kurikulum
            </button>

            <PageHeader
                title={currentCurriculum ? `Konfigurasi: ${currentCurriculum.name}` : 'Detail Kurikulum'}
                subtitle="Kelola capaian pembelajaran dan modul"
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: currentCurriculum?.name || 'Detail' },
                ]}
                actions={
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah Modul
                    </button>
                }
            />

            {/* Modules List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-gray-700/50">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Kode Mapel</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Judul Modul</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Kelas / Semester</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Deskripsi</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">Loading...</td>
                                </tr>
                            ) : modules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                                        <div className="flex flex-col items-center justify-center">
                                            <BookOpen size={32} className="mb-2 opacity-50" />
                                            <p>Belum ada modul pembelajaran</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                modules.map((module) => (
                                    <tr key={module.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium">{module.subjectCode}</td>
                                        <td className="px-6 py-4 text-text-main dark:text-white font-medium">{module.title}</td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            Kelas {module.grade} - {module.semester}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary max-w-xs truncate">{module.description || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(module)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(module.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold">{editingModule ? 'Edit Modul' : 'Tambah Modul'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kode Mapel</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.subjectCode}
                                        onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                                        placeholder="Ex: MTK"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Judul Modul</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Aljabar Linear"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kelas</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Semester</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.semester}
                                        onChange={e => setFormData({ ...formData, semester: e.target.value as any })}
                                    >
                                        <option value="GANJIL">Ganjil</option>
                                        <option value="GENAP">Genap</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-blue-600 rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Modul"
                message="Apakah Anda yakin ingin menghapus modul ini?"
                confirmLabel="Hapus"
                variant="danger"
                isLoading={loading}
            />
        </div>
    )
}
