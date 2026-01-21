import { useState, useEffect, useRef } from 'react'
import { X, Upload, Link as LinkIcon, FileText, Image as ImageIcon, Trash2, Plus, Loader2 } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { useClasses } from '@/hooks/useClasses'
import { useSubjects } from '@/hooks/useSubjects'
import { useTeachers } from '@/hooks/useTeachers'
import { useLMSMutations } from '@/hooks/useLMS'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

interface AssignmentFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

interface Attachment {
    type: 'FILE' | 'LINK' | 'IMAGE' | 'VIDEO'
    url: string
    filename?: string // Used as display title
    size?: number
    mimeType?: string
}

export default function AssignmentFormModal({ isOpen, onClose, onSuccess }: AssignmentFormModalProps) {
    const { user } = useAuth()
    const { success, error: toastError } = useToast()
    const { classes } = useClasses()
    const { subjects } = useSubjects()
    const { teachers } = useTeachers()
    const { createAssignment, loading: submitting } = useLMSMutations()

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        teacherId: '',
        dueDate: '',
        maxScore: 100
    })

    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [uploading, setUploading] = useState(false)
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkInput, setLinkInput] = useState({ url: '', title: '' })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (user?.role === 'TEACHER' && !formData.teacherId) {
            const myProfile = teachers.find(t => t.userId === user.id)
            if (myProfile) {
                setFormData(prev => ({ ...prev, teacherId: myProfile.id }))
            } else {
                setFormData(prev => ({ ...prev, teacherId: user.id }))
            }
        }
    }, [user, teachers])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setUploading(true)
        const files = Array.from(e.target.files)
        const newAttachments: Attachment[] = []

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                toastError('File Terlalu Besar', `File ${file.name} melebihi batas 5MB`)
                continue
            }

            const formData = new FormData()
            formData.append('file', file)

            try {
                const res = await api.post<{ url: string, filename: string, mimetype: string, size: number }>('/api/upload', formData)
                const type = res.mimetype.startsWith('image/') ? 'IMAGE' : res.mimetype.startsWith('video/') ? 'VIDEO' : 'FILE'
                newAttachments.push({
                    type,
                    url: res.url,
                    filename: file.name, // Display Name
                    size: res.size,
                    mimeType: res.mimetype
                })
            } catch (err: any) {
                console.error(err)
                toastError('Gagal Upload', `Gagal mengupload ${file.name}: ${err.message || 'Error'}`)
            }
        }

        setAttachments(prev => [...prev, ...newAttachments])
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const addLink = () => {
        if (!linkInput.url) return
        setAttachments(prev => [...prev, {
            type: 'LINK',
            url: linkInput.url,
            filename: linkInput.title || linkInput.url
        }])
        setLinkInput({ url: '', title: '' })
        setShowLinkInput(false)
    }

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createAssignment({
                ...formData,
                teacherId: formData.teacherId,
                attachments
            })
            success('Berhasil', 'Tugas berhasil dibuat')
            onSuccess()
            setFormData({
                title: '',
                description: '',
                classId: '',
                subjectId: '',
                teacherId: '',
                dueDate: '',
                maxScore: 100
            })
            setAttachments([])
        } catch (error) {
            console.error(error)
            toastError('Gagal', 'Gagal membuat tugas. Pastikan data lengkap.')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Buat Tugas Baru</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Metadata */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Tugas</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Judul Tugas"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kelas</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.classId}
                                        onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                    >
                                        <option value="">Pilih Kelas</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mapel</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.subjectId}
                                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                    >
                                        <option value="">Pilih Mapel</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {user?.role !== 'TEACHER' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Guru</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.teacherId}
                                        onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                    >
                                        <option value="">Pilih Guru</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tenggat</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Poin Max</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.maxScore}
                                        onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Attachments Area */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Lampiran</label>
                                {attachments.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {attachments.map((att, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {att.type === 'LINK' ? <LinkIcon size={16} className="text-blue-500" /> :
                                                        att.type === 'IMAGE' ? <ImageIcon size={16} className="text-purple-500" /> :
                                                            <FileText size={16} className="text-orange-500" />}
                                                    <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 truncate max-w-[200px]">{att.filename || 'File'}</a>
                                                </div>
                                                <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 rounded-lg border border-gray-300">
                                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
                                    </button>
                                    <button type="button" onClick={() => setShowLinkInput(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 rounded-lg border border-gray-300">
                                        <LinkIcon size={14} /> Link
                                    </button>
                                </div>
                                {showLinkInput && (
                                    <div className="mt-2 flex gap-2">
                                        <input type="url" placeholder="URL" className="px-2 py-1 text-xs border rounded flex-1" value={linkInput.url} onChange={e => setLinkInput({ ...linkInput, url: e.target.value })} />
                                        <button type="button" onClick={addLink} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Add</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Editor */}
                        <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium mb-1">Deskripsi & Instruksi</label>
                            <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex flex-col h-[400px]">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={value => setFormData({ ...formData, description: value })}
                                    className="h-full flex flex-col"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'clean']
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Batal</button>
                        <button type="submit" disabled={submitting || uploading} className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:opacity-50">
                            {submitting ? 'Menyimpan...' : 'Buat Tugas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
