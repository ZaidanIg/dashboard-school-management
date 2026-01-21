import { useState, useEffect } from 'react'
import type { Student } from '../../types'
import { Save } from 'lucide-react'

interface StudentFormProps {
    initialData?: Partial<Student>
    onSubmit: (data: Partial<Student>, photoFile?: File) => Promise<void>
    loading?: boolean
    onCancel?: () => void
}

type TabType = 'pribadi' | 'alamat' | 'orangtua' | 'akademik'

export default function StudentForm({ initialData = {}, onSubmit, loading, onCancel }: StudentFormProps) {
    const [activeTab, setActiveTab] = useState<TabType>('pribadi')
    const [photoFile, setPhotoFile] = useState<File | undefined>()
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData.photo || undefined)
    const [formData, setFormData] = useState<Partial<Student>>({
        status: 'ACTIVE',
        gender: 'MALE',
        ...initialData
    })

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({ ...prev, ...initialData }))
            if (initialData.photo) setPreviewUrl(initialData.photo)
        }
    }, [JSON.stringify(initialData)])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran foto maksimal 5MB')
                return
            }
            setPhotoFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData, photoFile)
    }

    const tabs: { id: TabType; label: string }[] = [
        { id: 'pribadi', label: 'Data Pribadi' },
        { id: 'alamat', label: 'Alamat' },
        { id: 'orangtua', label: 'Orang Tua / Wali' },
        { id: 'akademik', label: 'Akademik' }
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                {activeTab === 'pribadi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2">Identitas Siswa</h3>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Foto Siswa</label>
                            <div className="flex items-center gap-4">
                                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                    {previewUrl ? (
                                        <img src={previewUrl.startsWith('http') || previewUrl.startsWith('blob') ? previewUrl : `${import.meta.env.VITE_API_URL}${previewUrl}`} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-400 text-center px-2">Tidak ada foto</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF max 5MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIK (Nomor Induk Kependudukan)</label>
                            <input
                                type="text"
                                name="nik"
                                value={formData.nik || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIS (Nomor Induk Sekolah) *</label>
                            <input
                                type="text"
                                name="nis"
                                required
                                value={formData.nis || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NISN</label>
                            <input
                                type="text"
                                name="nisn"
                                value={formData.nisn || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin *</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender || 'MALE'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="MALE">Laki-laki</option>
                                <option value="FEMALE">Perempuan</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agama</label>
                            <select
                                name="religion"
                                value={formData.religion || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Pilih Agama</option>
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddha">Buddha</option>
                                <option value="Konghucu">Konghucu</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempat Lahir</label>
                            <input
                                type="text"
                                name="birthPlace"
                                value={formData.birthPlace || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon / HP</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                placeholder="08xxxxxxxxxx"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Email for Student Portal Login */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                Email Siswa (Untuk Login Student Portal)
                                <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-300">PENTING</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder="email@siswa.com"
                                className="w-full rounded-md border border-blue-300 bg-blue-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-600 dark:bg-blue-900/20 dark:text-white"
                            />
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                ⚠️ Email ini akan digunakan siswa untuk login ke Student Portal. Pastikan email sesuai dengan akun yang terdaftar.
                            </p>
                        </div>


                    </div>
                )}

                {activeTab === 'alamat' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2">Alamat Domisili</h3>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Lengkap (Jalan)</label>
                            <textarea
                                name="address"
                                rows={2}
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">RT</label>
                                <input
                                    type="text"
                                    name="rt"
                                    value={formData.rt || ''}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">RW</label>
                                <input
                                    type="text"
                                    name="rw"
                                    value={formData.rw || ''}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelurahan/Desa</label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kecamatan</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kabupaten/Kota</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Provinsi</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kode Pos</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon / HP</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'orangtua' && (
                    <div className="space-y-8">
                        {/* Ayah Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2 border-b pb-2">Data Ayah Kandung</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Ayah</label>
                                <input type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIK Ayah</label>
                                <input type="text" name="fatherNik" value={formData.fatherNik || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pekerjaan</label>
                                <input type="text" name="fatherJob" value={formData.fatherJob || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendidikan Terakhir</label>
                                <input type="text" name="fatherEducation" value={formData.fatherEducation || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon Ayah</label>
                                <input type="text" name="fatherPhone" value={formData.fatherPhone || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                        </div>

                        {/* Ibu Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2 border-b pb-2">Data Ibu Kandung</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Ibu</label>
                                <input type="text" name="motherName" value={formData.motherName || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIK Ibu</label>
                                <input type="text" name="motherNik" value={formData.motherNik || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pekerjaan</label>
                                <input type="text" name="motherJob" value={formData.motherJob || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendidikan Terakhir</label>
                                <input type="text" name="motherEducation" value={formData.motherEducation || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon Ibu</label>
                                <input type="text" name="motherPhone" value={formData.motherPhone || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                        </div>

                        {/* Wali Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2 border-b pb-2">Data Wali (Opsional)</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Wali</label>
                                <input type="text" name="guardianName" value={formData.guardianName || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hubungan dengan Siswa</label>
                                <input type="text" name="guardianRelation" value={formData.guardianRelation || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIK Wali</label>
                                <input type="text" name="guardianNik" value={formData.guardianNik || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pekerjaan</label>
                                <input type="text" name="guardianJob" value={formData.guardianJob || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon Wali</label>
                                <input type="text" name="guardianPhone" value={formData.guardianPhone || ''} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'akademik' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white md:col-span-2">Data Akademik</h3>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Siswa</label>
                            <select
                                name="status"
                                value={formData.status || 'ACTIVE'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="ACTIVE">Aktif</option>
                                <option value="INACTIVE">Non-Aktif</option>
                                <option value="GRADUATED">Lulus</option>
                                <option value="TRANSFERRED">Pindah</option>
                                <option value="DROPPED">Keluar/DO</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Masuk</label>
                            <input
                                type="date"
                                name="enrollmentDate"
                                value={formData.enrollmentDate ? new Date(formData.enrollmentDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sekolah Asal</label>
                            <input
                                type="text"
                                name="previousSchool"
                                value={formData.previousSchool || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
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
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </div>
        </form>
    )
}
