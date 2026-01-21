import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/common/PageHeader'
import { Loader2, CalendarX, BookOpen, Users } from 'lucide-react'

// Helper to get color based on subject name
const getSubjectColor = (subjectName: string) => {
    const colors = [
        'bg-blue-50 text-blue-700',
        'bg-green-50 text-green-700',
        'bg-purple-50 text-purple-700',
        'bg-orange-50 text-orange-700',
        'bg-pink-50 text-pink-700',
        'bg-teal-50 text-teal-700',
        'bg-indigo-50 text-indigo-700',
        'bg-red-50 text-red-700',
        'bg-yellow-50 text-yellow-700',
        'bg-cyan-50 text-cyan-700',
    ]
    let hash = 0
    for (let i = 0; i < subjectName.length; i++) {
        hash = subjectName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

interface ScheduleItem {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    room: string | null
    class: {
        id: string
        name: string
    }
    subject: {
        id: string
        name: string
    }
}

export default function TeacherSchedule() {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([])
    const [myClasses, setMyClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSchedule()
    }, [])

    const fetchSchedule = async () => {
        try {
            setLoading(true)
            const data = await api.get<ScheduleItem[]>('/api/teachers/me/schedules')
            setSchedules(data)

            // Extract Unique Classes
            const uniqueClassesMap = new Map()
            data.forEach((s: any) => {
                if (s.class && s.subject) {
                    const key = `${s.class.id}-${s.subject.id}`
                    if (!uniqueClassesMap.has(key)) {
                        uniqueClassesMap.set(key, {
                            classId: s.class.id,
                            className: s.class.name,
                            subjectName: s.subject.name
                        })
                    }
                }
            })
            setMyClasses(Array.from(uniqueClassesMap.values()))

        } catch (err) {
            console.error('Failed to fetch schedule:', err)
        } finally {
            setLoading(false)
        }
    }

    const groupedSchedules = useMemo(() => {
        if (!schedules.length) return []

        // Group by day
        const grouped: Record<number, ScheduleItem[]> = {}
        schedules.forEach(s => {
            if (!grouped[s.dayOfWeek]) grouped[s.dayOfWeek] = []
            grouped[s.dayOfWeek].push(s)
        })

        // Transform to array and sort
        return Object.keys(grouped).map(dayStr => {
            const day = parseInt(dayStr)
            return {
                day: DAYS[day],
                dayIndex: day,
                // Sort by start time
                items: grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
            }
        }).sort((a, b) => {
            // Sort days: Monday (1) to Saturday (6), then Sunday (0)
            const getSortIndex = (d: number) => d === 0 ? 7 : d
            return getSortIndex(a.dayIndex) - getSortIndex(b.dayIndex)
        })
    }, [schedules])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Jadwal Mengajar"
                subtitle="Daftar kelas yang harus Anda ajar minggu ini"
                breadcrumb={[{ label: 'Jadwal' }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Weekly Schedule (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {groupedSchedules.length > 0 ? (
                        <div className="space-y-6">
                            {groupedSchedules.map((daySchedule) => (
                                <div key={daySchedule.dayIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-slate-50 dark:bg-gray-700/50 border-b border-border-color dark:border-gray-700">
                                        <h3 className="font-bold text-lg text-text-main dark:text-white uppercase tracking-wide flex items-center gap-2">
                                            <span className="w-2 h-8 rounded-full bg-primary/20"></span>
                                            {daySchedule.day}
                                        </h3>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {daySchedule.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 rounded-xl border border-transparent hover:border-black/5 dark:hover:border-white/10 transition-all ${getSubjectColor(item.subject.name)} bg-opacity-30 dark:bg-opacity-20`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold px-2 py-1 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                                        {item.startTime} - {item.endTime}
                                                    </span>
                                                    <span className="text-xs font-medium px-2 py-1 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                                        {item.room || 'R. -'}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-base mb-1">
                                                    {item.subject.name}
                                                </h4>
                                                <p className="text-sm font-medium opacity-90 flex items-center gap-1.5">
                                                    <Users size={14} />
                                                    Kelas {item.class.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-text-secondary bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <CalendarX size={48} className="mb-4 text-slate-300" />
                            <p>Tidak ada jadwal mengajar yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Class List (1/3) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="text-indigo-500" size={24} />
                                Daftar Kelas Ajar
                            </h2>
                        </div>

                        {myClasses.length > 0 ? (
                            <div className="space-y-3">
                                {myClasses.map((cls, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 group cursor-pointer">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform text-indigo-600 dark:text-indigo-400">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                                {cls.className}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {cls.subjectName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                Belum ada data kelas yang diajar.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
