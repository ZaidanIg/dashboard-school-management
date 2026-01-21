import { useState, useEffect } from 'react'
import { X, FileText, Calendar, User, Briefcase } from 'lucide-react'
import { type TeacherPermitFormData } from '@/hooks/useTeacherPermits'
import { useTeachers } from '@/hooks/useTeachers'

interface TeacherPermitFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: TeacherPermitFormData) => Promise<void>
    isLoading?: boolean
}

const PERMIT_TYPES = [
    { value: 'SICK', label: 'Sakit' },
    { value: 'FAMILY', label: 'Keluarga' },
    { value: 'OFFICIAL', label: 'Dinas/Resmi' },
    { value: 'OTHER', label: 'Lainnya' }
]

export default function TeacherPermitFormModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading
}: TeacherPermitFormModalProps) {
    const [formData, setFormData] = useState<TeacherPermitFormData>({
        teacherId: '',
        type: 'SICK',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
    })
    const [teacherSearch, setTeacherSearch] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { teachers, loading: teachersLoading } = useTeachers({ search: teacherSearch, limit: 10 })

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                teacherId: '',
                type: 'SICK',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                reason: ''
            })
            setTeacherSearch('')
            setErrors({})
        }
    }, [isOpen])

    if (!isOpen) return null

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!formData.teacherId) newErrors.teacherId = 'Guru wajib dipilih'
        if (!formData.type) newErrors.type = 'Jenis izin wajib dipilih'
        if (!formData.startDate) newErrors.startDate = 'Tanggal mulai wajib diisi'
        if (!formData.endDate) newErrors.endDate = 'Tanggal selesai wajib diisi'
        if (!formData.reason.trim()) newErrors.reason = 'Alasan wajib diisi'
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    const selectedTeacher = teachers.find(t => t.id === formData.teacherId)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                Ajukan Izin Guru
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Buat pengajuan izin baru untuk guru/staff
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                    {/* Teacher Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            <User size={14} className="inline mr-1" />
                            Pilih Guru *
                        </label>
                        <input
                            type="text"
                            value={selectedTeacher ? selectedTeacher.name : teacherSearch}
                            onChange={(e) => {
                                setTeacherSearch(e.target.value)
                                setFormData({ ...formData, teacherId: '' })
                            }}
                            placeholder="Cari nama guru..."
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        />
                        {teacherSearch && !formData.teacherId && teachers.length > 0 && (
                            <div className="mt-1 max-h-40 overflow-y-auto border border-border-color dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                {teachersLoading ? (
                                    <div className="p-3 text-center text-text-secondary text-sm">Memuat...</div>
                                ) : (
                                    teachers.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, teacherId: t.id })
                                                setTeacherSearch('')
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center justify-between"
                                        >
                                            <span className="font-medium">{t.name}</span>
                                            <span className="text-xs text-text-secondary px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                                {t.position}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                        {errors.teacherId && <p className="text-xs text-rose-500 mt-1">{errors.teacherId}</p>}
                    </div>

                    {/* Permit Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            <Briefcase size={14} className="inline mr-1" />
                            Jenis Izin *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        >
                            {PERMIT_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        {errors.type && <p className="text-xs text-rose-500 mt-1">{errors.type}</p>}
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <Calendar size={14} className="inline mr-1" />
                                Tanggal Mulai *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            />
                            {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <Calendar size={14} className="inline mr-1" />
                                Tanggal Selesai *
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            />
                            {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Alasan *
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            placeholder="Jelaskan alasan perizinan... (misal: Sakit demam, Dinas luar kota)"
                        />
                        {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border-color dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        Ajukan Izin
                    </button>
                </div>
            </div>
        </div>
    )
}
