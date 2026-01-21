import { useState, useMemo } from 'react'
import { Calculator, BookOpen, Save } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { usePenilaianSumatif, useModulAjar } from '@/hooks/useKurikulumMerdeka'
import { useFetch } from '@/hooks/useShared'
import type { Student, JenisPenilaianSumatif } from '@/types'

const jenisOptions: { label: string; value: JenisPenilaianSumatif }[] = [
    { label: 'Sumatif Lingkup Materi / Tengah Semester (STS)', value: 'STS' },
    { label: 'Sumatif Akhir Semester (SAS)', value: 'SAS' },
    { label: 'Akhir Tahun', value: 'AKHIR_TAHUN' }
]

export default function TeacherSumatif() {
    // State
    const [selectedClassId, setSelectedClassId] = useState<string>('')
    const [selectedModul, setSelectedModul] = useState<string>('')
    const [selectedJenis, setSelectedJenis] = useState<JenisPenilaianSumatif>('STS')

    // Store numeric inputs. 
    // Structure: { [studentId]: { nilaiTes: number, nilaiNonTes: number, ... } }
    const [penilaianData, setPenilaianData] = useState<Record<string, {
        nilaiTes: string; // Keep as string for input handling
        nilaiNonTes: string;
        nilaiAkhir?: number; // Calculated
    }>>({})

    const [teacherId, setTeacherId] = useState<string | null>(null)

    // Fetch Schedules
    const { data: schedules, loading: schedulesLoading } = useFetch<any[]>('/api/teachers/me/schedules', undefined, { initialData: [] })

    // Extract Unique Classes
    const myClasses = useMemo(() => {
        const unique = new Map()
        schedules.forEach(s => {
            if (s.class && !unique.has(s.class.id)) {
                unique.set(s.class.id, s.class)
            }
            if (s.teacherId && !teacherId) setTeacherId(s.teacherId)
        })
        return Array.from(unique.values())
    }, [schedules, teacherId])

    // Fetch Modules
    const { modulAjarList } = useModulAjar(undefined, teacherId || undefined, undefined, 'ACTIVE')

    const myModules = useMemo(() => {
        if (!teacherId) return []
        return modulAjarList.filter(m => m.guruId === teacherId)
    }, [modulAjarList, teacherId])

    // Hook for Sumatif
    const { create, refetch } = usePenilaianSumatif(undefined, selectedModul)

    // Fetch Students
    const { data: studentsResponse, loading: studentsLoading } = useFetch<{ data: Student[] }>(
        selectedClassId ? `/api/students?classId=${selectedClassId}&limit=100` : null,
        undefined,
        { initialData: { data: [] } }
    )
    const students = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse?.data || [])

    const selectedModulData = myModules.find(m => m.id === selectedModul)

    // Handlers
    const handleScoreChange = (studentId: string, field: 'nilaiTes' | 'nilaiNonTes', value: string) => {
        // Validation: allow only numbers and one decimal point
        if (value && !/^\d*\.?\d*$/.test(value)) return
        if (parseFloat(value) > 100) return

        setPenilaianData(prev => {
            const current = prev[studentId] || { nilaiTes: '', nilaiNonTes: '' }
            const updated = { ...current, [field]: value }

            return { ...prev, [studentId]: updated }
        })
    }

    const calculateAkhir = (tes: string, nonTes: string) => {
        const t = parseFloat(tes) || 0
        const n = parseFloat(nonTes) || 0
        // Using 60:40 ratio as per default backend logic, but ideally displayed
        // If one is missing, maybe just use the other or wait for both?
        // Let's assume weighted average if both exist, or just the one if only one exists?
        // Backend logic: if (tes && nonTes) 0.6*tes + 0.4*nonTes
        // We will mirror this for display
        if (tes && nonTes) return (t * 0.6) + (n * 0.4)
        if (tes) return t
        if (nonTes) return n
        return 0
    }

    const handleSubmit = async () => {
        const entries = Object.entries(penilaianData)
        if (entries.length === 0 || !selectedModul || !selectedClassId) {
            alert('Pilih kelas, modul, dan input nilai minimal 1 siswa')
            return
        }

        let successCount = 0
        for (const [siswaId, data] of entries) {
            // Only submit if at least one score is provided
            if (!data.nilaiTes && !data.nilaiNonTes) continue

            try {
                const nilaiAkhir = calculateAkhir(data.nilaiTes, data.nilaiNonTes)

                await create({
                    siswaId,
                    modulAjarId: selectedModul,
                    jenis: selectedJenis,
                    nilaiTes: data.nilaiTes ? parseFloat(data.nilaiTes) : undefined,
                    nilaiPerformanceTask: data.nilaiNonTes ? parseFloat(data.nilaiNonTes) : undefined,
                    nilaiAkhir,
                    // Tingkat Pencapaian auto-calculated by backend
                })
                successCount++
            } catch (e) {
                console.error(e)
            }
        }

        if (successCount > 0) {
            setPenilaianData({})
            refetch()
            alert(`Berhasil menyimpan ${successCount} data penilaian!`)
        }
    }

    if (schedulesLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>

    return (
        <div className="space-y-6">
            {/* Filters */}
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
                            Jenis Sumatif
                        </label>
                        <select
                            value={selectedJenis}
                            onChange={(e) => setSelectedJenis(e.target.value as JenisPenilaianSumatif)}
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
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex justify-between items-center border border-purple-100 dark:border-purple-800">
                        <div>
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                <BookOpen size={18} />
                                <span className="font-medium">{selectedModulData.namaModul}</span>
                            </div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 ml-6">
                                {selectedModulData.cp?.mataPelajaran?.name}
                            </p>
                        </div>
                        <div className="text-right text-xs text-purple-600 dark:text-purple-400 opacity-70">
                            <div>Bobot Nilai:</div>
                            <div>Tes: 60% | Non-Tes: 40%</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Table */}
            {selectedClassId && selectedModul ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border-color dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-text-main dark:text-white">
                                Input Nilai Sumatif
                            </h3>
                            <p className="text-sm text-text-secondary">
                                Siswa: {students.length}
                            </p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(penilaianData).length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Save size={16} />
                            Simpan Nilai ({Object.keys(penilaianData).length})
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
                                        <th className="px-4 py-3 text-center text-sm font-medium text-text-secondary w-[150px]">
                                            Nilai Tes
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-text-secondary w-[150px]">
                                            Nilai Non-Tes (Projek)
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-text-secondary w-[150px]">
                                            Nilai Akhir
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                    {students.map((student) => {
                                        const pending = penilaianData[student.id] || { nilaiTes: '', nilaiNonTes: '' }
                                        const nilaiAkhir = calculateAkhir(pending.nilaiTes, pending.nilaiNonTes)

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
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
                                                    <input
                                                        type="text"
                                                        value={pending.nilaiTes}
                                                        onChange={(e) => handleScoreChange(student.id, 'nilaiTes', e.target.value)}
                                                        placeholder="0-100"
                                                        className="w-full text-center px-3 py-1.5 text-sm border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-purple-200 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={pending.nilaiNonTes}
                                                        onChange={(e) => handleScoreChange(student.id, 'nilaiNonTes', e.target.value)}
                                                        placeholder="0-100"
                                                        className="w-full text-center px-3 py-1.5 text-sm border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-purple-200 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className={`text-center font-bold ${nilaiAkhir >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {nilaiAkhir > 0 ? nilaiAkhir.toFixed(1) : '-'}
                                                    </div>
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
                    <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-main dark:text-white mb-2">
                        Mulai Penilaian Sumatif
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Pilih <strong>Kelas</strong> dan <strong>Modul Ajar</strong> untuk menginput nilai tes dan non-tes.
                    </p>
                </div>
            )}
        </div>
    )
}
