import { useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useCapaianPembelajaran } from '@/hooks/useKurikulumMerdeka'
import { useFetch } from '@/hooks/useShared'
import type { Fase, Subject } from '@/types'

const faseOptions = [
    { label: 'Fase A (PAUD-TK)', value: 'A' },
    { label: 'Fase B (SD 1-2)', value: 'B' },
    { label: 'Fase C (SD 3-4)', value: 'C' },
    { label: 'Fase D (SD 5-6, SMP)', value: 'D' },
    { label: 'Fase E (SMA 10)', value: 'E' },
    { label: 'Fase F (SMA 11-12)', value: 'F' }
]

const faseColors: Record<Fase, string> = {
    A: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    B: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    C: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    D: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    E: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    F: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
}

export default function CapaianPembelajaran() {
    const [selectedFase, setSelectedFase] = useState<Fase | undefined>()
    const [selectedSubject, setSelectedSubject] = useState<string | undefined>()
    const [showModal, setShowModal] = useState(false)
    const [editingCP, setEditingCP] = useState<any>(null)

    const { cpList, loading, error, refetch, create, update, remove } = useCapaianPembelajaran(selectedFase, selectedSubject)
    const { data: subjects } = useFetch<Subject[]>('/api/subjects', undefined, { initialData: [] })

    const [formData, setFormData] = useState({
        kodeCP: '',
        fase: 'D' as Fase,
        mataPelajaranId: '',
        deskripsi: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (editingCP) {
            await update(editingCP.id, formData)
        } else {
            await create(formData)
        }
        setShowModal(false)
        setEditingCP(null)
        setFormData({ kodeCP: '', fase: 'D', mataPelajaranId: '', deskripsi: '' })
        refetch()
    }

    const handleEdit = (cp: any) => {
        setEditingCP(cp)
        setFormData({
            kodeCP: cp.kodeCP,
            fase: cp.fase,
            mataPelajaranId: cp.mataPelajaranId,
            deskripsi: cp.deskripsi
        })
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus Capaian Pembelajaran ini?')) {
            await remove(id)
            refetch()
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Capaian Pembelajaran"
                subtitle="Kelola Capaian Pembelajaran (CP) sesuai fase dan mata pelajaran"
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: 'Capaian Pembelajaran' }
                ]}
                actions={
                    <button
                        onClick={() => {
                            setEditingCP(null)
                            setFormData({ kodeCP: '', fase: 'D', mataPelajaranId: '', deskripsi: '' })
                            setShowModal(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah CP
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari capaian pembelajaran..."
                filters={[
                    {
                        label: 'Fase',
                        options: faseOptions,
                        onChange: (val) => setSelectedFase(val as Fase | undefined)
                    },
                    {
                        label: 'Mata Pelajaran',
                        options: subjects.map(s => ({ label: s.name, value: s.id })),
                        onChange: (val) => setSelectedSubject(val)
                    }
                ]}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            ) : cpList.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-2">
                        Belum ada Capaian Pembelajaran
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Tambahkan CP pertama untuk memulai
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        Tambah CP
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cpList.map((cp) => (
                        <div
                            key={cp.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${faseColors[cp.fase]}`}>
                                        Fase {cp.fase}
                                    </span>
                                    <span className="text-sm text-text-secondary">
                                        {cp.mataPelajaran?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(cp)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} className="text-text-secondary" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cp.id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-text-main dark:text-white mb-2">
                                {cp.kodeCP}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {cp.deskripsi}
                            </p>
                            {cp._count && (
                                <div className="mt-3 text-xs text-text-secondary">
                                    {cp._count.modulAjar} Modul Ajar terhubung
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-semibold text-text-main dark:text-white mb-4">
                            {editingCP ? 'Edit Capaian Pembelajaran' : 'Tambah Capaian Pembelajaran'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                    Kode CP
                                </label>
                                <input
                                    type="text"
                                    value={formData.kodeCP}
                                    onChange={(e) => setFormData({ ...formData, kodeCP: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                    placeholder="e.g. MTK-D-01"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                        Fase
                                    </label>
                                    <select
                                        value={formData.fase}
                                        onChange={(e) => setFormData({ ...formData, fase: e.target.value as Fase })}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                    >
                                        {faseOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                        Mata Pelajaran
                                    </label>
                                    <select
                                        value={formData.mataPelajaranId}
                                        onChange={(e) => setFormData({ ...formData, mataPelajaranId: e.target.value })}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Mata Pelajaran</option>
                                        {subjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                    Deskripsi CP
                                </label>
                                <textarea
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                    rows={4}
                                    placeholder="Deskripsi capaian pembelajaran..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingCP(null)
                                    }}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg"
                                >
                                    {editingCP ? 'Simpan Perubahan' : 'Tambah CP'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
