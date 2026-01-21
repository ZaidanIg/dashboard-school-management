import { Users, IdCard, Wallet, ClipboardCheck, Plus, Calendar, Clock, MapPin, BookOpen, ChevronRight, User } from 'lucide-react'
import StatsCard from '@/components/charts/StatsCard'
import WeeklyAttendanceChart from '@/components/charts/WeeklyAttendanceChart'
import MonthlyCashFlowChart from '@/components/charts/MonthlyCashFlowChart'
import Announcements from '@/components/dashboard/Announcements'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'

const stats = [
    {
        title: 'Total Students',
        value: '1,234',
        trend: { value: '+5%', isPositive: true },
        icon: Users,
        iconBgColor: 'bg-blue-50 dark:bg-blue-900/30',
        iconColor: 'text-primary',
    },
    {
        title: 'Total Teachers',
        value: '86',
        trend: { value: '+2%', isPositive: true },
        icon: IdCard,
        iconBgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
        title: 'Cash Balance',
        value: 'Rp 125M',
        trend: { value: '+12%', isPositive: true },
        icon: Wallet,
        iconBgColor: 'bg-amber-50 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
        title: "Today's Attendance",
        value: '94.5%',
        trend: { value: '-1%', isPositive: false },
        icon: ClipboardCheck,
        iconBgColor: 'bg-rose-50 dark:bg-rose-900/30',
        iconColor: 'text-rose-600 dark:text-rose-400',
    },
]

export default function Dashboard() {
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Fetch schedule for today
                const today = new Date().getDay()
                const data = await api.get<any[]>(`/api/academic/schedules?dayOfWeek=${today}`)
                setSchedules(data)
            } catch (error) {
                console.error('Failed to fetch schedules', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSchedule()
    }, [])

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
                        Overview
                    </h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">
                        Summary of school performance and updates.
                    </p>
                </div>
                <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                    <Plus size={20} />
                    New Entry
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
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
                        {loading ? (
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
