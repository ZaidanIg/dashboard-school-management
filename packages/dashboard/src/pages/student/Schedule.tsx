import { useMemo } from 'react'
import PageHeader from '@/components/common/PageHeader'
import { useAuthContext } from '@/contexts/AuthContext'
import { useSchedules, type Schedule } from '@/hooks/useSchedules'
import { useFetch } from '@/hooks/useShared'
import type { Student } from '@/types'
import { Loader2, CalendarX } from 'lucide-react'

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

export default function StudentSchedule() {
    const { user } = useAuthContext()
    const { data: studentResponse } = useFetch<{ data: Student[] }>(user?.email ? `/api/students?email=${user.email}` : undefined)
    const studentRecord = studentResponse?.data?.[0]

    const activeEnrollment = studentRecord?.classEnrollments?.find(e => e.status === 'ACTIVE')
    const classId = activeEnrollment?.classId

    const { schedules, loading } = useSchedules(classId)

    const groupedSchedules = useMemo(() => {
        if (!schedules) return []

        // Group by day
        const grouped: Record<number, Schedule[]> = {}
        schedules.forEach(s => {
            if (!grouped[s.dayOfWeek]) grouped[s.dayOfWeek] = []
            grouped[s.dayOfWeek].push(s)
        })

        // transform to array and sort by time
        return Object.keys(grouped).map(dayStr => {
            const day = parseInt(dayStr)
            return {
                day: DAYS[day],
                dayIndex: day,
                items: grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
            }
        }).sort((a, b) => {
            // Sort days: Monday (1) to Saturday (6), then Sunday (0)
            const getSortIndex = (d: number) => d === 0 ? 7 : d
            return getSortIndex(a.dayIndex) - getSortIndex(b.dayIndex)
        })
    }, [schedules])

    return (
        <div className="space-y-6 px-4 md:px-0">
            <PageHeader
                title="Jadwal Pelajaran"
                subtitle={`Kelas ${activeEnrollment?.class?.name || '-'}`}
                breadcrumb={[{ label: 'Jadwal' }]}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : groupedSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSchedules.map((daySchedule) => (
                        <div key={daySchedule.dayIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-gray-700/50 border-b border-border-color dark:border-gray-700">
                                <h3 className="font-bold text-center text-lg text-text-main dark:text-white uppercase tracking-wide">
                                    {daySchedule.day}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {daySchedule.items.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-lg border border-transparent hover:border-border-color dark:hover:border-gray-600 transition-colors ${getSubjectColor(item.subject?.name || '')} dark:bg-opacity-20`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold opacity-75">{item.startTime} - {item.endTime}</span>
                                            <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full">
                                                {item.room || '-'}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm">
                                            {item.subject?.name || 'Unknown Subject'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                    <CalendarX size={48} className="mb-4 text-slate-300" />
                    <p>Tidak ada jadwal pelajaran untuk kelas ini.</p>
                </div>
            )}
        </div>
    )
}
