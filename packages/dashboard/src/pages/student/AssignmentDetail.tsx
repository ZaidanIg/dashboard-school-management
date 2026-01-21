import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Clock, Download, ChevronLeft, Link as LinkIcon, Image as ImageIcon, Video, Upload, X, Paperclip, Loader2 } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import StatusBadge from '@/components/common/StatusBadge'
import { useAssignment, useLMSMutations } from '@/hooks/useLMS'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFetch } from '@/hooks/useShared'
import { api } from '@/lib/api'
import type { Student } from '@/types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function StudentAssignmentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthContext()

    // Fetch Student Info to get correct ID for submission check
    const { data: studentResponse } = useFetch<{ data: Student[] }>(user?.email ? `/api/students?email=${user.email}` : null)
    const studentRecord = studentResponse?.data?.[0]

    const { assignment, loading, error } = useAssignment(id || '')
    const { submitAssignment } = useLMSMutations()

    // State for Student Submission
    const [submissionFile, setSubmissionFile] = useState('')
    const [submissionContent, setSubmissionContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string, url: string } | null>(null)

    // Derived state for Student
    const mySubmission = assignment?.submissions?.find(s => s.studentId === studentRecord?.id)

    // Determine status for badge (matches Assignments.tsx)
    const getStatus = () => {
        if (mySubmission) return mySubmission.status
        if (assignment && assignment.dueDate && new Date(assignment.dueDate) < new Date()) return 'OVERDUE'
        return 'PENDING'
    }

    const currentStatus = getStatus()

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id || !studentRecord) return
        setSubmitting(true)
        try {
            await submitAssignment(id, {
                studentId: studentRecord.id,
                fileUrl: submissionFile,
                content: submissionContent // Content from Quill is HTML
            })
            window.location.reload()
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await api.post<{ url: string, filename: string }>('/api/upload', formData)
            setSubmissionFile(res.url)
            setUploadedFileInfo({ name: res.filename, url: res.url })
        } catch (error) {
            console.error('Upload failed', error)
            alert('Gagal mengupload file')
        } finally {
            setUploading(false)
        }
    }

    if (loading) return <LoadingSpinner fullPage />
    if (error || !assignment) return <ErrorState message={error || 'Tugas tidak ditemukan'} />

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0">
            <button
                onClick={() => navigate('/student-portal/assignments')}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4"
            >
                <ChevronLeft size={20} /> Kembali ke Daftar Tugas
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-2 text-text-main dark:text-white">{assignment.title}</h1>
                                <p className="text-gray-500">{assignment.teacher?.name} • {assignment.subject?.name} • {assignment.class?.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 mb-1">Tenggat Waktu</div>
                                <div className="font-medium flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg">
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
                                        <a href={assignment.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group bg-white dark:bg-gray-800 dark:border-gray-700">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium text-blue-600 dark:text-blue-400 group-hover:underline truncate">Lampiran Utama</div>
                                                <div className="text-xs text-gray-400">Klik untuk membuka</div>
                                            </div>
                                            <Download size={18} className="text-gray-400" />
                                        </a>
                                    )}

                                    {/* New Attachments */}
                                    {assignment.attachments?.map((att: any) => (
                                        <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group bg-white dark:bg-gray-800 dark:border-gray-700">
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
                                                <div className="font-medium text-blue-600 dark:text-blue-400 group-hover:underline truncate">{att.filename || 'Lampiran'}</div>
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
                </div>

                {/* Right Column: Submission Box */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-text-main dark:text-white">Tugas Anda</h3>
                            <StatusBadge
                                status={
                                    currentStatus === 'GRADED' ? 'success' :
                                        currentStatus === 'SUBMITTED' ? 'info' :
                                            currentStatus === 'LATE' ? 'warning' :
                                                currentStatus === 'OVERDUE' ? 'error' : 'warning'
                                }
                                label={
                                    currentStatus === 'GRADED' ? 'Sudah Dinilai' :
                                        currentStatus === 'SUBMITTED' ? 'Diserahkan' :
                                            currentStatus === 'LATE' ? 'Diserahkan (Terlambat)' :
                                                currentStatus === 'OVERDUE' ? 'Terlewat / Belum Diserahkan' :
                                                    'Belum Dikerjakan'
                                }
                            />
                        </div>

                        {mySubmission?.status === 'GRADED' && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg border border-green-100 dark:border-green-800">
                                <div className="text-sm font-bold uppercase tracking-wide opacity-70 mb-1">Nilai Akhir</div>
                                <div className="text-3xl font-bold">{mySubmission.grade}/100</div>
                                {mySubmission.feedback && (
                                    <div className="mt-2 text-sm pt-2 border-t border-green-200 dark:border-green-800/50">
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
                            <form onSubmit={handleStudentSubmit} className="space-y-6">
                                {/* File Upload Section */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-main dark:text-white">Lampirkan File</label>

                                    {!submissionFile && !uploadedFileInfo ? (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={uploading || !!mySubmission}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-text-secondary transition-colors w-full"
                                            >
                                                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                                {uploading ? 'Mengupload...' : 'Upload File Tugas'}
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Paperclip size={16} className="text-blue-600 dark:text-blue-400" />
                                                <a href={submissionFile} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 underline truncate max-w-[200px]">
                                                    {uploadedFileInfo?.name || 'File Terlampir'}
                                                </a>
                                            </div>
                                            {!mySubmission && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setSubmissionFile(''); setUploadedFileInfo(null); }}
                                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full text-blue-600 dark:text-blue-400"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <input
                                        type="url"
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                        placeholder="Atau tempel link (Google Drive, dll)..."
                                        value={submissionFile}
                                        onChange={e => setSubmissionFile(e.target.value)}
                                        disabled={!!mySubmission || !!uploadedFileInfo}
                                    />
                                </div>

                                {/* Rich Text Editor */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-main dark:text-white">Jawaban Teks</label>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:ring-2 ring-primary/20">
                                        <ReactQuill
                                            theme="snow"
                                            value={submissionContent}
                                            onChange={setSubmissionContent}
                                            readOnly={!!mySubmission}
                                            placeholder="Tulis jawaban atau penjelasan di sini..."
                                            className="h-48 mb-10 dark:text-white"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    ['clean']
                                                ]
                                            }}
                                        />
                                    </div>
                                </div>

                                {!mySubmission && (
                                    <button
                                        type="submit"
                                        disabled={submitting || uploading}
                                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2 shadow-sm"
                                    >
                                        {submitting ? 'Mengirim...' : 'Serahkan Tugas'}
                                    </button>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
