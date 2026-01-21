import { useState, useMemo } from 'react'
import { BookOpen, Save, Filter } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
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

export default function TeacherFormatif() {
    // State
    const [selectedClassId, setSelectedClassId] = useState<string>('')
    const [selectedModul, setSelectedModul] = useState<string>('')
    const [selectedJenis, setSelectedJenis] = useState<JenisPenilaianFormatif>('OBSERVASI')
    const [penilaianData, setPenilaianData] = useState<Record<string, { tingkat: TingkatPencapaian; catatan: string }>>({})

    const [teacherId, setTeacherId] = useState<string | null>(null)

    // Fetch Teacher ID & Schedules
    const { data: schedules, loading: schedulesLoading } = useFetch<any[]>('/api/teachers/me/schedules', undefined, { initialData: [] })

    // Extract Unique Classes from Schedule
    const myClasses = useMemo(() => {
        const unique = new Map()
        schedules.forEach(s => {
            if (s.class && !unique.has(s.class.id)) {
                unique.set(s.class.id, s.class)
            }
            // Capture teacherId if available in schedule (fallback method)
            if (s.teacherId && !teacherId) {
                setTeacherId(s.teacherId)
            }
        })
        return Array.from(unique.values())
    }, [schedules, teacherId])

    // Modul & Penilaian Hooks
    // Filter modules by teacherId if available.
    const { modulAjarList } = useModulAjar(undefined, teacherId || undefined, undefined, 'ACTIVE')

    // Filter modules by the currently logged in teacher
    const myModules = useMemo(() => {
        if (!teacherId) return []
        return modulAjarList.filter(m => m.guruId === teacherId)
    }, [modulAjarList, teacherId])

    const { create, refetch } = usePenilaianFormatif(undefined, selectedModul)

    // Fetch Students for selected class
    const { data: studentsResponse, loading: studentsLoading } = useFetch<{ data: Student[] }>(
        selectedClassId ? `/api/students?classId=${selectedClassId}&limit=100` : null,
        undefined,
        { initialData: { data: [] } }
    )

    // Handle both direct array and paginated response
    const students = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse?.data || [])

    const selectedModulData = myModules.find(m => m.id === selectedModul)

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
        if (entries.length === 0 || !selectedModul || !selectedClassId) {
            alert('Pilih kelas, modul, dan input penilaian minimal 1 siswa')
            return
        }

        // Ideally we should process in parallel or bulk
        let successCount = 0
        for (const [siswaId, data] of entries) {
            try {
                await create({
                    siswaId,
                    modulAjarId: selectedModul,
                    jenis: selectedJenis,
                    tingkatPencapaian: data.tingkat,
                    catatan: data.catatan
                })
                successCount++
            } catch (e) {
                console.error(e)
            }
        }

        if (successCount > 0) {
            setPenilaianData({})
            refetch()
            alert(`Berhasil menyimpan ${successCount} penilaian!`)
        }
    }

    // Identify which students already have a grade for this module/type today?
    // The `penilaianFormatifList` contains ALL grades for this module.
    // We can show the latest grade in the table for reference.

    if (schedulesLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>

    return (
        <div className="space-y-6">
            {/* Filters / Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Kelas
                        </label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                        >
                            <option value="">Pilih Kelas</option>
                            {myClasses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Modul Ajar
                        </label>
                        <select
                            value={selectedModul}
                            onChange={(e) => setSelectedModul(e.target.value)}
                            disabled={!selectedClassId}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white disabled:opacity-50"
                        >
                            <option value="">Pilih Modul Ajar</option>
                            {myModules.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.namaModul} (Fase {m.fase})
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
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-primary">
                            <BookOpen size={18} />
                            <span className="font-medium">{selectedModulData.namaModul}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1 ml-6">
                            {selectedModulData.cp?.kodeCP} • {selectedModulData.cp?.mataPelajaran?.name}
                        </p>
                    </div>
                )}
            </div>

            {/* Main Content */}
            {selectedClassId && selectedModul ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border-color dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-text-main dark:text-white">
                                Input Penilaian Formatif
                            </h3>
                            <p className="text-sm text-text-secondary">
                                Siswa: {students.length} | Jenis: {selectedJenis}
                            </p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(penilaianData).length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Save size={16} />
                            Simpan Penilaian ({Object.keys(penilaianData).length})
                        </button>
                    </div>

                    {studentsLoading ? (
                        <div className="p-12 flex justify-center"><LoadingSpinner /></div>
                    ) : students.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Tidak ada siswa di kelas ini.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-gray-700/50 border-b border-border-color dark:border-gray-700">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary min-w-[200px]">
                                            Siswa
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary min-w-[400px]">
                                            Tingkat Pencapaian
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary min-w-[200px]">
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                    {students.map((student) => {
                                        // Retrieve existing grade for this student/module (if any)
                                        // Ideally we filter `penilaianFormatifList` by `siswaId` and `activeModule`
                                        // For now, simple implementation
                                        const pending = penilaianData[student.id]

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {student.name.substring(0, 2).toUpperCase()}
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
                                                        {tingkatOptions.map((opt) => {
                                                            const isSelected = pending?.tingkat === opt.value
                                                            return (
                                                                <button
                                                                    key={opt.value}
                                                                    onClick={() => handleTingkatChange(student.id, opt.value)}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSelected
                                                                        ? opt.color + ' ring-2 ring-offset-1 ring-blue-100 dark:ring-offset-gray-800'
                                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                                                                        }`}
                                                                >
                                                                    {opt.value}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={pending?.catatan || ''}
                                                        onChange={(e) => handleCatatanChange(student.id, e.target.value)}
                                                        placeholder="Catatan..."
                                                        className="w-full px-3 py-1.5 text-sm border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <Filter className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-2">
                        Mulai Penilaian
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Silakan pilih <strong>Kelas</strong> dan <strong>Modul Ajar</strong> terlebih dahulu untuk memulai input penilaian formatif.
                    </p>
                </div>
            )}

            {/* History Section could be added here similar to Admin view */}
        </div>
    )
}
