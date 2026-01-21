import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, ChevronRight, Loader2, LayoutTemplate, List as ListIcon } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { useAuthContext } from '@/contexts/AuthContext'
import { useAssignments } from '@/hooks/useLMS'
import { useFetch } from '@/hooks/useShared'
import type { Assignment, Student } from '@/types'

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'GRADED': return 'Sudah Dinilai'
        case 'SUBMITTED': return 'Diserahkan'
        case 'LATE': return 'Diserahkan (Terlambat)'
        case 'PENDING': return 'Belum Dikerjakan'
        case 'OVERDUE': return 'Terlewat / Belum Diserahkan'
        case 'RETURNED': return 'Dikembalikan'
        default: return status
    }
}

// Component for Card
const AssignmentCard = ({ item, status, score }: { item: Assignment, status: string, score?: number }) => {
    const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-slate-100 dark:bg-gray-700 text-xs font-semibold rounded text-text-secondary">
                    {item.subject?.name || 'Mata Pelajaran'}
                </span>
                <StatusBadge
                    status={
                        status === 'GRADED' ? 'success' :
                            status === 'SUBMITTED' ? 'info' :
                                status === 'LATE' ? 'warning' :
                                    status === 'OVERDUE' ? 'error' : 'warning'
                    }
                    label={getStatusLabel(status)}
                />
            </div>

            <h3 className="font-semibold text-text-main dark:text-white mb-1 line-clamp-2">
                {item.title}
            </h3>
            <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                Oleh: {item.teacher?.name || 'Guru'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border-color dark:border-gray-700">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Clock size={14} />
                    {['GRADED', 'SUBMITTED', 'LATE'].includes(status) ? 'Diserahkan' : 'Tenggat'}: {dueDate}
                </div>

                {status === 'GRADED' ? (
                    <span className="font-bold text-lg text-emerald-600">
                        {score || 0} <span className="text-xs text-text-secondary font-normal">/100</span>
                    </span>
                ) : (
                    <Link
                        to={`/student-portal/assignments/${item.id}`}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-700"
                    >
                        Detail <ChevronRight size={16} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default function StudentAssignments() {
    const [tab, setTab] = useState<'pending' | 'completed'>('pending')
    const [viewMode, setViewMode] = useState<'list' | 'board'>('board')

    const { user } = useAuthContext()
    const { data: studentResponse, loading: studentLoading } = useFetch<{ data: Student[] }>(user?.email ? `/api/students?email=${user.email}` : null)
    const studentRecord = studentResponse?.data?.[0]
    const activeEnrollment = studentRecord?.classEnrollments?.find(e => e.status === 'ACTIVE')

    // Fetch assignments for this student filtered by class
    // Only fetch when studentRecord.id is available to ensure submissions are included
    // TEMPORARY: Removed classId filter to debug why no assignments are showing
    const { assignments, loading: assignmentsLoading } = useAssignments(
        studentRecord?.id ? {
            studentId: studentRecord.id,
            classId: activeEnrollment?.classId
        } : undefined
    )

    // DEBUG: Log data flow
    console.log('Assignments Debug:', {
        userEmail: user?.email,
        studentRecordId: studentRecord?.id,
        activeEnrollmentClassId: activeEnrollment?.classId,
        assignmentsCount: assignments?.length,
        assignmentsLoading,
        studentLoading
    })

    const loading = studentLoading || (studentRecord?.id ? assignmentsLoading : true)

    const getStatus = (assignment: Assignment) => {
        const submission = assignment.submissions?.find(s => s.studentId === studentRecord?.id)
        if (submission) return submission.status

        if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
            return 'OVERDUE'
        }
        return 'PENDING'
    }

    const getScore = (assignment: Assignment) => {
        const submission = assignment.submissions?.find(s => s.studentId === studentRecord?.id)
        return submission?.grade
    }

    const filteredAssignments = assignments.filter(a => {
        const status = getStatus(a)
        if (tab === 'pending') {
            return ['PENDING', 'OVERDUE', 'DRAFT'].includes(status)
        } else {
            return ['SUBMITTED', 'GRADED', 'LATE', 'RETURNED'].includes(status)
        }
    })

    return (
        <div className="space-y-6 px-4 md:px-0">
            <PageHeader
                title="Tugas Saya"
                subtitle="Daftar tugas dan pekerjaan rumah"
                breadcrumb={[{ label: 'Tugas' }]}
            />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border-color dark:border-gray-700 pb-1">
                {/* Tabs (Only relevant for List View, but kept for Board filtering if needed, or hide in Board) */}
                {viewMode === 'list' ? (
                    <div className="flex">
                        <button
                            onClick={() => setTab('pending')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'pending'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-main dark:text-gray-400'
                                }`}
                        >
                            Belum Dikerjakan
                        </button>
                        <button
                            onClick={() => setTab('completed')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'completed'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-main dark:text-gray-400'
                                }`}
                        >
                            Sudah Dikumpulkan
                        </button>
                    </div>
                ) : (
                    <div className="px-1 py-3 text-sm font-medium text-text-main dark:text-white">
                        Board View
                    </div>
                )}

                {/* View Toggle */}
                <div className="flex bg-slate-100 dark:bg-gray-800 p-1 rounded-lg mb-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-white dark:bg-gray-700 shadow text-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        title="List View"
                    >
                        <ListIcon size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('board')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'board'
                            ? 'bg-white dark:bg-gray-700 shadow text-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        title="Board View"
                    >
                        <LayoutTemplate size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : viewMode === 'board' ? (
                /* Kanban Board */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-6">
                    {/* Column 1: To Do */}
                    <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl p-4 border border-slate-100 dark:border-gray-700 h-fit">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <h3 className="font-semibold text-text-main dark:text-white">Perlu Dikerjakan</h3>
                            <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-500 border border-slate-100 dark:border-gray-600">
                                {assignments.filter(a => ['PENDING', 'OVERDUE', 'DRAFT'].includes(getStatus(a))).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {assignments.filter(a => ['PENDING', 'OVERDUE', 'DRAFT'].includes(getStatus(a))).map(item => (
                                <AssignmentCard key={item.id} item={item} status={getStatus(item)} score={getScore(item)} />
                            ))}
                            {assignments.filter(a => ['PENDING', 'OVERDUE', 'DRAFT'].includes(getStatus(a))).length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4 italic">Tidak ada tugas</p>
                            )}
                        </div>
                    </div>

                    {/* Column 2: In Review */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 h-fit">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h3 className="font-semibold text-text-main dark:text-white">Menunggu Penilaian</h3>
                            <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-500 border border-blue-100 dark:border-gray-600">
                                {assignments.filter(a => ['SUBMITTED', 'LATE'].includes(getStatus(a))).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {assignments.filter(a => ['SUBMITTED', 'LATE'].includes(getStatus(a))).map(item => (
                                <AssignmentCard key={item.id} item={item} status={getStatus(item)} score={getScore(item)} />
                            ))}
                            {assignments.filter(a => ['SUBMITTED', 'LATE'].includes(getStatus(a))).length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4 italic">Kosong</p>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Done */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30 h-fit">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <h3 className="font-semibold text-text-main dark:text-white">Selesai</h3>
                            <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-500 border border-emerald-100 dark:border-gray-600">
                                {assignments.filter(a => ['GRADED', 'RETURNED'].includes(getStatus(a))).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {assignments.filter(a => ['GRADED', 'RETURNED'].includes(getStatus(a))).map(item => (
                                <AssignmentCard key={item.id} item={item} status={getStatus(item)} score={getScore(item)} />
                            ))}
                            {assignments.filter(a => ['GRADED', 'RETURNED'].includes(getStatus(a))).length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4 italic">Belum ada yang selesai</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssignments.map((item) => (
                        <AssignmentCard key={item.id} item={item} status={getStatus(item)} score={getScore(item)} />
                    ))}
                    {!loading && filteredAssignments.length === 0 && (
                        <div className="col-span-full py-12 text-center text-text-secondary">
                            <CheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <p>Tidak ada tugas di sini.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
