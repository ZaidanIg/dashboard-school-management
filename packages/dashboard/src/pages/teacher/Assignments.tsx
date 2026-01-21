import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, FileText, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useAssignments } from '@/hooks/useLMS'
import { useFetch } from '@/hooks/useShared'

export default function TeacherAssignments() {
    // State
    const [selectedClassId, setSelectedClassId] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch Teacher ID & Schedules (for class filter)
    const { data: schedules } = useFetch<any[]>('/api/teachers/me/schedules', undefined, { initialData: [] })

    // Extract Unique Classes
    const myClasses = useMemo(() => {
        const unique = new Map()
        schedules?.forEach(s => {
            if (s.class && !unique.has(s.class.id)) {
                unique.set(s.class.id, s.class)
            }
        })
        return Array.from(unique.values())
    }, [schedules])

    // Fetch Assignments
    // Note: API should support filtering by teacherId ideally, or we filter on client
    // Assuming /api/lms/assignments returns all assignments visible to the user (teacher's own assignments)
    const { assignments, loading } = useAssignments(schedules?.length > 0 ? {
        teacherId: schedules[0]?.teacherId // Pass teacherId if available to filter
    } : undefined)

    // Filter Logic
    const filteredAssignments = useMemo(() => {
        return assignments.filter(a => {
            const matchesClass = selectedClassId ? a.classId === selectedClassId : true
            const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description?.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesClass && matchesSearch
        })
    }, [assignments, selectedClassId, searchTerm])

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Kelola Tugas"
                subtitle="Buat dan kelola tugas untuk kelas Anda"
                breadcrumb={[{ label: 'Tugas' }]}
                actions={
                    <Link
                        to="/teacher-portal/assignments/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={16} />
                        <span className="font-medium">Buat Tugas</span>
                    </Link>
                }
            />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari tugas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white min-w-[200px]"
                >
                    <option value="">Semua Kelas</option>
                    {myClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-border-color dark:border-gray-700 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full mb-4">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada tugas</h2>
                    <p className="text-text-secondary max-w-md">
                        {searchTerm || selectedClassId
                            ? 'Tidak ada tugas yang cocok dengan filter pencarian.'
                            : 'Mulai dengan membuat tugas baru untuk siswa Anda.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssignments.map((assignment) => (
                        <Link
                            key={assignment.id}
                            to={`/teacher-portal/assignments/${assignment.id}`}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5 group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                                    {assignment.subject?.name || 'Mata Pelajaran'}
                                </div>
                                {assignment.dueDate && new Date(assignment.dueDate) < new Date() ? (
                                    <span className="flex items-center gap-1 text-xs text-red-600 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                        <Clock size={12} /> Berakhir
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                        <Clock size={12} /> Aktif
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {assignment.title}
                            </h3>

                            <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                                {assignment.description || 'Tidak ada deskripsi'}
                            </p>

                            <div className="border-t border-border-color dark:border-gray-700 pt-4 mt-auto space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <Calendar size={14} />
                                        Tenggat
                                    </span>
                                    <span className="font-medium text-text-main dark:text-white">
                                        {assignment.dueDate ? format(new Date(assignment.dueDate), 'd MMM yyyy, HH:mm', { locale: localeId }) : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <CheckCircle size={14} />
                                        Kelas
                                    </span>
                                    <span className="font-medium text-text-main dark:text-white">
                                        {assignment.class?.name || '-'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
