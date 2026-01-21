import { useAuthContext } from '../../contexts/AuthContext'
import { useSchoolProfile } from '../../hooks/useSettings'
import {
    CalendarDays,
    BookOpen,
    Trophy,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    FileText,
    MapPin,
    Phone,
    Mail,
    Globe,
    Building2,
    Loader2,
    Megaphone,
    Info
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSchedules } from '../../hooks/useSchedules'
import { useCalendar } from '../../hooks/useCalendar'
import { useAssignments } from '../../hooks/useLMS'
import { useFetch } from '../../hooks/useShared'
import { useAnnouncements } from '../../hooks/useCommunication'
import { api } from '../../lib/api'
import { useState, useEffect } from 'react'
import type { Student } from '../../types'

interface AttendanceRecord {
    id: string
    status: string
    date: string
}

export default function StudentDashboard() {
    const { user } = useAuthContext()
    const { school, loading: schoolLoading } = useSchoolProfile()

    // Fetch Student Info to get Class ID
    const { data: studentResponse } = useFetch<{ data: Student[] }>(user?.email ? `/api/students?email=${user.email}` : undefined)
    const studentRecord = studentResponse?.data?.[0]
    const activeEnrollment = studentRecord?.classEnrollments?.find(e => e.status === 'ACTIVE')
    const classId = activeEnrollment?.classId

    // Fetch Attendance for this semester (last 30 days for now)
    const [attendanceStats, setAttendanceStats] = useState({ present: 0, total: 0, absent: 0 })
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!studentRecord?.id) return
            try {
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - 30)

                const res = await api.get<AttendanceRecord[]>('/api/students/me/attendance', {
                    startDate: startDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }),
                    endDate: endDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
                })
                const records = Array.isArray(res) ? res : (res as any).data || []
                const present = records.filter((r: AttendanceRecord) => r.status === 'PRESENT' || r.status === 'LATE').length
                const absent = records.filter((r: AttendanceRecord) => r.status === 'ABSENT').length
                setAttendanceStats({ present, total: records.length, absent })
            } catch (error) {
                console.error('Failed to fetch attendance', error)
            }
        }
        fetchAttendance()
    }, [studentRecord?.id])

    const attendancePercentage = attendanceStats.total > 0
        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
        : 100

    // Fetch Schedule
    const today = new Date().getDay()
    const { schedules, loading: scheduleLoading } = useSchedules(classId || undefined, today)

    // Fetch Calendar
    const { events } = useCalendar()
    const upcomingEvents = events
        .filter(e => new Date(e.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3)

    // Fetch Announcements (published, targeting ALL or STUDENTS)
    const { announcements, loading: announcementsLoading } = useAnnouncements({ status: 'PUBLISHED' })
    // Handle both array and { data: [...] } response formats
    const announcementsList = Array.isArray(announcements) ? announcements : (announcements as any)?.data || []
    const recentAnnouncements = announcementsList
        .filter((a: any) => a.target === 'ALL' || a.target === 'STUDENTS')
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    // Fetch Assignments
    const { assignments: allAssignments, loading: assignmentsLoading } = useAssignments(
        studentRecord?.id ? { studentId: studentRecord.id, classId: classId } : undefined
    )

    // Filter Pending and Overdue
    const pendingAssignments = allAssignments
        .filter(a => {
            const submission = a.submissions?.find(s => s.studentId === studentRecord?.id)
            const status = submission?.status
            if (status === 'SUBMITTED' || status === 'GRADED' || status === 'LATE') return false
            return true
        })
        .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())

    // Count overdue assignments (past due date and not submitted)
    const overdueAssignments = pendingAssignments.filter(a => {
        if (!a.dueDate) return false
        return new Date(a.dueDate) < new Date()
    })

    const completedCount = allAssignments.filter(a => {
        const submission = a.submissions?.find(s => s.studentId === studentRecord?.id)
        return submission?.status === 'GRADED'
    }).length

    // Calculate Violation Points: +10 per absent, +5 per overdue assignment
    const violationPoints = (attendanceStats.absent * 10) + (overdueAssignments.length * 5)
    const violationStatus = violationPoints === 0 ? 'Aman' : violationPoints < 30 ? 'Perlu Perhatian' : 'Bahaya'

    return (
        <div className="space-y-6 pb-24 md:pb-8">
            {/* Hero Section - Full width and full top on mobile with animations */}
            <div
                className="relative overflow-hidden rounded-none md:rounded-3xl shadow-xl animate-fade-in"
                style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    marginLeft: '-1rem',
                    marginRight: '-1rem',
                    marginTop: '0'
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: "url('/images/school-hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent" />

                <div className="relative px-6 pt-24 pb-12 sm:px-8 sm:pt-28 md:px-12 md:py-20 text-white">
                    <h1
                        className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight"
                        style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
                    >
                        Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">{user?.name?.split(' ')[0] || 'Siswa'}</span>! 👋
                    </h1>
                    <p
                        className="text-blue-100/90 text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-medium"
                        style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                    >
                        Selamat datang kembali di <span className="font-bold text-white">{school?.name || 'Portal Siswa'}</span>.
                        {assignmentsLoading ? (
                            <span className="text-blue-200 animate-pulse"> Memuat tugas...</span>
                        ) : pendingAssignments.length > 0 ? (
                            <span className="block mt-2">
                                Kamu memiliki <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">{pendingAssignments.length} tugas</span> yang harus dikumpulkan.
                            </span>
                        ) : (
                            <span className="block mt-2 text-emerald-300 font-semibold"> Semua tugas sudah selesai! 🎉</span>
                        )}
                    </p>
                    <div
                        className="flex flex-wrap gap-2 md:gap-3 mt-4"
                        style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
                    >
                        <Link
                            to="/student-portal/assignments"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <FileText size={16} /> Lihat Tugas
                        </Link>
                        <Link
                            to="/student-portal/schedule"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <CalendarDays size={16} /> Jadwal Hari Ini
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content wrapper with padding for mobile */}
            <div className="px-4 md:px-0 space-y-6">
                {/* School Profile Card */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
                >
                    <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">Profil Sekolah</h2>
                    {schoolLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ) : school ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                {school.logo && (
                                    <img src={school.logo} alt={school.name} className="w-16 h-16 rounded-lg object-cover" />
                                )}
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">{school.name}</h3>
                                    <p className="text-sm text-text-secondary">NPSN: {school.npsn}</p>
                                </div>
                                <p className="text-sm text-text-secondary flex items-start gap-2">
                                    <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                                    {school.address}, {school.city}, {school.province}
                                </p>
                            </div>
                            <div className="space-y-2">
                                {school.phone && (
                                    <p className="text-sm text-text-secondary flex items-center gap-2">
                                        <Phone size={16} className="text-primary" /> {school.phone}
                                    </p>
                                )}
                                {school.email && (
                                    <p className="text-sm text-text-secondary flex items-center gap-2">
                                        <Mail size={16} className="text-primary" /> {school.email}
                                    </p>
                                )}
                                {school.website && (
                                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-2 hover:underline">
                                        <Globe size={16} /> {school.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-text-secondary">Data profil sekolah tidak tersedia.</p>
                    )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Kehadiran */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 ${attendancePercentage >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'} rounded-lg`}>
                                <CheckCircle size={20} />
                            </div>
                            <span className={`text-xs font-medium ${attendancePercentage >= 80 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'} px-2 py-0.5 rounded-full`}>
                                {attendanceStats.total > 0 ? `${attendanceStats.present}/${attendanceStats.total}` : '30 Hari'}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Kehadiran</p>
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">{attendancePercentage}%</h3>
                    </div>

                    {/* Tugas */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                <BookOpen size={20} />
                            </div>
                            <span className={`text-xs font-medium ${overdueAssignments.length > 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'} px-2 py-0.5 rounded-full`}>
                                {overdueAssignments.length > 0 ? `${overdueAssignments.length} Terlewat` : `${pendingAssignments.length} Pending`}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Tugas Selesai</p>
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">{completedCount}/{allAssignments.length}</h3>
                    </div>

                    {/* Total Mata Pelajaran (Replace IPK) */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Trophy size={20} />
                            </div>
                            <span className="text-xs font-medium text-text-secondary bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Semester Ini</span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Jadwal Aktif</p>
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">{schedules.length} Mapel</h3>
                    </div>

                    {/* Poin Pelanggaran */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-lg ${violationPoints === 0
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                : violationPoints < 30
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                                }`}>
                                <AlertCircle size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${violationPoints === 0
                                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                                : violationPoints < 30
                                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                                    : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
                                }`}>
                                {violationStatus}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Poin Pelanggaran</p>
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">{violationPoints}</h3>
                        {violationPoints > 0 && (
                            <p className="text-xs text-text-secondary mt-1">
                                {attendanceStats.absent > 0 && `${attendanceStats.absent}x absen (${attendanceStats.absent * 10})`}
                                {attendanceStats.absent > 0 && overdueAssignments.length > 0 && ' + '}
                                {overdueAssignments.length > 0 && `${overdueAssignments.length}x tugas (${overdueAssignments.length * 5})`}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Schedule Card */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="text-primary" size={24} />
                                <h2 className="text-xl font-bold text-text-main dark:text-white">Jadwal Hari Ini</h2>
                            </div>
                            <Link to="/student/schedule" className="text-sm font-medium text-primary hover:text-blue-700 flex items-center gap-1">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {scheduleLoading ? (
                                <div className="p-4 text-center text-slate-500">
                                    <Loader2 className="animate-spin inline-block mr-2" size={16} /> Memuat jadwal...
                                </div>
                            ) : !classId ? (
                                <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-300 dark:border-slate-700">
                                    <p>Kamu belum terdaftar di kelas manapun.</p>
                                </div>
                            ) : schedules.length > 0 ? (
                                schedules.map((item, idx) => (
                                    <div key={idx} className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50 border border-slate-100 dark:border-gray-700">
                                        <div className="min-w-[100px] text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                            <p className="text-sm font-bold text-text-main dark:text-white">{item.startTime}</p>
                                            <p className="text-xs text-text-secondary dark:text-gray-400">{item.endTime}</p>
                                        </div>
                                        <div className="ml-6 border-l-2 border-primary/20 pl-6">
                                            <h3 className="font-bold text-text-main dark:text-white">{item.subject?.name}</h3>
                                            <p className="text-sm text-text-secondary dark:text-gray-400 flex items-center gap-1 mt-1">
                                                <Building2 size={14} /> {item.room || '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-300 dark:border-slate-700">
                                    <p>Tidak ada jadwal pelajaran hari ini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignments & Announcements Column */}
                    <div className="space-y-6">
                        {/* Assignments Widget */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-amber-500" /> Tenggat Terdekat
                            </h2>
                            <div className="space-y-3">
                                {assignmentsLoading ? (
                                    <p className="text-sm text-text-secondary">Memuat tugas...</p>
                                ) : pendingAssignments.length > 0 ? (
                                    pendingAssignments.slice(0, 3).map((task, idx) => (
                                        <div key={idx} className="p-3 rounded-lg border border-border-color dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-1">{task.title}</h4>
                                                    <p className="text-xs text-text-secondary">{task.subject?.name || 'Mapel'}</p>
                                                </div>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-md ${new Date(task.dueDate || '').getTime() < Date.now() ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-text-secondary">Tidak ada tugas mendesak.</p>
                                )}
                                <Link to="/student/assignments" className="block text-center text-sm text-text-secondary hover:text-primary mt-2">
                                    {pendingAssignments.length > 3 ? `+ ${pendingAssignments.length - 3} tugas lainnya` : 'Lihat Semua'}
                                </Link>
                            </div>
                        </div>

                        {/* Calendar Widget */}
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-start gap-3">
                                <CalendarDays className="mt-1 shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-bold mb-3">Kalender Akademik</h3>
                                    {upcomingEvents.length > 0 ? (
                                        <div className="space-y-3">
                                            {upcomingEvents.map(evt => (
                                                <div key={evt.id} className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                                    <p className="font-medium text-sm">{evt.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-blue-100 bg-white/20 px-1.5 py-0.5 rounded">
                                                            {new Date(evt.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                        {evt.type === 'HOLIDAY' && (
                                                            <span className="text-[10px] text-red-100 bg-red-500/40 px-1.5 py-0.5 rounded">Libur</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-blue-100">Belum ada agenda terdekat.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Panel - Student Announcements */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-main dark:text-white">Informasi Sekolah</h2>
                                <p className="text-sm text-text-secondary">Pengumuman dan informasi terbaru</p>
                            </div>
                        </div>
                        <Link to="/student/announcements" className="text-sm font-medium text-primary hover:text-blue-700 flex items-center gap-1">
                            Lihat Semua <ChevronRight size={16} />
                        </Link>
                    </div>

                    {announcementsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                    ) : recentAnnouncements.length > 0 ? (
                        <div className="space-y-4">
                            {recentAnnouncements.map(announcement => (
                                <div
                                    key={announcement.id}
                                    className="p-4 rounded-xl border border-border-color dark:border-gray-700 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${announcement.type === 'URGENT'
                                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                                            : announcement.type === 'EXAM'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                                : announcement.type === 'MEETING'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                            }`}>
                                            <Info size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                                    {announcement.title}
                                                </h4>
                                                {announcement.type === 'URGENT' && (
                                                    <span className="text-[10px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded-full shrink-0">
                                                        PENTING
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                                                {announcement.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-text-secondary">
                                                <span>{new Date(announcement.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                {announcement.author && (
                                                    <span className="text-primary">• {announcement.author.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-text-secondary">
                            <Megaphone size={48} className="mx-auto mb-3 text-slate-300" />
                            <p>Belum ada pengumuman terbaru.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
