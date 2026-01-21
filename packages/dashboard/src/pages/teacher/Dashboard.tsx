
import { useAuthContext } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
    Calendar,
    BookOpen,
    Users,
    Clock,
    CheckCircle,
    ChevronRight,
    TrendingUp,
    FileText,
    ClipboardCheck,
    PlusCircle
} from 'lucide-react'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function TeacherDashboard() {
    const { user } = useAuthContext()

    const [todaySchedule, setTodaySchedule] = useState<any[]>([])
    const [myClasses, setMyClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [stats, setStats] = useState({
        totalClasses: 0,
        totalStudents: 0,
        teachingHours: 0,
        activeAssignments: 0
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const schedules = await api.get<any[]>('/api/teachers/me/schedules')

                // 1. Fetch Teacher Profile to get ID
                const teacher = await api.get<any>('/api/teachers/me')

                // 2. Fetch Assignments for this teacher
                const assignments = await api.get<any[]>('/api/lms/assignments', {
                    teacherId: teacher.id
                })

                // 3. Calculate Stats
                const now = new Date()
                const activeAssignmentsCount = assignments.filter((a: any) => {
                    // Active if no due date or due date is in future
                    return !a.dueDate || new Date(a.dueDate) > now
                }).length

                const currentDay = new Date().getDay()

                // Process Today's Schedule
                const todayClasses = schedules.filter((s: any) => s.dayOfWeek === currentDay)
                setTodaySchedule(todayClasses)

                // Process Unique Classes & Calculate Stats
                const uniqueClassesMap = new Map()
                let totalHours = 0

                schedules.forEach((s: any) => {
                    // Calculate Hours (approx duration)
                    // Assuming standard 40 mins per jp if needed, or just count slots
                    // Here we might just count unique slots as hours, or parse start/end time
                    // Start '07:20', End '08:00' = 40 mins.
                    // For now, let's just count schedule entries as "Hours" (JP)
                    totalHours++

                    if (s.class && s.subject) {
                        const key = `${s.class.id}-${s.subject.id}`
                        if (!uniqueClassesMap.has(key)) {
                            uniqueClassesMap.set(key, {
                                classId: s.class.id,
                                className: s.class.name,
                                subjectName: s.subject.name,
                                studentCount: s.class._count?.enrollments || 0
                            })
                        }
                    }
                })

                const myUniqueClasses = Array.from(uniqueClassesMap.values())
                setMyClasses(myUniqueClasses)

                // Sum up students from unique classes
                const uniqueClassIds = new Set()
                let totalStudents = 0

                myUniqueClasses.forEach((c: any) => {
                    if (!uniqueClassIds.has(c.classId)) {
                        uniqueClassIds.add(c.classId)
                        totalStudents += (c.studentCount || 0)
                    }
                })

                // Update Stats State
                setStats({
                    totalClasses: myUniqueClasses.length,
                    totalStudents: totalStudents,
                    teachingHours: totalHours,
                    activeAssignments: activeAssignmentsCount
                })

            } catch (error) {
                console.error('Failed to fetch dashboard data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    // Dynamic Stats Array
    const statsData = [
        { label: 'Total Kelas', value: stats.totalClasses.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Total Siswa', value: stats.totalStudents.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { label: 'Jam Mengajar', value: stats.teachingHours.toString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: 'Tugas Aktif', value: stats.activeAssignments.toString(), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-24 md:pb-8">
            {/* Hero Section */}
            <div
                className="relative overflow-hidden rounded-none md:rounded-3xl shadow-xl"
                style={{
                    marginLeft: '-1rem',
                    marginRight: '-1rem',
                    marginTop: '-1rem', // Pull up to top
                    marginBottom: '2rem'
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/90 to-blue-900/70" />

                <div className="relative px-6 py-12 md:px-12 md:py-16 text-white text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Selamat Datang, <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">
                            {user?.name || 'Bapak/Ibu Guru'}
                        </span> 👋
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed opacity-90">
                        Siap menginspirasi siswa hari ini? Cek jadwal dan kelola kelas Anda dengan mudah.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                        <Link to="/teacher-portal/schedule" className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-medium transition-all flex items-center gap-2">
                            <Calendar size={20} />
                            Lihat Jadwal
                        </Link>
                        <Link to="/teacher-portal/grading" className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2">
                            <ClipboardCheck size={20} />
                            Input Nilai
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
                {statsData.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {/* Jadwal Hari Ini & Daftar Kelas */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Jadwal Hari Ini */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Calendar size={28} />
                                </div>
                                Jadwal Mengajar Hari Ini
                            </h2>
                            <Link to="/teacher-portal/schedule" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            {todaySchedule.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {todaySchedule.map((schedule, idx) => (
                                        <div key={idx} className="flex flex-col p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold text-sm flex items-center gap-2">
                                                    <Clock size={16} />
                                                    {schedule.startTime} - {schedule.endTime}
                                                </div>
                                                <div className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                                                    {schedule.room || 'Ruang -'}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {schedule.subject.name}
                                            </h3>

                                            <div className="mt-auto pt-4 flex items-center gap-3 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                                                <div className="p-1.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md">
                                                    <Users size={18} />
                                                </div>
                                                <span className="font-semibold">Kelas {schedule.class.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak Ada Jadwal Mengajar</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                        Anda tidak memiliki jadwal mengajar untuk hari ini. Silakan cek jadwal untuk hari lain.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="text-amber-500" size={24} />
                        Aktivitas Cepat
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                        <Link to="/teacher-portal/assignments/new" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <PlusCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Buat Tugas Baru</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Upload materi atau tugas kelas</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-400 group-hover:text-blue-500" size={16} />
                        </Link>

                        <Link to="/teacher-portal/grading" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <ClipboardCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Input Nilai</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Input nilai ulangan/tugas</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-400 group-hover:text-emerald-500" size={16} />
                        </Link>

                        <Link to="/teacher-portal/attendance" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Presensi Siswa</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Catat kehadiran hari ini</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-400 group-hover:text-purple-500" size={16} />
                        </Link>
                    </div>

                    <div className="bg-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Jika mengalami kendala teknis, hubungi admin sekolah.
                        </p>
                        <button className="w-full py-2 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                            Hubungi Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
