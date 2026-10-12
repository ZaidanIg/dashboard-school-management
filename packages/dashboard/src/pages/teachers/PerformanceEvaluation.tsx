import { useState, useMemo } from 'react'
import { Star, TrendingUp, Award, FileText, Plus, X, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import { useFetch } from '@/hooks/useShared'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

interface PerformanceItem {
    id: string
    teacherId: string
    name: string
    nip?: string
    subject: string
    attendance: number
    teaching: number
    admin: number
    social: number
    total: number
    grade: string
    notes?: string | null
    evaluatedBy?: string | null
    hasRecord?: boolean
}

interface PerformanceResponse {
    data: PerformanceItem[]
    stats: {
        averageScore: string
        gradeA: number
        gradeB: number
        needGuidance: number
    }
}

const gradeColors: Record<string, string> = {
    'A': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'B': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'C': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'D': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

export default function PerformanceEvaluation() {
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [gradeFilter, setGradeFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form state
    const [selectedTeacherId, setSelectedTeacherId] = useState('')
    const [attendanceScore, setAttendanceScore] = useState(90)
    const [teachingScore, setTeachingScore] = useState(85)
    const [professionalScore, setProfessionalScore] = useState(85)
    const [socialScore, setSocialScore] = useState(85)
    const [notes, setNotes] = useState('')

    // Fetch dynamic performance data
    const { data, loading, error, refetch } = useFetch<PerformanceResponse>(
        '/api/teachers/performance',
        search ? { search } : undefined
    )

    const performances = data?.data || []
    const backendStats = data?.stats

    // Filter by grade
    const filteredData = useMemo(() => {
        if (!gradeFilter) return performances
        return performances.filter(p => p.grade === gradeFilter)
    }, [performances, gradeFilter])

    const statsItems = [
        {
            label: 'Rata-rata Kinerja',
            value: backendStats?.averageScore || '0',
            icon: TrendingUp,
            iconBg: 'bg-blue-50 dark:bg-blue-900/30',
            iconColor: 'text-primary'
        },
        {
            label: 'Grade A',
            value: (backendStats?.gradeA ?? 0).toString(),
            icon: Star,
            iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
            iconColor: 'text-emerald-600'
        },
        {
            label: 'Grade B',
            value: (backendStats?.gradeB ?? 0).toString(),
            icon: Award,
            iconBg: 'bg-amber-50 dark:bg-amber-900/30',
            iconColor: 'text-amber-600'
        },
        {
            label: 'Perlu Pembinaan',
            value: (backendStats?.needGuidance ?? 0).toString(),
            icon: FileText,
            iconBg: 'bg-rose-50 dark:bg-rose-900/30',
            iconColor: 'text-rose-600'
        },
    ]

    const columns: Column<PerformanceItem>[] = [
        {
            key: 'name',
            header: 'Nama Guru',
            render: (p) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <span className="font-medium text-slate-900 dark:text-white block">{p.name}</span>
                        {p.nip && <span className="text-[11px] text-slate-400">NIP: {p.nip}</span>}
                    </div>
                </div>
            ),
        },
        { key: 'subject', header: 'Mata Pelajaran' },
        { key: 'attendance', header: 'Kehadiran', render: (p) => `${p.attendance}%` },
        { key: 'teaching', header: 'Pengajaran', render: (p) => `${p.teaching}%` },
        { key: 'admin', header: 'Administrasi', render: (p) => `${p.admin}%` },
        {
            key: 'total',
            header: 'Total Nilai',
            render: (p) => <span className="font-bold text-slate-900 dark:text-white">{p.total}%</span>,
        },
        {
            key: 'grade',
            header: 'Grade',
            render: (p) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${gradeColors[p.grade] || gradeColors.B}`}>
                    {p.grade}
                </span>
            ),
        },
    ]

    const handleOpenModal = (teacherId?: string) => {
        setSelectedTeacherId(teacherId || (performances[0]?.teacherId || ''))
        setAttendanceScore(90)
        setTeachingScore(85)
        setProfessionalScore(85)
        setSocialScore(85)
        setNotes('')
        setIsModalOpen(true)
    }

    const handleSubmitEvaluation = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTeacherId) {
            toast.error('Pilih guru terlebih dahulu')
            return
        }

        setSubmitting(true)
        try {
            await api.post(`/api/teachers/${selectedTeacherId}/performance`, {
                teachingScore: Number(teachingScore),
                attendanceScore: Number(attendanceScore),
                professionalScore: Number(professionalScore),
                socialScore: Number(socialScore),
                notes
            })
            toast.success('Penilaian berhasil disimpan!')
            setIsModalOpen(false)
            refetch()
        } catch (err: any) {
            toast.error(err.message || 'Gagal menyimpan penilaian')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading && !data) {
        return <LoadingSpinner fullPage text="Memuat data evaluasi kinerja..." />
    }

    if (error && !data) {
        return <ErrorState message={error} onRetry={refetch} />
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Evaluasi Kinerja"
                subtitle="Evaluasi kinerja pengajaran, kehadiran, dan administrasi guru"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: 'Evaluasi Kinerja' },
                ]}
                actions={
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
                    >
                        <Plus size={16} />
                        Input Penilaian
                    </button>
                }
            />

            <StatsSummary items={statsItems} />

            <FilterBar
                searchPlaceholder="Cari nama guru..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Grade',
                        value: gradeFilter,
                        options: [
                            { label: 'Semua Grade', value: '' },
                            { label: 'Grade A', value: 'A' },
                            { label: 'Grade B', value: 'B' },
                            { label: 'Grade C', value: 'C' },
                            { label: 'Grade D', value: 'D' },
                        ],
                        onChange: (val) => setGradeFilter(val)
                    },
                ]}
            />

            <DataTable
                columns={columns}
                data={filteredData}
                onView={(p) => handleOpenModal(p.teacherId)}
                totalItems={filteredData.length}
            />

            {/* Modal Input Penilaian */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Input Penilaian Kinerja Guru
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEvaluation} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                    Pilih Guru
                                </label>
                                <select
                                    value={selectedTeacherId}
                                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {performances.map((p) => (
                                        <option key={p.teacherId} value={p.teacherId}>
                                            {p.name} ({p.subject})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                        Kehadiran (0 - 100)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={attendanceScore}
                                        onChange={(e) => setAttendanceScore(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                        Pengajaran (0 - 100)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={teachingScore}
                                        onChange={(e) => setTeachingScore(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                        Administrasi (0 - 100)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={professionalScore}
                                        onChange={(e) => setProfessionalScore(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                        Sosial & Etika (0 - 100)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={socialScore}
                                        onChange={(e) => setSocialScore(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                                    Catatan / Rekomendasi
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Catatan evaluasi pembinaan guru..."
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                                >
                                    {submitting && <Loader2 size={15} className="animate-spin" />}
                                    Simpan Penilaian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
