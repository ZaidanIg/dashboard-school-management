import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Calendar, Users, FileText } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import { useAssignments } from '@/hooks/useLMS'
import { useClasses } from '@/hooks/useClasses'
import AssignmentFormModal from '@/components/academic/AssignmentFormModal'

export default function AssignmentList() {
    const navigate = useNavigate()
    const [classFilter, setClassFilter] = useState('')
    const [subjectFilter, setSubjectFilter] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    // TODO: Subject List? Not implemented yet generically in hooks maybe?
    // useClasses provides classes.
    const { classes } = useClasses()
    const { assignments, loading, error, refetch } = useAssignments({
        classId: classFilter || undefined,
        subjectId: subjectFilter || undefined
    })

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Tidak ada tenggat'
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat daftar tugas..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tugas Kelas (LMS)"
                subtitle="Kelola tugas dan materi pembelajaran"
                breadcrumb={[
                    { label: 'Akademik', path: '/academic' },
                    { label: 'LMS' },
                ]}
                actions={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Buat Tugas</span>
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari tugas..."
                filters={[
                    {
                        label: 'Kelas',
                        value: classFilter,
                        onChange: setClassFilter,
                        options: classes.map(c => ({ label: c.name, value: c.id }))
                    },
                    // Subject filter placeholder
                ]}
                onExport={() => { }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">Belum ada tugas</h3>
                        <p>Buat tugas baru untuk memulai pembelajaran.</p>
                    </div>
                ) : (
                    assignments.map(assignment => (
                        <div
                            key={assignment.id}
                            onClick={() => navigate(`/academic/lms/assignments/${assignment.id}`)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{assignment.title}</h3>
                                    <p className="text-sm text-gray-500">{assignment.subject?.name} • {assignment.class?.name}</p>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Tenggat: {formatDate(assignment.dueDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{assignment._count?.submissions || 0} Pengumpulan</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-900 dark:text-white">Poin: {assignment.maxScore}</span>
                                <span className="text-blue-600 font-medium">Lihat Detail →</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <AssignmentFormModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        refetch()
                    }}
                />
            )}
        </div>
    )
}
