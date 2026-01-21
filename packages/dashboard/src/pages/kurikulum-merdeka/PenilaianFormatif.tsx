import { useState } from 'react'
import { ClipboardCheck, User, BookOpen, Save } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { usePenilaianFormatif, useModulAjar } from '@/hooks/useKurikulumMerdeka'
import { useFetch } from '@/hooks/useShared'
import type { Student, JenisPenilaianFormatif, TingkatPencapaian } from '@/types'

const jenisOptions: { label: string; value: JenisPenilaianFormatif }[] = [
    { label: 'Observasi', value: 'OBSERVASI' },
    { label: 'Kuis', value: 'KUIS' },
    { label: 'Tugas', value: 'TUGAS' },
    { label: 'Diskusi', value: 'DISKUSI' }
]

const tingkatOptions: { label: string; value: TingkatPencapaian; color: string }[] = [
    { label: 'BB - Belum Berkembang', value: 'BB', color: 'bg-red-100 text-red-700 border-red-300' },
    { label: 'MB - Mulai Berkembang', value: 'MB', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { label: 'BSH - Berkembang Sesuai Harapan', value: 'BSH', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { label: 'BSB - Berkembang Sangat Baik', value: 'BSB', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' }
]

export default function PenilaianFormatif() {
    const [selectedModul, setSelectedModul] = useState<string>('')
    const [selectedJenis, setSelectedJenis] = useState<JenisPenilaianFormatif>('OBSERVASI')
    const [penilaianData, setPenilaianData] = useState<Record<string, { tingkat: TingkatPencapaian; catatan: string }>>({})

    const { modulAjarList } = useModulAjar(undefined, undefined, undefined, 'ACTIVE')
    const { penilaianFormatifList, create, refetch } = usePenilaianFormatif(undefined, selectedModul)
    const { data: students } = useFetch<Student[]>('/api/students', undefined, { initialData: [] })

    const selectedModulData = modulAjarList.find(m => m.id === selectedModul)

    const handleTingkatChange = (studentId: string, tingkat: TingkatPencapaian) => {
        setPenilaianData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], tingkat, catatan: prev[studentId]?.catatan || '' }
        }))
    }

    const handleCatatanChange = (studentId: string, catatan: string) => {
        setPenilaianData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], catatan, tingkat: prev[studentId]?.tingkat || 'MB' }
        }))
    }

    const handleSubmit = async () => {
        const entries = Object.entries(penilaianData)
        if (entries.length === 0 || !selectedModul) {
            alert('Pilih modul dan input penilaian minimal 1 siswa')
            return
        }

        for (const [siswaId, data] of entries) {
            await create({
                siswaId,
                modulAjarId: selectedModul,
                jenis: selectedJenis,
                tingkatPencapaian: data.tingkat,
                catatan: data.catatan
            })
        }

        setPenilaianData({})
        refetch()
        alert('Penilaian berhasil disimpan!')
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Penilaian Formatif"
                subtitle="Input penilaian harian berbasis observasi"
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: 'Penilaian Formatif' }
                ]}
            />

            {/* Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Modul Ajar
                        </label>
                        <select
                            value={selectedModul}
                            onChange={(e) => setSelectedModul(e.target.value)}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                        >
                            <option value="">Pilih Modul Ajar</option>
                            {modulAjarList.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.namaModul} - {m.cp?.mataPelajaran?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Jenis Penilaian
                        </label>
                        <select
                            value={selectedJenis}
                            onChange={(e) => setSelectedJenis(e.target.value as JenisPenilaianFormatif)}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                        >
                            {jenisOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedModulData && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <BookOpen size={18} />
                            <span className="font-medium">{selectedModulData.namaModul}</span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                            CP: {selectedModulData.cp?.kodeCP} | Guru: {selectedModulData.guru?.name}
                        </p>
                    </div>
                )}
            </div>

            {/* Penilaian Table */}
            {selectedModul ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-text-main dark:text-white">
                            Input Penilaian
                        </h3>
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(penilaianData).length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Save size={16} />
                            Simpan Penilaian
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-gray-700/50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                                        Siswa
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                                        Tingkat Pencapaian
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                                        Catatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User size={16} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-main dark:text-white">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-text-secondary">
                                                        {student.nis}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 flex-wrap">
                                                {tingkatOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleTingkatChange(student.id, opt.value)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${penilaianData[student.id]?.tingkat === opt.value
                                                            ? opt.color + ' ring-2 ring-offset-1'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                                                            }`}
                                                    >
                                                        {opt.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={penilaianData[student.id]?.catatan || ''}
                                                onChange={(e) => handleCatatanChange(student.id, e.target.value)}
                                                placeholder="Catatan opsional..."
                                                className="w-full px-3 py-1.5 text-sm border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <ClipboardCheck className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-2">
                        Pilih Modul Ajar
                    </h3>
                    <p className="text-text-secondary">
                        Pilih modul ajar untuk memulai input penilaian
                    </p>
                </div>
            )}

            {/* Recent Penilaian */}
            {penilaianFormatifList.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-text-main dark:text-white mb-4">
                        Riwayat Penilaian (Modul ini)
                    </h3>
                    <div className="space-y-2">
                        {penilaianFormatifList.slice(0, 5).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${tingkatOptions.find(t => t.value === p.tingkatPencapaian)?.color
                                        }`}>
                                        {p.tingkatPencapaian}
                                    </span>
                                    <span className="text-sm text-text-main dark:text-white">
                                        {p.siswa?.name}
                                    </span>
                                </div>
                                <span className="text-xs text-text-secondary">
                                    {new Date(p.tanggal).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
