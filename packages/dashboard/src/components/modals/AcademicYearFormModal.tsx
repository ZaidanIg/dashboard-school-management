import { useState, useEffect } from 'react'
import { X, Calendar, Save } from 'lucide-react'
import type { AcademicYear } from '@/hooks/useAcademicYears'

interface AcademicYearFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: AcademicYearFormData) => Promise<void>
    yearData?: AcademicYear | null
    isLoading?: boolean
}

export interface AcademicYearFormData {
    name: string
    startDate: string
    endDate: string
    isActive: boolean
}

export default function AcademicYearFormModal({
    isOpen,
    onClose,
    onSubmit,
    yearData,
    isLoading
}: AcademicYearFormModalProps) {
    const [formData, setFormData] = useState<AcademicYearFormData>({
        name: '',
        startDate: '',
        endDate: '',
        isActive: false
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Update form when yearData changes
    useEffect(() => {
        if (yearData) {
            setFormData({
                name: yearData.name || '',
                startDate: yearData.startDate?.split('T')[0] || '',
                endDate: yearData.endDate?.split('T')[0] || '',
                isActive: yearData.isActive || false
            })
        } else {
            setFormData({ name: '', startDate: '', endDate: '', isActive: false })
        }
    }, [yearData])

    if (!isOpen) return null

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nama tahun ajaran wajib diisi'
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Tanggal mulai wajib diisi'
        }
        if (!formData.endDate) {
            newErrors.endDate = 'Tanggal selesai wajib diisi'
        }
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    const handleChange = (field: keyof AcademicYearFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // Auto-generate name from dates
    const autoGenerateName = () => {
        if (formData.startDate && formData.endDate) {
            const startYear = new Date(formData.startDate).getFullYear()
            const endYear = new Date(formData.endDate).getFullYear()
            setFormData(prev => ({ ...prev, name: `${startYear}/${endYear}` }))
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                {yearData ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                            </h2>
                            <p className="text-sm text-text-secondary">
                                {yearData ? 'Perbarui informasi tahun ajaran' : 'Buat tahun ajaran baru'}
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tanggal Mulai <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            onBlur={autoGenerateName}
                            className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.startDate
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-border-color dark:border-gray-600 bg-slate-50 dark:bg-gray-700'
                                }`}
                        />
                        {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tanggal Selesai <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            onBlur={autoGenerateName}
                            className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.endDate
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-border-color dark:border-gray-600 bg-slate-50 dark:bg-gray-700'
                                }`}
                        />
                        {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Nama Tahun Ajaran <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Contoh: 2024/2025"
                            className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.name
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-border-color dark:border-gray-600 bg-slate-50 dark:bg-gray-700'
                                }`}
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        <p className="text-xs text-text-secondary mt-1">Nama akan otomatis dibuat dari tanggal</p>
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleChange('isActive', e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm">
                            <span className="font-medium text-text-main dark:text-white">Aktifkan Tahun Ajaran</span>
                            <p className="text-xs text-text-secondary">Tahun ajaran lain akan dinonaktifkan</p>
                        </label>
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
                        className="px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {yearData ? 'Update' : 'Simpan'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
