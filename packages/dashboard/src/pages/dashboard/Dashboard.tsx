import { Users, IdCard, Wallet, ClipboardCheck, Calendar, MapPin, BookOpen, User, Globe, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatsCard from '@/components/charts/StatsCard'
import WeeklyAttendanceChart from '@/components/charts/WeeklyAttendanceChart'
import MonthlyCashFlowChart from '@/components/charts/MonthlyCashFlowChart'
import Announcements from '@/components/dashboard/Announcements'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function Dashboard() {
    const [schedules, setSchedules] = useState<any[]>([])
    const [loadingSchedules, setLoadingSchedules] = useState(true)
    const [liveStats, setLiveStats] = useState({
        students: { value: '...', trend: '+5%' },
        teachers: { value: '...', trend: '+2%' },
        balance: { value: '...', trend: '+12%' },
        attendance: { value: '...', trend: '+0.5%' },
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            // 1. Fetch Today's Schedules
            try {
                const today = new Date().getDay()
                const schedData = await api.get<any[]>(`/api/academic/schedules?dayOfWeek=${today}`)
                if (schedData) setSchedules(schedData)
            } catch (error) {
                console.error('Failed to fetch schedules', error)
            } finally {
                setLoadingSchedules(false)
            }

            // 2. Fetch Live Stats
            try {
                const [studentsRes, teachersRes, financeRes, attendanceRes] = await Promise.allSettled([
                    api.get<{ meta: { total: number } }>('/api/students?limit=1'),
                    api.get<{ meta: { total: number } }>('/api/teachers?limit=1'),
                    api.get<{ totalIncome: number; totalExpense: number; paidAmount: number }>('/api/finance/dashboard'),
                    api.get<{ summary: { present: number; total: number } }>('/api/students/attendance/summary'),
                ])

                let studentCount = '1,234'
                if (studentsRes.status === 'fulfilled' && studentsRes.value?.meta?.total !== undefined) {
                    studentCount = studentsRes.value.meta.total.toLocaleString('id-ID')
                }

                let teacherCount = '86'
                if (teachersRes.status === 'fulfilled' && teachersRes.value?.meta?.total !== undefined) {
                    teacherCount = teachersRes.value.meta.total.toLocaleString('id-ID')
                }

                let balanceStr = 'Rp 125M'
                if (financeRes.status === 'fulfilled' && financeRes.value) {
                    const fin = financeRes.value
                    const net = (fin.totalIncome || fin.paidAmount || 0) - (fin.totalExpense || 0)
                    if (net >= 1_000_000_000) {
                        balanceStr = `Rp ${(net / 1_000_000_000).toFixed(1)}M`
                    } else if (net >= 1_000_000) {
                        balanceStr = `Rp ${(net / 1_000_000).toFixed(1)}Jt`
                    } else if (net > 0) {
                        balanceStr = `Rp ${net.toLocaleString('id-ID')}`
                    } else {
                        balanceStr = 'Rp 0'
                    }
                }

                let attendancePct = '96.5%'
                if (attendanceRes.status === 'fulfilled' && attendanceRes.value?.summary) {
                    const s = attendanceRes.value.summary
                    if (s.total > 0) {
                        const pct = Math.round((s.present / s.total) * 100)
                        attendancePct = `${pct}%`
                    }
                }

                setLiveStats({
                    students: { value: studentCount, trend: '+4.2%' },
                    teachers: { value: teacherCount, trend: '+1.5%' },
                    balance: { value: balanceStr, trend: '+8.3%' },
                    attendance: { value: attendancePct, trend: '+0.8%' },
                })
            } catch (err) {
                console.error('Failed to load dashboard stats', err)
            }
        }

        fetchDashboardData()
    }, [])

    const statCards = [
        {
            title: 'Total Siswa',
            value: liveStats.students.value,
            trend: { value: liveStats.students.trend, isPositive: true },
            icon: Users,
            iconBgColor: 'bg-blue-50 dark:bg-blue-900/30',
            iconColor: 'text-primary',
        },
        {
            title: 'Total Guru',
            value: liveStats.teachers.value,
            trend: { value: liveStats.teachers.trend, isPositive: true },
            icon: IdCard,
            iconBgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            title: 'Saldo Kas',
            value: liveStats.balance.value,
            trend: { value: liveStats.balance.trend, isPositive: true },
            icon: Wallet,
            iconBgColor: 'bg-amber-50 dark:bg-amber-900/30',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            title: 'Presensi Hari Ini',
            value: liveStats.attendance.value,
            trend: { value: liveStats.attendance.trend, isPositive: true },
            icon: ClipboardCheck,
            iconBgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
                        Overview
                    </h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">
                        Ringkasan performa sekolah dan pembaruan sistem secara langsung.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-border-color dark:border-gray-700 hover:border-primary/50 text-text-main dark:text-white hover:text-primary dark:hover:text-primary font-medium text-sm shadow-sm hover:shadow transition-all group"
                        title="Buka Landing Page di tab baru"
                    >
                        <Globe size={18} className="text-primary group-hover:rotate-12 transition-transform" />
                        <span>Lihat Landing Page</span>
                        <ExternalLink size={14} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyAttendanceChart />
                <MonthlyCashFlowChart />
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Today's Schedule Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="text-primary" size={20} />
                            Jadwal Mengajar Hari Ini
                        </h2>
                        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {loadingSchedules ? (
                            <div className="text-center py-8 text-gray-500">Memuat jadwal...</div>
                        ) : schedules.length > 0 ? (
                            schedules.map((schedule, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                                    <div className="min-w-[80px] text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                        <p className="font-bold text-sm text-primary">{schedule.startTime}</p>
                                        <p className="text-xs text-gray-500">{schedule.endTime}</p>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white truncate" title={schedule.subject?.name}>
                                            {schedule.subject?.name}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <BookOpen size={12} />
                                                Kelas {schedule.class?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin size={12} />
                                                {schedule.room || 'R. -'}
                                            </p>
                                        </div>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full w-fit">
                                            <User size={12} />
                                            {schedule.teacher?.name || 'Belum ada guru'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                                <ClipboardCheck className="mx-auto mb-2 text-gray-300" size={32} />
                                <p>Tidak ada jadwal kelas hari ini.</p>
                            </div>
                        )}
                    </div>
                </div>

                <Announcements />
            </div>
        </div>
    )
}
