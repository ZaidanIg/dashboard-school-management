import { useState, useEffect } from 'react'
import { X, BookOpen, Save } from 'lucide-react'
import { useAcademicYears, useTeachers, type Class } from '@/hooks/useClasses'

interface ClassFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ClassFormData) => Promise<void>
    classData?: Class | null
    isLoading?: boolean
}

export interface ClassFormData {
    name: string
    grade: number
    major: string
    academicYearId: string
    homeroomTeacherId: string
    capacity: number
}

export default function ClassFormModal({
    isOpen,
    onClose,
    onSubmit,
    classData,
    isLoading
}: ClassFormModalProps) {
    const { years } = useAcademicYears()
    const { teachers } = useTeachers()

    const [formData, setFormData] = useState<ClassFormData>({
        name: '',
        grade: 10,
        major: '',
        academicYearId: '',
        homeroomTeacherId: '',
        capacity: 36
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Update form data when classData changes (for editing)
    useEffect(() => {
        if (classData) {
            setFormData({
                name: classData.name || '',
                grade: classData.grade || 10,
                major: classData.major || '',
                academicYearId: classData.academicYearId || '',
                homeroomTeacherId: classData.homeroomTeacherId || '',
                capacity: classData.capacity || 36
            })
        } else {
            // Reset form for new class
            setFormData({
                name: '',
                grade: 10,
                major: '',
                academicYearId: '',
                homeroomTeacherId: '',
                capacity: 36
            })
        }
        setErrors({})
    }, [classData, isOpen])

    if (!isOpen) return null

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nama kelas wajib diisi'
        }
        if (!formData.academicYearId) {
            newErrors.academicYearId = 'Tahun ajaran wajib dipilih'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    const handleChange = (field: keyof ClassFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                {classData ? 'Edit Kelas' : 'Tambah Kelas Baru'}
                            </h2>
                            <p className="text-sm text-text-secondary">
                                {classData ? 'Perbarui informasi kelas' : 'Buat kelas baru'}
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Nama Kelas <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Contoh: 10-A, XI IPA-1"
                            className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.name
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-border-color dark:border-gray-600 bg-slate-50 dark:bg-gray-700'
                                }`}
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Grade & Major Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                Tingkat
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => handleChange('grade', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-slate-50 dark:bg-gray-700"
                            >
                                <option value={10}>Kelas 10</option>
                                <option value={11}>Kelas 11</option>
                                <option value={12}>Kelas 12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                Jurusan
                            </label>
                            <select
                                value={formData.major}
                                onChange={(e) => handleChange('major', e.target.value)}
                                className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-slate-50 dark:bg-gray-700"
                            >
                                <option value="">-- Pilih Jurusan --</option>
                                <option value="IPA">IPA</option>
                                <option value="IPS">IPS</option>
                                <option value="BAHASA">Bahasa</option>
                                <option value="UMUM">Umum</option>
                            </select>
                        </div>
                    </div>

                    {/* Academic Year */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Tahun Ajaran <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={formData.academicYearId}
                            onChange={(e) => handleChange('academicYearId', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.academicYearId
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-border-color dark:border-gray-600 bg-slate-50 dark:bg-gray-700'
                                }`}
                        >
                            <option value="">-- Pilih Tahun Ajaran --</option>
                            {years.map(year => (
                                <option key={year.id} value={year.id}>
                                    {year.name} {year.isActive && '(Aktif)'}
                                </option>
                            ))}
                        </select>
                        {errors.academicYearId && <p className="text-xs text-rose-500 mt-1">{errors.academicYearId}</p>}
                    </div>

                    {/* Homeroom Teacher */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Wali Kelas
                        </label>
                        <select
                            value={formData.homeroomTeacherId}
                            onChange={(e) => handleChange('homeroomTeacherId', e.target.value)}
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-slate-50 dark:bg-gray-700"
                        >
                            <option value="">-- Pilih Wali Kelas --</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            Kapasitas
                        </label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 36)}
                            min={1}
                            max={50}
                            className="w-full px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-slate-50 dark:bg-gray-700"
                        />
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
                                {classData ? 'Update Kelas' : 'Tambah Kelas'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
