import { useState } from 'react'
import { Plus, Lightbulb, Users, Calendar, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useP7Proyek, useDimensiP7 } from '@/hooks/useKurikulumMerdeka'
import { useFetch } from '@/hooks/useShared'
import type { Fase, StatusProyek, AcademicYear } from '@/types'

const faseOptions = [
    { label: 'Fase A (PAUD-TK)', value: 'A' },
    { label: 'Fase B (SD 1-2)', value: 'B' },
    { label: 'Fase C (SD 3-4)', value: 'C' },
    { label: 'Fase D (SD 5-6, SMP)', value: 'D' },
    { label: 'Fase E (SMA 10)', value: 'E' },
    { label: 'Fase F (SMA 11-12)', value: 'F' }
]

const statusColors: Record<StatusProyek, { bg: string; badgeStatus: 'pending' | 'active' | 'success' | 'warning' }> = {
    PLANNING: { bg: 'bg-gray-500', badgeStatus: 'pending' },
    ACTIVE: { bg: 'bg-blue-500', badgeStatus: 'active' },
    IN_PROGRESS: { bg: 'bg-amber-500', badgeStatus: 'warning' },
    COMPLETED: { bg: 'bg-emerald-500', badgeStatus: 'success' }
}

const statusLabels: Record<StatusProyek, string> = {
    PLANNING: 'Perencanaan',
    ACTIVE: 'Aktif',
    IN_PROGRESS: 'Berjalan',
    COMPLETED: 'Selesai'
}

const dimensiColors: Record<string, string> = {
    D1: 'bg-rose-500',
    D2: 'bg-blue-500',
    D3: 'bg-amber-500',
    D4: 'bg-emerald-500',
    D5: 'bg-purple-500',
    D6: 'bg-pink-500'
}

export default function P7Proyek() {
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string | undefined>()
    const [selectedFase, setSelectedFase] = useState<Fase | undefined>()
    const [selectedStatus, setSelectedStatus] = useState<StatusProyek | undefined>()
    const [showModal, setShowModal] = useState(false)

    const { p7ProyekList, loading, error, refetch, create } = useP7Proyek(
        selectedTahunAjaran,
        selectedFase,
        selectedStatus
    )
    const { dimensiP7List } = useDimensiP7()
    const { data: academicYears } = useFetch<AcademicYear[]>('/api/academic/years', undefined, { initialData: [] })

    const [formData, setFormData] = useState({
        namaProyek: '',
        tema: '',
        dimensiId: '',
        tahunAjaranId: '',
        fase: 'D' as Fase,
        durasiMinggu: 8,
        tanggalMulai: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await create({
            ...formData,
            tanggalMulai: formData.tanggalMulai || undefined
        })
        setShowModal(false)
        setFormData({
            namaProyek: '',
            tema: '',
            dimensiId: '',
            tahunAjaranId: '',
            fase: 'D',
            durasiMinggu: 8,
            tanggalMulai: ''
        })
        refetch()
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Proyek P7"
                subtitle="Projek Penguatan Profil Pelajar Pancasila"
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: 'Proyek P7' }
                ]}
                actions={
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Buat Proyek
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari proyek..."
                filters={[
                    {
                        label: 'Tahun Ajaran',
                        options: academicYears.map(ay => ({ label: ay.name, value: ay.id })),
                        onChange: (val) => setSelectedTahunAjaran(val)
                    },
                    {
                        label: 'Fase',
                        options: faseOptions,
                        onChange: (val) => setSelectedFase(val as Fase | undefined)
                    },
                    {
                        label: 'Status',
                        options: Object.entries(statusLabels).map(([value, label]) => ({ label, value })),
                        onChange: (val) => setSelectedStatus(val as StatusProyek | undefined)
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
            ) : p7ProyekList.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <Lightbulb className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-2">
                        Belum ada Proyek P7
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Buat proyek pertama untuk memulai
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                        Buat Proyek
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {p7ProyekList.map((proyek) => (
                        <div
                            key={proyek.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg ${dimensiColors[proyek.dimensi?.kode || 'D1'] || 'bg-primary'} flex items-center justify-center text-white`}>
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-main dark:text-white">
                                            {proyek.namaProyek}
                                        </h3>
                                        <p className="text-sm text-text-secondary">
                                            {proyek.dimensi?.namaDimensi}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge
                                    status={statusColors[proyek.status].badgeStatus}
                                    label={statusLabels[proyek.status]}
                                />
                            </div>

                            {proyek.tema && (
                                <p className="text-sm text-text-secondary mb-3 italic">
                                    Tema: {proyek.tema}
                                </p>
                            )}

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary">Fase</span>
                                    <span className="font-medium text-text-main dark:text-white">
                                        Fase {proyek.fase}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-1">
                                        <Users size={14} /> Tim
                                    </span>
                                    <span className="font-medium text-text-main dark:text-white">
                                        {proyek._count?.tim || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-1">
                                        <Calendar size={14} /> Durasi
                                    </span>
                                    <span className="font-medium text-text-main dark:text-white">
                                        {proyek.durasiMinggu} minggu
                                    </span>
                                </div>
                                {proyek.tanggalMulai && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">Periode</span>
                                        <span className="font-medium text-text-main dark:text-white">
                                            {new Date(proyek.tanggalMulai).toLocaleDateString('id-ID')}
                                            {proyek.tanggalSelesai && ` - ${new Date(proyek.tanggalSelesai).toLocaleDateString('id-ID')}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Link
                                to={`/kurikulum-merdeka/p7/${proyek.id}`}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Eye size={16} />
                                Lihat Detail
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-text-main dark:text-white mb-4">
                            Buat Proyek P7 Baru
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                    Nama Proyek
                                </label>
                                <input
                                    type="text"
                                    value={formData.namaProyek}
                                    onChange={(e) => setFormData({ ...formData, namaProyek: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                    placeholder="e.g. Kearifan Lokal Nusantara"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                    Tema (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tema}
                                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                    placeholder="e.g. Gaya Hidup Berkelanjutan"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                        Dimensi P7
                                    </label>
                                    <select
                                        value={formData.dimensiId}
                                        onChange={(e) => setFormData({ ...formData, dimensiId: e.target.value })}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Dimensi</option>
                                        {dimensiP7List.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.kode} - {d.namaDimensi.substring(0, 30)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                        Tahun Ajaran
                                    </label>
                                    <select
                                        value={formData.tahunAjaranId}
                                        onChange={(e) => setFormData({ ...formData, tahunAjaranId: e.target.value })}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Tahun</option>
                                        {academicYears.map((ay) => (
                                            <option key={ay.id} value={ay.id}>
                                                {ay.name} {ay.isActive && '(Aktif)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                        Durasi (Minggu)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.durasiMinggu}
                                        onChange={(e) => setFormData({ ...formData, durasiMinggu: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                        min={1}
                                        max={24}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                    Tanggal Mulai (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.tanggalMulai}
                                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Buat Proyek
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
