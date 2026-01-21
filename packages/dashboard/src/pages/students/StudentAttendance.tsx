import { useState, useEffect } from 'react'
import { Calendar, Check, X, Clock, AlertCircle, AlertTriangle, Download, Users, Save, Search, Loader2, FileText, MoreVertical, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatsSummary from '@/components/common/StatsSummary'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ExportAttendanceModal from '@/components/modals/ExportAttendanceModal'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import PermitFormModal from '@/components/modals/PermitFormModal'
import { useAttendanceSummary, useAttendanceRecap, useLowAttendanceStudents } from '@/hooks/useAttendance'
import { usePermits, usePermitStats, usePermitMutations, type Permit, type PermitFormData } from '@/hooks/usePermits'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

type ViewMode = 'daily' | 'monthly' | 'semester' | 'yearly'
type TabMode = 'stats' | 'input' | 'permits'

// Input Interfaces
interface ClassData {
    id: string
    name: string
}

interface Student {
    id: string
    name: string
    nis: string
}

interface AttendanceRecord {
    studentId: string
    status: 'PRESENT' | 'SICK' | 'PERMITTED' | 'ABSENT' | 'LATE'
    notes?: string
}

const TYPE_LABELS: Record<string, string> = {
    SICK: 'Sakit',
    FAMILY: 'Keluarga',
    OFFICIAL: 'Dinas',
    OTHER: 'Lainnya'
}

const TYPE_COLORS: Record<string, string> = {
    SICK: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    FAMILY: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    OFFICIAL: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    OTHER: 'bg-slate-50 text-slate-700 dark:bg-gray-700 dark:text-gray-300'
}

export default function StudentAttendance() {
    const { addToast } = useToast()
    const [activeTab, setActiveTab] = useState<TabMode>('stats')

    // --- Stats State ---
    const [viewMode, setViewMode] = useState<ViewMode>('daily')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(new Date().getMonth() < 6 ? 1 : 2)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)

    // --- Input State ---
    const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0])
    const [classes, setClasses] = useState<ClassData[]>([])
    const [selectedClassId, setSelectedClassId] = useState('')
    const [inputStudents, setInputStudents] = useState<Student[]>([])
    const [inputLoading, setInputLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord['status']>>({})
    const [notesData, setNotesData] = useState<Record<string, string>>({})

    // --- Permits State ---
    const [permitSearch, setPermitSearch] = useState('')
    const [permitTypeFilter, setPermitTypeFilter] = useState('')
    const [permitStatusFilter, setPermitStatusFilter] = useState('')
    const [isPermitFormOpen, setIsPermitFormOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [deletingPermit, setDeletingPermit] = useState<Permit | null>(null)
    const [approvingPermit, setApprovingPermit] = useState<{ permit: Permit, action: 'APPROVED' | 'REJECTED' } | null>(null)

    // --- Stats Hooks ---
    const { data: dailyData, loading: dailyLoading, error: dailyError } = useAttendanceSummary(
        viewMode === 'daily' ? selectedDate : undefined
    )

    const { data: recapData, loading: recapLoading, error: recapError } = useAttendanceRecap(
        viewMode === 'monthly' ? 'monthly' : viewMode === 'semester' ? 'semester' : viewMode === 'yearly' ? 'yearly' : 'monthly',
        selectedYear,
        viewMode === 'monthly' ? selectedMonth : undefined,
        viewMode === 'semester' ? selectedSemester : undefined
    )

    const { data: lowData, loading: lowLoading } = useLowAttendanceStudents(
        60, 'semester', selectedYear, selectedSemester
    )

    // --- Permits Hooks ---
    const { permits, loading: permitsLoading, error: permitsError, refetch: refetchPermits } = usePermits({
        search: permitSearch || undefined,
        type: permitTypeFilter || undefined,
        status: permitStatusFilter || undefined
    })

    const { stats: permitStats } = usePermitStats()
    const { createPermit, updatePermitStatus, deletePermit, exportPermits, loading: mutatingPermit } = usePermitMutations()

    // --- Input Effects ---
    // Fetch Classes on Mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // API returns array directly, not { data: [...] }
                const res = await api.get<ClassData[]>('/api/academic/classes')
                // Handle various response formats
                let classList: ClassData[] = []
                if (Array.isArray(res)) {
                    classList = res
                } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
                    classList = (res as any).data
                }
                setClasses(classList)
                if (classList && classList.length > 0) {
                    setSelectedClassId(classList[0].id)
                }
            } catch (error) {
                console.error('Failed to fetch classes', error)
                addToast('error', 'Gagal memuat daftar kelas')
            }
        }
        fetchClasses()
    }, [])

    // Fetch Students when Class Changes
    useEffect(() => {
        if (!selectedClassId) return

        const fetchStudents = async () => {
            setInputLoading(true)
            try {
                const res = await api.get<{ data: Student[] }>(`/api/students`, {
                    classId: selectedClassId,
                    status: 'ACTIVE',
                    limit: 100
                })
                setInputStudents(res.data)

                // Reset attendance data
                const initialStatus: Record<string, AttendanceRecord['status']> = {}
                res.data.forEach(s => {
                    initialStatus[s.id] = 'PRESENT'
                })
                setAttendanceData(initialStatus)
                setNotesData({})

            } catch (error) {
                console.error('Failed to fetch students', error)
                addToast('error', 'Gagal memuat data siswa')
            } finally {
                setInputLoading(false)
            }
        }

        fetchStudents()
    }, [selectedClassId])

    // --- Input Handlers ---
    const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }))
    }

    const handleNoteChange = (studentId: string, note: string) => {
        setNotesData(prev => ({ ...prev, [studentId]: note }))
    }

    const handleSubmit = async () => {
        if (!selectedClassId || inputStudents.length === 0) return

        setSaving(true)
        try {
            const promises = inputStudents.map(student => {
                const payload = {
                    studentId: student.id,
                    date: inputDate,
                    status: attendanceData[student.id] || 'PRESENT',
                    notes: notesData[student.id] || ''
                }
                return api.post('/api/students/attendance', payload)
            })

            await Promise.all(promises)
            addToast('success', `Berhasil menyimpan presensi untuk ${inputStudents.length} siswa`)
        } catch (error: any) {
            console.error('Failed to save attendance', error)
            addToast('error', error.message || 'Gagal menyimpan data presensi')
        } finally {
            setSaving(false)
        }
    }

    const inputStatusOptions: { value: AttendanceRecord['status']; label: string; color: string }[] = [
        { value: 'PRESENT', label: 'Hadir', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        { value: 'SICK', label: 'Sakit', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { value: 'PERMITTED', label: 'Izin', color: 'bg-amber-100 text-amber-700 border-amber-200' },
        { value: 'ABSENT', label: 'Alpha', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    ]

    // --- Permit Handlers ---
    const handleCreatePermit = async (data: PermitFormData) => {
        const result = await createPermit(data)
        if (result) {
            setIsPermitFormOpen(false)
            refetchPermits()
            addToast('success', 'Izin berhasil diajukan')
        } else {
            addToast('error', 'Gagal mengajukan izin')
        }
    }

    const handleApprovePermit = async () => {
        if (!approvingPermit) return
        const success = await updatePermitStatus(approvingPermit.permit.id, approvingPermit.action)
        if (success) {
            setApprovingPermit(null)
            refetchPermits()
            addToast('success',
                approvingPermit.action === 'APPROVED' ? 'Izin disetujui' : 'Izin ditolak'
            )
        } else {
            addToast('error', 'Gagal mengubah status')
        }
    }

    const handleDeletePermit = async () => {
        if (!deletingPermit) return
        const success = await deletePermit(deletingPermit.id)
        if (success) {
            setDeletingPermit(null)
            refetchPermits()
            addToast('success', 'Perizinan berhasil dihapus')
        } else {
            addToast('error', 'Gagal menghapus')
        }
    }

    const handleExportPermits = async () => {
        const success = await exportPermits({ type: permitTypeFilter, status: permitStatusFilter })
        if (success) {
            addToast('success', 'Export berhasil')
        } else {
            addToast('error', 'Export gagal')
        }
    }

    const permitColumns: Column<Permit>[] = [
        {
            key: 'studentName',
            header: 'Siswa',
            render: (p) => (
                <div>
                    <span className="font-medium text-text-main dark:text-white">{p.studentName}</span>
                    <p className="text-xs text-text-secondary">{p.studentNis}</p>
                </div>
            )
        },
        { key: 'className', header: 'Kelas' },
        {
            key: 'type',
            header: 'Jenis',
            render: (p) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[p.type]}`}>
                    {TYPE_LABELS[p.type]}
                </span>
            ),
        },
        {
            key: 'startDate',
            header: 'Mulai',
            render: (p) => new Date(p.startDate).toLocaleDateString('id-ID')
        },
        {
            key: 'endDate',
            header: 'Selesai',
            render: (p) => new Date(p.endDate).toLocaleDateString('id-ID')
        },
        {
            key: 'reason',
            header: 'Alasan',
            render: (p) => (
                <span className="max-w-xs truncate block" title={p.reason}>{p.reason}</span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (p) => (
                <StatusBadge
                    status={p.status === 'APPROVED' ? 'success' : p.status === 'PENDING' ? 'pending' : 'error'}
                    label={p.status === 'APPROVED' ? 'Disetujui' : p.status === 'PENDING' ? 'Menunggu' : 'Ditolak'}
                />
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (p) => (
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === p.id ? null : p.id)
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <MoreVertical size={16} className="text-text-secondary" />
                    </button>
                    {activeDropdown === p.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-color dark:border-gray-700 py-1 z-10">
                            {p.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setApprovingPermit({ permit: p, action: 'APPROVED' })
                                            setActiveDropdown(null)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-emerald-600"
                                    >
                                        <CheckCircle size={14} /> Setujui
                                    </button>
                                    <button
                                        onClick={() => {
                                            setApprovingPermit({ permit: p, action: 'REJECTED' })
                                            setActiveDropdown(null)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-rose-600"
                                    >
                                        <XCircle size={14} /> Tolak
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    setDeletingPermit(p)
                                    setActiveDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 text-rose-500"
                            >
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ]

    const permitStatsItems = [
        { label: 'Total Perizinan', value: permitStats.total.toString(), icon: FileText, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
        { label: 'Disetujui', value: permitStats.approved.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Menunggu', value: permitStats.pending.toString(), icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Ditolak', value: permitStats.rejected.toString(), icon: X, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ]

    // --- Render Helpers ---
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const stats = dailyData ? [
        { label: 'Hadir', value: dailyData.summary.present.toString(), icon: Check, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Izin', value: dailyData.summary.permitted.toString(), icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Sakit', value: dailyData.summary.sick.toString(), icon: AlertCircle, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
        { label: 'Alpha', value: dailyData.summary.absent.toString(), icon: X, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
    ] : []

    const loading = viewMode === 'daily' ? dailyLoading : recapLoading
    const error = viewMode === 'daily' ? dailyError : recapError

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kehadiran Siswa"
                subtitle={activeTab === 'stats' ? `Data kehadiran siswa - ${today}` : "Input absensi harian per kelas"}
                breadcrumb={[
                    { label: 'Manajemen Siswa', path: '/students' },
                    { label: 'Kehadiran Siswa' },
                ]}
                actions={

                    activeTab === 'stats' ? (
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    ) : activeTab === 'permits' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPermits}
                                className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Download size={18} />
                                Export
                            </button>
                            <button
                                onClick={() => setIsPermitFormOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <FileText size={18} />
                                Ajukan Izin
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving || inputLoading || inputStudents.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Simpan Presensi
                        </button>
                    )
                }
            />

            {/* Main Tabs */}
            <div className="border-b border-border-color dark:border-gray-700">
                <nav className="flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === 'stats'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        `}
                    >
                        Rekap & Statistik
                    </button>
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === 'input'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        `}
                    >
                        Input Absensi Manual
                    </button>
                    <button
                        onClick={() => setActiveTab('permits')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === 'permits'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        `}
                    >
                        Perizinan
                    </button>
                </nav>
            </div>

            {/* === STATS VIEW === */}
            {
                activeTab === 'stats' && (
                    <div className="space-y-6">
                        {/* View Mode Tabs */}
                        <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl border border-border-color dark:border-gray-700">
                            {(['daily', 'monthly', 'semester', 'yearly'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === mode
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {mode === 'daily' ? 'Harian' : mode === 'monthly' ? 'Bulanan' : mode === 'semester' ? 'Semester' : 'Tahunan'}
                                </button>
                            ))}
                        </div>

                        {/* Date/Period Selector */}
                        <div className="flex flex-wrap gap-4 items-center">
                            {viewMode === 'daily' && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-text-secondary" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                    />
                                </div>
                            )}
                            {/* ... (Keep existing selectors logic here) ... */}
                            {(viewMode === 'monthly' || viewMode === 'semester' || viewMode === 'yearly') && (
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                >
                                    {[2024, 2025, 2026].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            )}
                            {viewMode === 'monthly' && (
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i).toLocaleDateString('id-ID', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {viewMode === 'semester' && (
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(parseInt(e.target.value) as 1 | 2)}
                                    className="px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                >
                                    <option value={1}>Semester 1</option>
                                    <option value={2}>Semester 2</option>
                                </select>
                            )}
                        </div>

                        {loading && <LoadingSpinner fullPage text="Memuat data kehadiran..." />}
                        {error && <ErrorState message={error} />}

                        {!loading && !error && (
                            <>
                                {viewMode === 'daily' && dailyData && (
                                    <>
                                        <StatsSummary items={stats} />
                                        {/* Attendance by Class Table */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                                            <div className="p-4 border-b border-border-color dark:border-gray-700">
                                                <h3 className="font-semibold text-text-main dark:text-white">Kehadiran per Kelas</h3>
                                            </div>
                                            {dailyData.byClass.length === 0 ? (
                                                <div className="p-8 text-center text-text-secondary">
                                                    Belum ada data kehadiran untuk tanggal ini
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-slate-50 dark:bg-gray-700/50">
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Kelas</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Hadir</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Sakit</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Izin</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Alpha</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Total</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Persentase</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                                            {dailyData.byClass.map((row) => {
                                                                const percentage = row.total > 0 ? Math.round((row.present / row.total) * 100) : 0
                                                                return (
                                                                    <tr key={row.classId} className="hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                                                        <td className="px-4 py-4 font-medium text-text-main dark:text-white">{row.className}</td>
                                                                        <td className="px-4 py-4 text-center">
                                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-sm font-medium">{row.present}</span>
                                                                        </td>
                                                                        <td className="px-4 py-4 text-center">
                                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-sm font-medium">{row.sick}</span>
                                                                        </td>
                                                                        <td className="px-4 py-4 text-center">
                                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 text-sm font-medium">{row.permitted}</span>
                                                                        </td>
                                                                        <td className="px-4 py-4 text-center">
                                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 text-sm font-medium">{row.absent}</span>
                                                                        </td>
                                                                        <td className="px-4 py-4 text-center text-text-main dark:text-white font-medium">{row.total}</td>
                                                                        <td className="px-4 py-4">
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <div className="w-20 h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                                    <div className={`h-full rounded-full ${percentage >= 90 ? 'bg-emerald-500' : percentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${percentage}%` }} />
                                                                                </div>
                                                                                <span className="text-sm font-medium text-text-main dark:text-white">{percentage}%</span>
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
                                    </>
                                )}
                                {viewMode !== 'daily' && recapData && (
                                    <>
                                        {/* Period Info */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-text-main dark:text-white">{recapData.period}</h3>
                                                    <p className="text-sm text-text-secondary">{recapData.startDate} - {recapData.endDate}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-primary">{recapData.totalStudents}</p>
                                                        <p className="text-xs text-text-secondary">Total Siswa</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-rose-500">{recapData.lowAttendanceCount}</p>
                                                        <p className="text-xs text-text-secondary">Kehadiran Rendah</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recap Table */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                                            <div className="p-4 border-b border-border-color dark:border-gray-700">
                                                <h3 className="font-semibold text-text-main dark:text-white">Rekap Kehadiran Siswa</h3>
                                            </div>
                                            {recapData.students.length === 0 ? (
                                                <EmptyState title="Belum ada data" description="Tidak ada data kehadiran untuk periode ini" />
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-slate-50 dark:bg-gray-700/50">
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Siswa</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Kelas</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Hadir</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Sakit</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Izin</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Alpha</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">%</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                                            {recapData.students.map((student) => (
                                                                <tr key={student.studentId} className={`hover:bg-slate-50 dark:hover:bg-gray-700/50 ${student.isLowAttendance ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''}`}>
                                                                    <td className="px-4 py-4">
                                                                        <div>
                                                                            <p className="font-medium text-text-main dark:text-white">{student.studentName}</p>
                                                                            <p className="text-xs text-text-secondary">{student.nis}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-text-secondary">{student.className}</td>
                                                                    <td className="px-4 py-4 text-center text-emerald-600 font-medium">{student.present}</td>
                                                                    <td className="px-4 py-4 text-center text-blue-600">{student.sick}</td>
                                                                    <td className="px-4 py-4 text-center text-amber-600">{student.permitted}</td>
                                                                    <td className="px-4 py-4 text-center text-rose-600">{student.absent}</td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        <span className={`font-bold ${student.percentage >= 80 ? 'text-emerald-600' : student.percentage >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                                            {student.percentage}%
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        {student.isLowAttendance ? (
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-xs font-medium rounded-full">
                                                                                <AlertTriangle size={12} />
                                                                                Perlu Perhatian
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-medium rounded-full">
                                                                                <Check size={12} />
                                                                                Baik
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Low Attendance Warning */}
                                {!lowLoading && lowData && lowData.totalStudents > 0 && (
                                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800 p-6">
                                        {/* ... content ... */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                                                <AlertTriangle size={24} className="text-rose-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-1">
                                                    Peringatan Kehadiran Rendah
                                                </h3>
                                                <p className="text-sm text-rose-700 dark:text-rose-300 mb-4">
                                                    Terdapat <strong>{lowData.totalStudents} siswa</strong> dengan kehadiran di bawah {lowData.threshold}% pada semester ini.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {lowData.students.slice(0, 5).map((s) => (
                                                        <span key={s.studentId} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-rose-200 dark:border-rose-700 rounded-lg text-sm">
                                                            <Users size={14} className="text-rose-500" />
                                                            <span className="font-medium text-text-main dark:text-white">{s.studentName}</span>
                                                            <span className="text-rose-600 font-bold">{s.percentage}%</span>
                                                        </span>
                                                    ))}
                                                    {lowData.students.length > 5 && (
                                                        <span className="text-sm text-rose-600 font-medium self-center">
                                                            +{lowData.students.length - 5} siswa lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )
            }

            {/* === INPUT VIEW === */}
            {
                activeTab === 'input' && (
                    <div className="space-y-6">
                        {/* Controls */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex flex-wrap items-end gap-4">
                            <div className="space-y-1.5 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-text-secondary">Tanggal Presensi</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                    <input
                                        type="date"
                                        value={inputDate}
                                        onChange={(e) => setInputDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-text-secondary">Pilih Kelas</label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                >
                                    <option value="" disabled>-- Pilih Kelas --</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-border-color dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-700/50">
                                <h3 className="font-semibold text-text-main dark:text-white flex items-center gap-2">
                                    <Search size={18} />
                                    Daftar Siswa
                                </h3>
                                <div className="text-sm text-text-secondary">
                                    Total: <strong>{inputStudents.length}</strong> Siswa
                                </div>
                            </div>

                            {inputLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-primary">
                                    <Loader2 className="animate-spin mb-2" size={32} />
                                    <span className="text-sm font-medium">Memuat data siswa...</span>
                                </div>
                            ) : inputStudents.length === 0 ? (
                                <div className="p-12 text-center text-text-secondary">
                                    <p>Tidak ada siswa di kelas ini atau kelas belum dipilih.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border-color dark:border-gray-700">
                                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider w-16">No</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Nama Siswa</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-text-secondary uppercase tracking-wider w-[400px]">Status Kehadiran</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                            {inputStudents.map((student, index) => (
                                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-text-secondary text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-text-main dark:text-white">{student.name}</span>
                                                            <span className="text-xs text-text-secondary">{student.nis}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            {inputStatusOptions.map((option) => (
                                                                <label
                                                                    key={option.value}
                                                                    className={`
                                                                    cursor-pointer px-3 py-1.5 rounded-md border text-sm font-medium transition-all
                                                                    ${attendanceData[student.id] === option.value
                                                                            ? option.color + ' ring-1 ring-offset-1 ring-offset-white dark:ring-offset-gray-800'
                                                                            : 'bg-white dark:bg-gray-800 text-text-secondary border-border-color dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700'}
                                                                `}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`status-${student.id}`}
                                                                        value={option.value}
                                                                        checked={attendanceData[student.id] === option.value}
                                                                        onChange={() => handleStatusChange(student.id, option.value)}
                                                                        className="sr-only"
                                                                    />
                                                                    {option.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Keterangan (opsional)"
                                                            value={notesData[student.id] || ''}
                                                            onChange={(e) => handleNoteChange(student.id, e.target.value)}

                                                            className="w-full px-3 py-1.5 text-sm border border-border-color dark:border-gray-600 rounded-md bg-transparent focus:ring-1 focus:ring-primary focus:border-primary"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* === PERMITS VIEW === */}
            {
                activeTab === 'permits' && (
                    <div className="space-y-6">
                        <StatsSummary items={permitStatsItems} />

                        <FilterBar
                            searchPlaceholder="Cari nama siswa..."
                            onSearch={setPermitSearch}
                            filters={[
                                {
                                    label: 'Semua Jenis',
                                    value: permitTypeFilter,
                                    onChange: setPermitTypeFilter,
                                    options: [
                                        { label: 'Sakit', value: 'SICK' },
                                        { label: 'Keluarga', value: 'FAMILY' },
                                        { label: 'Dinas', value: 'OFFICIAL' },
                                        { label: 'Lainnya', value: 'OTHER' },
                                    ],
                                },
                                {
                                    label: 'Semua Status',
                                    value: permitStatusFilter,
                                    onChange: setPermitStatusFilter,
                                    options: [
                                        { label: 'Disetujui', value: 'APPROVED' },
                                        { label: 'Menunggu', value: 'PENDING' },
                                        { label: 'Ditolak', value: 'REJECTED' },
                                    ],
                                },
                            ]}
                        />

                        {permitsLoading ? <LoadingSpinner fullPage text="Memuat data perizinan..." /> :
                            permitsError ? <ErrorState message={permitsError} onRetry={refetchPermits} /> : (
                                <DataTable
                                    columns={permitColumns}
                                    data={permits}
                                    onView={() => { }}
                                    currentPage={1}
                                    totalPages={1}
                                    totalItems={permits.length}
                                />
                            )}

                        {/* Modals */}
                        <PermitFormModal
                            isOpen={isPermitFormOpen}
                            onClose={() => setIsPermitFormOpen(false)}
                            onSubmit={handleCreatePermit}
                            isLoading={mutatingPermit}
                        />

                        <ConfirmationModal
                            isOpen={!!approvingPermit}
                            onClose={() => setApprovingPermit(null)}
                            onConfirm={handleApprovePermit}
                            title={approvingPermit?.action === 'APPROVED' ? 'Setujui Perizinan' : 'Tolak Perizinan'}
                            message={`Apakah Anda yakin ingin ${approvingPermit?.action === 'APPROVED' ? 'menyetujui' : 'menolak'} perizinan untuk ${approvingPermit?.permit.studentName}?`}
                            confirmLabel={approvingPermit?.action === 'APPROVED' ? 'Setujui' : 'Tolak'}
                            variant={approvingPermit?.action === 'APPROVED' ? 'info' : 'danger'}
                        />

                        <ConfirmationModal
                            isOpen={!!deletingPermit}
                            onClose={() => setDeletingPermit(null)}
                            onConfirm={handleDeletePermit}
                            title="Hapus Perizinan"
                            message={`Apakah Anda yakin ingin menghapus perizinan ${deletingPermit?.studentName}?`}
                            confirmLabel="Hapus"
                            variant="danger"
                        />
                    </div>
                )
            }

            {/* Export Modal */}
            <ExportAttendanceModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />
        </div >
    )
}
