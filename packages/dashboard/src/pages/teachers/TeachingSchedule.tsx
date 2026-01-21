
import { useState, useMemo } from 'react'
import { Clock, Users, CalendarX, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import { useFetch } from '@/hooks/useShared'


// Interfaces
interface Subject {
    id: string
    name: string
}

interface Teacher {
    id: string
    name: string
    nip?: string
    subjects: { subject: Subject }[]
}

interface Class {
    id: string
    name: string
    grade: number
    major?: string
}

interface ScheduleItem {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    room: string | null
    class: {
        id: string
        name: string
        grade: number
    }
    subject: {
        id: string
        name: string
    }
    teacher?: Teacher
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const DAY_INDICES = [1, 2, 3, 4, 5] // Mon-Fri

// Helper for subject colors
const getSubjectColor = (subjectName: string) => {
    const colors = [
        'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-blue-700 dark:text-blue-300',
        'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 text-purple-700 dark:text-purple-300',
        'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
        'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 text-amber-700 dark:text-amber-300',
        'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800 text-rose-700 dark:text-rose-300',
        'bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300',
    ]
    let hash = 0
    for (let i = 0; i < subjectName.length; i++) {
        hash = subjectName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}


// Add imports
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import TeacherAssignmentModal from '@/components/teachers/TeacherAssignmentModal' // Ensure import path is correct

export default function TeachingSchedule() {
    const { data: schedulesData, loading: loadingSchedules, refetch } = useFetch<ScheduleItem[]>('/api/academic/schedules')
    const { data: teachersResponse } = useFetch<{ data: Teacher[] }>('/api/teachers')
    const { data: classesData } = useFetch<Class[]>('/api/academic/classes')
    const teachersData = teachersResponse?.data || []

    const { success: showSuccess, error: showError } = useToast()

    // Generate Teacher Codes
    const teacherCodes = useMemo(() => {
        const sortedTeachers = [...teachersData].sort((a, b) => a.name.localeCompare(b.name))
        const map = new Map<string, number>()
        sortedTeachers.forEach((t, index) => {
            map.set(t.id, index + 1)
        })
        return map
    }, [teachersData])

    // Filter state
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
    const [selectedClassId, setSelectedClassId] = useState<string>('')

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<{ id: string, teacherId?: string } | null>(null)
    const [assigning, setAssigning] = useState(false)

    // Derived classes based on grade
    const availableClasses = useMemo(() => {
        if (!classesData || !selectedGrade) return []
        return classesData.filter(c => c.grade === selectedGrade).sort((a, b) => a.name.localeCompare(b.name))
    }, [classesData, selectedGrade])

    // ... existing useMemos (schedules, timeSlots, gridData) ...
    const schedules = useMemo(() => {
        let data = schedulesData || []
        if (selectedClassId) {
            data = data.filter(s => s.class.id === selectedClassId)
        } else {
            // If no class selected, maybe show nothing or all? 
            // Requirement implies selecting a class to view schedule.
            // Let's return empty if no class selected to keep UI clean, or maybe filtered by grade?
            // "Grid to show Selected Class Schedule". So empty if no class.
            // But to be user friendly, if grade selected but no class, maybe show all for that grade?
            // Let's stick to specific class for now as per "make button for choose class".
            return []
        }
        return data
    }, [schedulesData, selectedClassId])

    const timeSlots = useMemo(() => {
        const slots = new Set<string>()
        schedules.forEach(s => slots.add(`${s.startTime} - ${s.endTime}`))
        return Array.from(slots).sort()
    }, [schedules])

    const gridData = useMemo(() => {
        const grid: Record<string, Record<number, ScheduleItem[]>> = {}
        timeSlots.forEach(time => {
            grid[time] = {}
            DAY_INDICES.forEach(day => {
                grid[time][day] = []
            })
        })
        schedules.forEach(s => {
            const timeKey = `${s.startTime} - ${s.endTime}`
            if (grid[timeKey] && grid[timeKey][s.dayOfWeek]) {
                grid[timeKey][s.dayOfWeek].push(s)
            }
        })
        return grid
    }, [schedules, timeSlots])

    const handleCardClick = (item: ScheduleItem) => {
        setSelectedSchedule({ id: item.id, teacherId: item.teacher?.id })
        setModalOpen(true)
    }

    const handleSaveAssignment = async (teacherId: string | null) => {
        if (!selectedSchedule) return

        setAssigning(true)
        try {
            await api.put(`/api/academic/schedules/${selectedSchedule.id}`, { teacherId })
            showSuccess('Jadwal berhasil diperbarui')
            setModalOpen(false)
            refetch()
        } catch (error) {
            showError('Gagal memperbarui jadwal')
            console.error(error)
        } finally {
            setAssigning(false)
        }
    }

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Jadwal Mengajar"
                subtitle="Jadwal mengajar seluruh guru"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/dashboard/teachers' },
                    { label: 'Jadwal Mengajar' },
                ]}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border-color dark:border-gray-700 shadow-sm space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Pilih Tingkat Kelas</label>
                    <div className="flex gap-2">
                        {[10, 11, 12].map((grade) => (
                            <button
                                key={grade}
                                onClick={() => {
                                    if (selectedGrade === grade) {
                                        setSelectedGrade(null)
                                        setSelectedClassId('')
                                    } else {
                                        setSelectedGrade(grade)
                                        setSelectedClassId('')
                                    }
                                }}
                                className={`
                                    px-6 py-2 rounded-lg text-sm font-bold transition-all border
                                    ${selectedGrade === grade
                                        ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                        : 'bg-white dark:bg-gray-700 text-text-secondary border-border-color dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                Kelas {grade}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedGrade && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="text-sm font-medium text-text-secondary mb-2 block">Pilih Kelas</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full sm:w-72 px-3 py-2 bg-white dark:bg-gray-900 border border-border-color dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                        >
                            <option value="">-- Pilih Kelas --</option>
                            {availableClasses.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Main Schedule Grid - Adjusted width */}
                <div className="flex-1 w-full min-w-0 bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                    {loadingSchedules ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : timeSlots.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-gray-700/50 border-b border-border-color dark:border-gray-700">
                                        <th className="px-4 py-4 text-left text-xs font-bold text-text-secondary uppercase w-40 sticky left-0 bg-slate-50 dark:bg-gray-800 z-10 border-r border-border-color dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                Waktu
                                            </div>
                                        </th>
                                        {DAY_INDICES.map((day) => (
                                            <th key={day} className="px-4 py-4 text-left text-xs font-bold text-text-secondary uppercase w-[18%]">
                                                {DAYS[day]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                    {timeSlots.map((time) => (
                                        <tr key={time} className="hover:bg-slate-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-4 text-sm font-bold text-text-main dark:text-white whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 border-r border-border-color dark:border-gray-700 z-10">
                                                {time}
                                            </td>
                                            {DAY_INDICES.map((day) => {
                                                const items = gridData[time]?.[day] || []
                                                return (
                                                    <td key={day} className="px-2 py-2 align-top h-full">
                                                        <div className="space-y-2 h-full">
                                                            {items.map((item) => {
                                                                const code = item.teacher ? teacherCodes.get(item.teacher.id) : null
                                                                return (
                                                                    <div
                                                                        key={item.id}
                                                                        onClick={() => handleCardClick(item)}
                                                                        className={`p-2 rounded-lg border shadow-sm ${getSubjectColor(item.subject.name)} transition-all hover:scale-[1.02] cursor-pointer hover:shadow-md active:scale-95`}
                                                                    >
                                                                        <div className="flex justify-between items-start gap-1">
                                                                            <p className="font-bold text-xs truncate flex-1" title={item.subject.name}>
                                                                                {item.subject.name}
                                                                            </p>
                                                                            {code && (
                                                                                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/50 dark:border-white/10 text-[10px] font-bold text-text-main dark:text-white">
                                                                                    {code}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex flex-col gap-0.5 mt-1 text-[11px] opacity-90">
                                                                            <div className="flex items-center gap-1 font-medium">
                                                                                <Users size={10} />
                                                                                <span className="truncate">{item.class.name}</span>
                                                                            </div>
                                                                            {!item.teacher && (
                                                                                <span className="italic opacity-75 text-[10px]">Belum ada guru</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            {items.length === 0 && (
                                                                <div className="h-full min-h-[60px] rounded-lg border border-dashed border-gray-200 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-800/30 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity">
                                                                    <span className="text-xs text-text-secondary">-</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
                            <CalendarX size={64} className="mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">Belum ada jadwal</h3>
                            <p>Tidak ada jadwal pelajaran yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* Teacher Code Sidebar */}
                <div className="w-full lg:w-72 shrink-0 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 shadow-sm overflow-hidden sticky top-6">
                        <div className="p-4 border-b border-border-color dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50">
                            <h3 className="font-bold text-text-main dark:text-white flex items-center gap-2">
                                <Users size={18} />
                                Kode Guru
                            </h3>
                            <p className="text-xs text-text-secondary mt-1">
                                Referensi kode guru pada jadwal
                            </p>
                        </div>
                        <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar p-0">
                            <div className="divide-y divide-border-color dark:divide-gray-700">
                                {teachersData
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((teacher, index) => (
                                        <div key={teacher.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <span className="flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-text-main dark:text-white truncate">
                                                    {teacher.name}
                                                </p>
                                                <p className="text-xs text-text-secondary truncate">
                                                    {teacher.nip || '-'}
                                                </p>
                                                {/* Show Subjects */}
                                                {teacher.subjects && teacher.subjects.length > 0 && (
                                                    <p className="text-[10px] text-primary/80 truncate mt-0.5">
                                                        {teacher.subjects.map(s => s.subject.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {teachersData.length === 0 && (
                                    <div className="p-8 text-center text-text-secondary text-sm">
                                        Tidak ada data guru
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <TeacherAssignmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleSaveAssignment}
                currentTeacherId={selectedSchedule?.teacherId}
                teachers={teachersData}
                isLoading={assigning}
            />
        </div>
    )
}
