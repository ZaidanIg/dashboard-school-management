
import { useState, useEffect } from 'react'
import type { Teacher } from '../../types'
import { Save, User, MapPin, BookOpen, Wand2, GraduationCap, Upload, FileText, X } from 'lucide-react'
import { useSubjects } from '@/hooks/useAcademic'

interface TeacherFormProps {
    initialData?: Partial<Teacher>
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
    onCancel?: () => void
}

type TabType = 'pribadi' | 'kontak' | 'pendidikan' | 'profesi'

export default function TeacherForm({ initialData = {}, onSubmit, loading, onCancel }: TeacherFormProps) {
    const [activeTab, setActiveTab] = useState<TabType>('pribadi')
    const [formData, setFormData] = useState<Partial<Teacher>>({
        status: 'ACTIVE',
        gender: 'MALE',
        position: 'PNS',
        isCertified: false,
        ...initialData
    })
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    const { subjects, loading: subjectsLoading } = useSubjects()

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({ ...prev, ...initialData }))
            if (initialData.subjects) {
                setSelectedSubjectIds(initialData.subjects.map(s => s.subjectId))
            }
        }
    }, [JSON.stringify(initialData)])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const handleSubjectChange = (subjectId: string) => {
        setSelectedSubjectIds(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        )
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const form = new FormData()
        form.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: form
            })
            const data = await res.json()
            if (res.ok) {
                setFormData(prev => ({ ...prev, certificationFile: data.url }))
            } else {
                alert('Upload failed: ' + (data.message || 'Unknown error'))
            }
        } catch (err) {
            console.error(err)
            alert('Upload error')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit({
            ...formData,
            subjectIds: selectedSubjectIds
        })
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'pribadi', label: 'Data Pribadi', icon: User },
        { id: 'kontak', label: 'Kontak & Alamat', icon: MapPin },
        { id: 'pendidikan', label: 'Pendidikan', icon: GraduationCap },
        { id: 'profesi', label: 'Data Profesi', icon: BookOpen }
    ]

    const isEditMode = !!initialData.id

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                                `}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">

                {/* --- TAB: DATA PRIBADI --- */}
                {activeTab === 'pribadi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap *</label>
                            <input type="text" name="name" required value={formData.name || ''} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email * (Wajib)</label>
                            <input type="email" name="email" required value={formData.email || ''} onChange={handleChange} className="input-field" />
                        </div>

                        {!isEditMode && (
                            <div className="space-y-1 md:col-span-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Akun *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="password"
                                        value={(formData as any).password || ''}
                                        onChange={handleChange}
                                        placeholder="Generate or type password..."
                                        className="input-field"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
                                            let pass = '';
                                            for (let i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                                            setFormData(prev => ({ ...prev, password: pass } as any));
                                        }}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        <Wand2 size={16} /> Generate
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Digunakan untuk login ke Teacher Portal.</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIK (Nomor Induk Kependudukan)</label>
                            <input type="text" name="nik" value={formData.nik || ''} onChange={handleChange} className="input-field" maxLength={16} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
                            <input type="text" name="nip" value={formData.nip || ''} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NUPTK</label>
                            <input type="text" name="nuptk" value={formData.nuptk || ''} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin *</label>
                            <select name="gender" required value={formData.gender || 'MALE'} onChange={handleChange} className="input-field">
                                <option value="MALE">Laki-laki</option>
                                <option value="FEMALE">Perempuan</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agama</label>
                            <select name="religion" value={formData.religion || ''} onChange={handleChange} className="input-field">
                                <option value="">Pilih Agama</option>
                                <option value="ISLAM">Islam</option>
                                <option value="KRISTEN">Kristen Protestan</option>
                                <option value="KATOLIK">Katolik</option>
                                <option value="HINDU">Hindu</option>
                                <option value="BUDDHA">Buddha</option>
                                <option value="KONGHUCU">Konghucu</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Pernikahan</label>
                            <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} className="input-field">
                                <option value="">Pilih Status</option>
                                <option value="SINGLE">Belum Menikah</option>
                                <option value="MARRIED">Menikah</option>
                                <option value="DIVORCED">Cerai</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempat Lahir</label>
                            <input type="text" name="birthPlace" value={formData.birthPlace || ''} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                            <input type="date" name="birthDate" value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''} onChange={handleChange} className="input-field" />
                        </div>
                    </div>
                )}

                {/* --- TAB: KONTAK --- */}
                {activeTab === 'kontak' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
                            <textarea name="address" rows={3} value={formData.address || ''} onChange={handleChange} className="input-field" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon / HP</label>
                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="input-field" />
                        </div>
                    </div>
                )}

                {/* --- TAB: PENDIDIKAN --- */}
                {activeTab === 'pendidikan' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendidikan Terakhir</label>
                            <select name="educationDegree" value={formData.educationDegree || ''} onChange={handleChange} className="input-field">
                                <option value="">Pilih Jenjang</option>
                                <option value="SMA">SMA/SMK</option>
                                <option value="D3">D3</option>
                                <option value="S1">S1 / D4</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            {/* Empty Spacer */}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Universitas / Institusi</label>
                            <input type="text" name="university" value={formData.university || ''} onChange={handleChange} className="input-field" placeholder="Nama Kampus" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jurusan / Prodi</label>
                            <input type="text" name="major" value={formData.major || ''} onChange={handleChange} className="input-field" placeholder="Jurusan" />
                        </div>
                    </div>
                )}

                {/* --- TAB: PROFESI --- */}
                {activeTab === 'profesi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posisi / Jabatan *</label>
                            <select name="position" required value={formData.position || 'PNS'} onChange={handleChange} className="input-field">
                                <option value="PNS">Guru PNS</option>
                                <option value="HONORER">Guru Honorer</option>
                                <option value="P3K">Guru P3K</option>
                                <option value="STAFF">Staff Tata Usaha</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Kepegawaian *</label>
                            <select name="status" required value={formData.status || 'ACTIVE'} onChange={handleChange} className="input-field">
                                <option value="ACTIVE">Aktif</option>
                                <option value="INACTIVE">Non-Aktif / Cuti</option>
                                <option value="RETIRED">Pensiun</option>
                                <option value="TRANSFERRED">Pindah Tugas</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <input
                                    type="checkbox"
                                    name="isCertified"
                                    id="isCertified"
                                    checked={formData.isCertified || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isCertified" className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                    Sudah Sertifikasi Pendidik
                                </label>
                            </div>
                        </div>

                        {/* Certification Upload */}
                        {formData.isCertified && (
                            <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bukti Sertifikasi (PDF/Image)</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    {formData.certificationFile ? (
                                        <div className="flex items-center gap-4 w-full max-w-sm bg-white dark:bg-gray-700 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                            <FileText className="text-green-500" />
                                            <div className="flex-1 truncate text-sm">
                                                <a href={formData.certificationFile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                    Lihat Bukti
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, certificationFile: undefined }))}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {uploading ? (
                                                <div className="text-sm text-gray-500">Mengupload...</div>
                                            ) : (
                                                <label className="cursor-pointer flex flex-col items-center">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full mb-2">
                                                        <Upload size={24} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Klik untuk upload bukti</span>
                                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                                                </label>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Bergabung</label>
                            <input type="date" name="joinDate" value={formData.joinDate ? new Date(formData.joinDate).toISOString().split('T')[0] : ''} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="md:col-span-2 space-y-2 mt-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran yang Diampu</label>
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                                {subjectsLoading ? (
                                    <div className="text-center py-4 text-sm text-gray-500">Memuat mata pelajaran...</div>
                                ) : subjects.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {subjects.map(subject => (
                                            <div key={subject.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`subject-${subject.id}`}
                                                    checked={selectedSubjectIds.includes(subject.id)}
                                                    onChange={() => handleSubjectChange(subject.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`subject-${subject.id}`} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                                    {subject.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">Tidak ada mata pelajaran tersedia.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    border-radius: 0.375rem;
                    border: 1px solid #d1d5db;
                    background-color: white;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                }
                .input-field:focus {
                    outline: none;
                    ring: 2px solid #3b82f6;
                    border-color: #3b82f6;
                }
                .dark .input-field {
                    border-color: #4b5563;
                    background-color: #374151;
                    color: white;
                }
                .btn-secondary {
                    padding: 0.5rem 0.75rem;
                    background-color: #f3f4f6;
                    color: #374151;
                    border-radius: 0.375rem;
                    border: 1px solid #d1d5db;
                    font-size: 0.875rem;
                }
                .btn-secondary:hover {
                    background-color: #e5e7eb;
                }
            `}</style>
        </form>
    )
}
