import { useState, useEffect } from 'react'
import { X, Users, Calendar, MapPin } from 'lucide-react'
import { type Extracurricular, type ExtracurricularFormData } from '@/hooks/useExtracurriculars'
import { useTeachers } from '@/hooks/useTeachers'

interface ExtracurricularFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ExtracurricularFormData) => Promise<void>
    extracurricular?: Extracurricular | null
    isLoading?: boolean
}

const CATEGORIES = ['Wajib', 'Olahraga', 'Seni', 'Akademik', 'Teknologi', 'Bahasa']

export default function ExtracurricularFormModal({
    isOpen,
    onClose,
    onSubmit,
    extracurricular,
    isLoading
}: ExtracurricularFormModalProps) {
    const [formData, setFormData] = useState<ExtracurricularFormData>({
        name: '',
        category: 'Olahraga',
        description: '',
        schedule: '',
        location: '',
        advisorId: null,
        maxMembers: null,
        isActive: true
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { teachers } = useTeachers()

    useEffect(() => {
        if (extracurricular) {
            setFormData({
                name: extracurricular.name,
                category: extracurricular.category,
                description: extracurricular.description || '',
                schedule: extracurricular.schedule || '',
                location: extracurricular.location || '',
                advisorId: extracurricular.advisorId,
                maxMembers: extracurricular.maxMembers,
                isActive: extracurricular.isActive
            })
        } else {
            setFormData({
                name: '',
                category: 'Olahraga',
                description: '',
                schedule: '',
                location: '',
                advisorId: null,
                maxMembers: null,
                isActive: true
            })
        }
        setErrors({})
    }, [extracurricular, isOpen])

    if (!isOpen) return null

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
        if (!formData.category) newErrors.category = 'Kategori wajib dipilih'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    const isEdit = !!extracurricular

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                {isEdit ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
                            </h2>
                            <p className="text-sm text-text-secondary">
                                {isEdit ? 'Perbarui data ekstrakurikuler' : 'Buat ekstrakurikuler baru'}
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Nama Ekstrakurikuler *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            placeholder="contoh: Basket, Pramuka, dll"
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Kategori *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            placeholder="Deskripsi kegiatan"
                        />
                    </div>

                    {/* Schedule & Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <Calendar size={14} className="inline mr-1" />
                                Jadwal
                            </label>
                            <input
                                type="text"
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                placeholder="Senin, 14:00-16:00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <MapPin size={14} className="inline mr-1" />
                                Lokasi
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                placeholder="Lapangan, Ruang Musik"
                            />
                        </div>
                    </div>

                    {/* Advisor */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Pembina
                        </label>
                        <select
                            value={formData.advisorId || ''}
                            onChange={(e) => setFormData({ ...formData, advisorId: e.target.value || null })}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        >
                            <option value="">-- Pilih Pembina --</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Max Members & Active */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                Maks. Anggota
                            </label>
                            <input
                                type="number"
                                value={formData.maxMembers || ''}
                                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value ? parseInt(e.target.value) : null })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                placeholder="Tidak dibatasi"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-border-color"
                                />
                                <span className="text-sm text-text-main dark:text-white">Aktif</span>
                            </label>
                        </div>
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
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Ekskul'}
                    </button>
                </div>
            </div>
        </div>
    )
}
