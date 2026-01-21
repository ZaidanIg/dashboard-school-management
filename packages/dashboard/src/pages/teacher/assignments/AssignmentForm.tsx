import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Paperclip, X, Upload, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useLMSMutations, useAssignment } from '@/hooks/useLMS'
import { useFetch } from '@/hooks/useShared'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { Subject } from '@/types'

export default function AssignmentForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToast } = useToast()
    const isEdit = !!id
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useAuth()

    // Hooks
    const { createAssignment, updateAssignment, loading: submitting } = useLMSMutations()
    const { assignment, loading: fetchingAssignment } = useAssignment(id || '')
    const { data: schedules } = useFetch<any[]>('/api/teachers/me/schedules', undefined, { initialData: [] })
    const { data: subjects } = useFetch<Subject[]>('/api/academic/subjects', undefined, { initialData: [] })

    // State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        dueDate: '',
        attachments: [] as { url: string, filename: string, type: 'FILE' | 'LINK' }[]
    })
    const [uploading, setUploading] = useState(false)

    // Prepare filter options
    const myClasses = useMemo(() => {
        const unique = new Map()
        schedules?.forEach(s => {
            if (s.class && !unique.has(s.class.id)) {
                unique.set(s.class.id, s.class)
            }
        })
        return Array.from(unique.values())
    }, [schedules])

    // Load initial data for edit
    useEffect(() => {
        if (assignment && isEdit) {
            setFormData({
                title: assignment.title,
                description: assignment.description || '',
                classId: assignment.classId,
                subjectId: assignment.subjectId,
                dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
                attachments: assignment.attachments ? assignment.attachments.map(a => ({
                    url: a.url,
                    filename: a.filename || 'Lampiran',
                    type: (a.type as 'FILE' | 'LINK') || 'FILE'
                })) : []
            })
        }
    }, [assignment, isEdit])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const form = new FormData()
        form.append('file', file)

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form })
            const data = await res.json()
            if (res.ok) {
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, { url: data.url, filename: file.name, type: 'FILE' }]
                }))
                addToast('success', 'File berhasil diupload')
            } else {
                addToast('error', 'Upload gagal: ' + (data.message || 'Unknown error'))
            }
        } catch (error) {
            console.error(error)
            addToast('error', 'Terjadi kesalahan saat upload')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user?.id) {
            addToast('error', 'Sesi pengguna tidak valid')
            return
        }

        try {
            const payload = {
                ...formData,
                teacherId: user.id
            }

            if (isEdit) {
                await updateAssignment(id!, payload)
                addToast('success', 'Tugas berhasil diperbarui')
            } else {
                await createAssignment(payload)
                addToast('success', 'Tugas berhasil dibuat')
            }
            navigate('/teacher-portal/assignments')
        } catch (error) {
            // Error handled by hook
            addToast('error', 'Gagal menyimpan tugas')
        }
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (isEdit && fetchingAssignment) {
        return <div className="flex justify-center p-12"><LoadingSpinner /></div>
    }

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title={isEdit ? 'Edit Tugas' : 'Buat Tugas Baru'}
                subtitle="Isi informasi tugas untuk siswa"
                breadcrumb={[
                    { label: 'Tugas', path: '/teacher-portal/assignments' },
                    { label: isEdit ? 'Edit' : 'Buat Baru' }
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

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Judul Tugas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Contoh: Analisis Cerpen"
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    {/* Class */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Kelas <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.classId}
                            onChange={(e) => handleChange('classId', e.target.value)}
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Pilih Kelas</option>
                            {myClasses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Mata Pelajaran <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.subjectId}
                            onChange={(e) => handleChange('subjectId', e.target.value)}
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Pilih Mata Pelajaran</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tenggat Waktu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.dueDate}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    {/* Attachments Placeholder */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Lampiran (Opsional)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Link URL Dokumen..."
                                className="flex-1 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const val = e.currentTarget.value
                                        if (val) {
                                            handleChange('attachments', [...formData.attachments, { url: val, filename: val, type: 'LINK' }])
                                            e.currentTarget.value = ''
                                        }
                                    }
                                }}
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="p-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} className="text-gray-500 dark:text-gray-300" />}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload</span>
                                </button>
                            </div>
                        </div>
                        {formData.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {formData.attachments.map((att, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-sm">
                                        <div className="flex items-center gap-2 truncate">
                                            <Paperclip size={14} className="flex-shrink-0 text-gray-500" />
                                            <a
                                                href={att.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate max-w-[200px] text-primary hover:underline"
                                            >
                                                {att.filename}
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('attachments', formData.attachments.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-text-secondary mt-1">
                            Tekan Enter untuk menambahkan Link URL, atau klik tombol Upload untuk mengunggah file.
                        </p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Deskripsi / Instruksi
                        </label>
                        <textarea
                            rows={6}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Tuliskan detail instruksi tugas di sini..."
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-color dark:border-gray-700">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-primary/30"
                    >
                        {submitting ? <LoadingSpinner size="sm" /> : <Save size={18} />}
                        Simpan Tugas
                    </button>
                </div>
            </form>
        </div>
    )
}
