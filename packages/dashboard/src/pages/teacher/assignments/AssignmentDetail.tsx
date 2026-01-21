import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Calendar, FileText, CheckCircle, Clock,
    Download, Edit, Trash2, Award, Paperclip, X
} from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useAssignment, useLMSMutations } from '@/hooks/useLMS'
import { useFetch } from '@/hooks/useShared'
import { useToast } from '@/contexts/ToastContext'
import type { Student, AssignmentSubmission } from '@/types'

export default function AssignmentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToast } = useToast()

    // Hooks
    const { assignment, loading, refetch } = useAssignment(id || '')
    const { deleteAssignment, gradeSubmission, loading: submitting } = useLMSMutations()

    // Fetch students of the class to show who hasn't submitted
    const { data: studentsResponse, loading: studentsLoading } = useFetch<{ data: Student[] }>(
        assignment?.classId ? `/api/students?classId=${assignment?.classId}&limit=100` : null,
        undefined,
        { initialData: { data: [] } }
    )
    const students = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse?.data || [])

    // State for Grading Modal
    const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null)
    const [gradeInput, setGradeInput] = useState('')
    const [feedbackInput, setFeedbackInput] = useState('')

    // Derived State
    const combinedData = useMemo(() => {
        if (!assignment || !students.length) return []

        return students.map(student => {
            const submission = assignment.submissions?.find(s => s.studentId === student.id)
            return {
                student,
                submission,
                status: submission ? submission.status : 'MISSING'
            }
        })
    }, [assignment, students])

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return
        try {
            await deleteAssignment(id!)
            addToast('success', 'Tugas berhasil dihapus')
            navigate('/teacher-portal/assignments')
        } catch (error) {
            addToast('error', 'Gagal menghapus tugas')
        }
    }

    const openGradeModal = (submission: AssignmentSubmission) => {
        setGradingSubmission(submission)
        setGradeInput(submission.grade?.toString() || '')
        setFeedbackInput(submission.feedback || '')
    }

    const handleGradeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!gradingSubmission) return

        try {
            await gradeSubmission(gradingSubmission.id, {
                grade: parseFloat(gradeInput),
                feedback: feedbackInput
            })
            addToast('success', 'Nilai berhasil disimpan')
            setGradingSubmission(null)
            refetch()
        } catch (error) {
            addToast('error', 'Gagal menyimpan nilai')
        }
    }

    if (loading || (assignment?.classId && studentsLoading)) {
        return <div className="flex justify-center p-12"><LoadingSpinner /></div>
    }

    if (!assignment) {
        return <div className="p-8 text-center">Tugas tidak ditemukan</div>
    }

    const isOverdue = new Date(assignment.dueDate || '') < new Date()

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Detail Tugas"
                subtitle={assignment.title}
                breadcrumb={[
                    { label: 'Tugas', path: '/teacher-portal/assignments' },
                    { label: 'Detail' }
                ]}
                actions={
                    <button
                        onClick={() => navigate('/teacher-portal/assignments')}
                        className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white"
                    >
                        <ArrowLeft size={16} />
                        <span className="font-medium">Kembali</span>
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">{assignment.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                        <FileText size={14} />
                                        {assignment.subject?.name}
                                    </span>
                                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        <CheckCircle size={14} />
                                        {assignment.class?.name}
                                    </span>
                                    {isOverdue ? (
                                        <span className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 px-2 py-1 rounded">
                                            <Clock size={14} /> Berakhir
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-2 py-1 rounded">
                                            <Clock size={14} /> Aktif
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/teacher-portal/assignments/${id}/edit`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Edit Tugas"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Hapus Tugas"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-6 text-text-main dark:text-gray-300">
                            <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                            <p className="whitespace-pre-wrap">{assignment.description || 'Tidak ada deskripsi.'}</p>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm border-t border-border-color dark:border-gray-700 pt-6">
                            <div>
                                <span className="block text-text-secondary mb-1">Tenggat Waktu</span>
                                <span className="font-medium flex items-center gap-2 dark:text-white">
                                    <Calendar size={16} />
                                    {assignment.dueDate ? format(new Date(assignment.dueDate), 'eeee, d MMMM yyyy, HH:mm', { locale: localeId }) : '-'}
                                </span>
                            </div>
                            {assignment.attachments && assignment.attachments.length > 0 && (
                                <div>
                                    <span className="block text-text-secondary mb-1">Lampiran</span>
                                    <div className="flex flex-col gap-1">
                                        {/* Assuming attachments are strings for now based on form, or array of objects if backend formatted */}
                                        {/* Using any for safe mapping if type differs */}
                                        {(assignment.attachments as any[]).map((att, idx) => (
                                            <a
                                                key={idx}
                                                href={itemIsString(att) ? att : att.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Paperclip size={14} />
                                                {itemIsString(att) ? att : (att.filename || 'Lampiran')}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-border-color dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-text-main dark:text-white">Pengumpulan Siswa</h3>
                            <span className="text-sm text-text-secondary">
                                {assignment.submissions?.length || 0} / {students.length} Dikumpulkan
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Siswa</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Waktu Kirim</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Nilai</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                    {combinedData.map(({ student, submission, status }) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {student.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-main dark:text-white text-sm">{student.name}</p>
                                                        <p className="text-xs text-text-secondary">{student.nis}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <SubmissionStatusBadge status={status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-secondary">
                                                {submission?.submittedAt
                                                    ? format(new Date(submission.submittedAt), 'd MMM, HH:mm')
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {submission?.grade !== undefined ? (
                                                    <span className={submission.grade >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                                                        {submission.grade}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {submission && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        {submission.fileUrl && (
                                                            <a
                                                                href={submission.fileUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                                                                title="Lihat File"
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => openGradeModal(submission)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                            title="Nilai"
                                                        >
                                                            <Award size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="font-semibold text-text-main dark:text-white mb-4">Statistik</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Total Siswa</span>
                                <span className="font-medium dark:text-white">{students.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Mengumpulkan</span>
                                <span className="font-medium text-emerald-600">
                                    {assignment.submissions?.filter(s => s.status === 'SUBMITTED' || s.status === 'GRADED').length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Belum Mengumpulkan</span>
                                <span className="font-medium text-red-600">
                                    {(students.length) - (assignment.submissions?.length || 0)}
                                </span>
                            </div>
                            <div className="border-t border-border-color dark:border-gray-700 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">Sudah Dinilai</span>
                                    <span className="font-medium text-blue-600">
                                        {assignment.submissions?.filter(s => s.grade !== undefined).length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grading Modal */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Input Nilai</h3>
                            <button onClick={() => setGradingSubmission(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Nilai (0-100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    required
                                    value={gradeInput}
                                    onChange={(e) => setGradeInput(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Feedback</label>
                                <textarea
                                    rows={3}
                                    value={feedbackInput}
                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                    placeholder="Berikan masukan untuk siswa..."
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setGradingSubmission(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Nilai'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function SubmissionStatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'submitted':
        case 'SUBMITTED':
            return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded-full font-medium">Dikumpulkan</span>
        case 'graded':
        case 'GRADED':
            return <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-full font-medium">Dinilai</span>
        case 'late':
        case 'LATE':
            return <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs px-2 py-1 rounded-full font-medium">Terlambat</span>
        case 'MISSING':
        default:
            return <span className="bg-gray-100 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded-full font-medium">Belum Mengumpulkan</span>
    }
}

function itemIsString(item: any): item is string {
    return typeof item === 'string'
}
