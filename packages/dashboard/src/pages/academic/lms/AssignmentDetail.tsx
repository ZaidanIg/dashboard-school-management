import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Clock, Download, ChevronLeft, X, Link as LinkIcon, Image as ImageIcon, Video } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import StatusBadge from '@/components/common/StatusBadge'
import { useAssignment, useLMSMutations } from '@/hooks/useLMS'
import { useAuth } from '@/hooks/useAuth'
import type { AssignmentSubmission } from '@/types'

export default function AssignmentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { assignment, loading, error } = useAssignment(id || '')
    const { submitAssignment, gradeSubmission } = useLMSMutations()

    // State for Student Submission
    const [submissionFile, setSubmissionFile] = useState('')
    const [submissionContent, setSubmissionContent] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // State for Teacher Grading
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null)
    const [gradeInput, setGradeInput] = useState<number>(0)
    const [feedbackInput, setFeedbackInput] = useState('')
    const [grading, setGrading] = useState(false)

    // Derived state for Student
    const mySubmission = assignment?.submissions?.find(s => s.studentId === user?.id) // Assuming user.id is studentId? Need map if not.

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id || !user) return
        setSubmitting(true)
        try {
            await submitAssignment(id, {
                studentId: user.id, // TODO: verify if user.id matches student.id logic
                fileUrl: submissionFile,
                content: submissionContent
            })
            window.location.reload() // Simple reload to refresh state
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleTeacherGrade = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSubmission) return
        setGrading(true)
        try {
            await gradeSubmission(selectedSubmission.id, {
                grade: gradeInput,
                feedback: feedbackInput
            })
            setSelectedSubmission(null)
            window.location.reload()
        } catch (err) {
            console.error(err)
        } finally {
            setGrading(false)
        }
    }

    if (loading) return <LoadingSpinner fullPage />
    if (error || !assignment) return <ErrorState message={error || 'Tugas tidak ditemukan'} />

    const isTeacher = user?.role === 'TEACHER' || user?.role === 'SUPER_ADMIN'

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <button
                onClick={() => navigate('/academic/lms')}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4"
            >
                <ChevronLeft size={20} /> Kembali ke Daftar Tugas
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
                                <p className="text-gray-500">{assignment.teacher?.name} • {assignment.subject?.name} • {assignment.class?.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 mb-1">Tenggat Waktu</div>
                                <div className="font-medium flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                                    <Clock size={16} />
                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString('id-ID') : 'Tidak ada'}
                                </div>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none border-t border-b py-6 my-6 border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-2">Instruksi</h3>

                            <div
                                className="[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_p]:mb-2"
                                dangerouslySetInnerHTML={{ __html: assignment.description || 'Tidak ada deskripsi.' }}
                            />
                        </div>

                        {/* Attachments List */}
                        {((assignment.attachments?.length ?? 0) > 0 || assignment.attachmentUrl) && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">Lampiran</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {/* Legacy Attachment */}
                                    {assignment.attachmentUrl && (
                                        <a href={assignment.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group bg-white dark:bg-gray-800">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium text-blue-600 group-hover:underline truncate">Lampiran Utama</div>
                                                <div className="text-xs text-gray-400">Klik untuk membuka</div>
                                            </div>
                                            <Download size={18} className="text-gray-400" />
                                        </a>
                                    )}

                                    {/* New Attachments */}
                                    {assignment.attachments?.map((att: any) => (
                                        <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group bg-white dark:bg-gray-800">
                                            <div className={`p-2 rounded-lg transition-colors group-hover:text-white ${att.type === 'LINK' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600' :
                                                att.type === 'IMAGE' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-600' :
                                                    att.type === 'VIDEO' ? 'bg-red-100 text-red-600 group-hover:bg-red-600' :
                                                        'bg-orange-100 text-orange-600 group-hover:bg-orange-600'
                                                }`}>
                                                {att.type === 'LINK' ? <LinkIcon size={20} /> :
                                                    att.type === 'IMAGE' ? <ImageIcon size={20} /> :
                                                        att.type === 'VIDEO' ? <Video size={20} /> :
                                                            <FileText size={20} />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium text-blue-600 group-hover:underline truncate">{att.filename || 'Lampiran'}</div>
                                                <div className="text-xs text-gray-400 flex gap-2">
                                                    <span>{att.type}</span>
                                                    {att.size && <span>• {(att.size / 1024).toFixed(1)} KB</span>}
                                                </div>
                                            </div>
                                            <Download size={18} className="text-gray-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Teacher Grading Table */}
                    {isTeacher && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Pengumpulan Siswa ({assignment.submissions?.length || 0})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Nama Siswa</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left">Waktu Kumpul</th>
                                            <th className="px-4 py-3 text-left">Nilai</th>
                                            <th className="px-4 py-3 text-left">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {assignment.submissions?.map(sub => (
                                            <tr key={sub.id}>
                                                <td className="px-4 py-3 font-medium">{sub.student?.name}</td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={sub.status === 'GRADED' ? 'success' : sub.status === 'SUBMITTED' ? 'active' : 'warning'} label={sub.status} />
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(sub.submittedAt).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    {sub.grade !== null ? `${sub.grade}/100` : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => { setSelectedSubmission(sub); setGradeInput(sub.grade || 0); setFeedbackInput(sub.feedback || ''); }}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Nilai
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Submission Box (Student) or Grading Box (Teacher) */}
                <div className="space-y-6">
                    {/* Student Submission Box */}
                    {!isTeacher && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Tugas Anda</h3>
                                <StatusBadge status={mySubmission ? (mySubmission.status === 'GRADED' ? 'success' : 'active') : 'warning'} label={mySubmission ? mySubmission.status : 'Ditugaskan'} />
                            </div>

                            {mySubmission?.status === 'GRADED' && (
                                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-100">
                                    <div className="text-sm font-bold uppercase tracking-wide opacity-70 mb-1">Nilai Akhir</div>
                                    <div className="text-3xl font-bold">{mySubmission.grade}/100</div>
                                    {mySubmission.feedback && (
                                        <div className="mt-2 text-sm pt-2 border-t border-green-200">
                                            "{mySubmission.feedback}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {mySubmission && !['GRADED'].includes(mySubmission.status) && (
                                <div className="mb-4 text-sm text-gray-500 italic">
                                    Tugas sudah dikirim. Menunggu penilaian.
                                </div>
                            )}

                            {(!mySubmission || mySubmission.status !== 'GRADED') && (
                                <form onSubmit={handleStudentSubmit} className="space-y-4">
                                    {/* Upload Inputs */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Link File / Dokumen</label>
                                        <input
                                            type="url"
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                                            placeholder="https://drive.google.com/..."
                                            value={submissionFile}
                                            onChange={e => setSubmissionFile(e.target.value)}
                                            disabled={!!mySubmission} // Locked after submit? Or allow resubmit?
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium opacity-70 mb-1">Atau jawaban teks</label>
                                        <textarea
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 h-24"
                                            placeholder="Ketik jawaban di sini..."
                                            value={submissionContent}
                                            onChange={e => setSubmissionContent(e.target.value)}
                                            disabled={!!mySubmission}
                                        />
                                    </div>

                                    {!mySubmission && (
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2"
                                        >
                                            {submitting ? 'Mengirim...' : 'Serahkan (Turn In)'}
                                        </button>
                                    )}
                                </form>
                            )}
                        </div>
                    )}

                    {/* Teacher Grading Box (Active only when submission selected) */}
                    {isTeacher && selectedSubmission && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6 animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg">Beri Nilai</h3>
                                <button onClick={() => setSelectedSubmission(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium text-gray-500 mb-1">Pengirim</div>
                                <div className="font-bold">{selectedSubmission.student?.name}</div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {selectedSubmission.fileUrl && (
                                    <a href={selectedSubmission.fileUrl} target="_blank" className="block p-3 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 flex items-center gap-2">
                                        <Download size={16} /> Buka Lampiran Siswa
                                    </a>
                                )}
                                {selectedSubmission.content && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm whitespace-pre-wrap">
                                        {selectedSubmission.content}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleTeacherGrade} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nilai (0-100)</label>
                                    <input
                                        type="number" min="0" max="100" required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 text-lg font-bold"
                                        value={gradeInput}
                                        onChange={e => setGradeInput(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Komentar Privat</label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 h-24"
                                        placeholder="Beri masukan..."
                                        value={feedbackInput}
                                        onChange={e => setFeedbackInput(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={grading}
                                    className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                                >
                                    {grading ? 'Menyimpan...' : 'Kirim Nilai'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

