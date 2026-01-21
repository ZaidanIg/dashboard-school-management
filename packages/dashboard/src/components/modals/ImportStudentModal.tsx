import { useState, useRef, useMemo } from 'react'
import { X, FileSpreadsheet, Upload, AlertCircle, CheckCircle, Download, Settings, ArrowRight } from 'lucide-react'
import { downloadImportTemplate, importStudents, type ImportStudentData } from '@/services/studentApi'

interface ImportStudentModalProps {
    isOpen: boolean
    onClose: () => void
    onImport: () => void
}

// System fields that can be mapped
const SYSTEM_FIELDS = [
    { key: 'nis', label: 'NIS', required: true, description: 'Nomor Induk Siswa' },
    { key: 'nisn', label: 'NISN', required: false, description: 'Nomor Induk Siswa Nasional' },
    { key: 'nik', label: 'NIK', required: false, description: 'Nomor Induk Kependudukan' },
    { key: 'name', label: 'Nama Lengkap', required: true, description: 'Nama lengkap siswa' },
    { key: 'gender', label: 'Jenis Kelamin', required: false, description: 'MALE/FEMALE atau L/P' },
    { key: 'birthPlace', label: 'Tempat Lahir', required: false, description: 'Kota/kabupaten kelahiran' },
    { key: 'birthDate', label: 'Tanggal Lahir', required: false, description: 'Format YYYY-MM-DD' },
    { key: 'religion', label: 'Agama', required: false, description: 'Agama siswa' },
    { key: 'address', label: 'Alamat', required: false, description: 'Alamat lengkap' },
    { key: 'rt', label: 'RT', required: false, description: 'Rukun Tetangga' },
    { key: 'rw', label: 'RW', required: false, description: 'Rukun Warga' },
    { key: 'village', label: 'Kelurahan/Desa', required: false, description: 'Kelurahan atau desa' },
    { key: 'district', label: 'Kecamatan', required: false, description: 'Kecamatan' },
    { key: 'city', label: 'Kota/Kabupaten', required: false, description: 'Kota atau kabupaten' },
    { key: 'province', label: 'Provinsi', required: false, description: 'Provinsi' },
    { key: 'postalCode', label: 'Kode Pos', required: false, description: 'Kode pos' },
    { key: 'phone', label: 'No HP Siswa', required: false, description: 'Nomor HP siswa' },
    { key: 'email', label: 'Email', required: false, description: 'Email siswa' },
    { key: 'fatherName', label: 'Nama Ayah', required: false, description: 'Nama lengkap ayah' },
    { key: 'motherName', label: 'Nama Ibu', required: false, description: 'Nama lengkap ibu' },
    { key: 'fatherJob', label: 'Pekerjaan Ayah', required: false, description: 'Pekerjaan ayah' },
    { key: 'motherJob', label: 'Pekerjaan Ibu', required: false, description: 'Pekerjaan ibu' },
    { key: 'parentPhone', label: 'No HP Orang Tua', required: false, description: 'Nomor HP orang tua' },
    { key: 'parentEmail', label: 'Email Orang Tua', required: false, description: 'Email orang tua' },
    { key: 'entryYear', label: 'Tahun Masuk', required: false, description: 'Tahun masuk sekolah' },
    { key: 'previousSchool', label: 'Asal Sekolah', required: false, description: 'Nama sekolah sebelumnya' },
]

// Common Dapodik field mappings
const DAPODIK_PRESETS: Record<string, string> = {
    'peserta_didik_id': '',
    'nama': 'name',
    'nisn': 'nisn',
    'nik': 'nik',
    'jenis_kelamin': 'gender',
    'tempat_lahir': 'birthPlace',
    'tanggal_lahir': 'birthDate',
    'agama': 'religion',
    'alamat_jalan': 'address',
    'rt': 'rt',
    'rw': 'rw',
    'dusun': '',
    'kelurahan': 'village',
    'kecamatan': 'district',
    'kode_pos': 'postalCode',
    'nama_ayah': 'fatherName',
    'nama_ibu': 'motherName',
    'pekerjaan_ayah': 'fatherJob',
    'pekerjaan_ibu': 'motherJob',
    'no_telepon': 'parentPhone',
    'email': 'email',
}

type ImportStep = 'upload' | 'mapping' | 'preview'

export default function ImportStudentModal({ isOpen, onClose, onImport }: ImportStudentModalProps) {
    const [step, setStep] = useState<ImportStep>('upload')
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rawData, setRawData] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
    const [preview, setPreview] = useState<ImportStudentData[]>([])
    const [updateExisting, setUpdateExisting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Get unmapped required fields
    const unmappedRequired = useMemo(() => {
        const mappedKeys = Object.values(columnMapping).filter(v => v)
        return SYSTEM_FIELDS.filter(f => f.required && !mappedKeys.includes(f.key))
    }, [columnMapping])

    if (!isOpen) return null

    const parseCSVRaw = (text: string): string[][] => {
        const lines = text.split('\n').filter(l => l.trim())
        return lines.map(line => {
            const values: string[] = []
            let current = ''
            let inQuotes = false

            for (let i = 0; i < line.length; i++) {
                const char = line[i]
                if (char === '"') {
                    inQuotes = !inQuotes
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim())
                    current = ''
                } else {
                    current += char
                }
            }
            values.push(current.trim())
            return values
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setError(null)
        setFile(selectedFile)

        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ]

        if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
            setError('Format file tidak didukung. Gunakan file Excel (.xlsx, .xls) atau CSV.')
            return
        }

        setIsLoading(true)
        try {
            const text = await selectedFile.text()
            const data = parseCSVRaw(text)

            if (data.length < 2) {
                setError('File harus memiliki minimal 1 baris data selain header.')
                return
            }

            const fileHeaders = data[0].map(h => h.toLowerCase().trim())
            setHeaders(data[0])
            setRawData(data.slice(1))

            // Auto-detect mappings
            const autoMapping: Record<string, string> = {}
            fileHeaders.forEach((header, index) => {
                // Check Dapodik preset first
                if (DAPODIK_PRESETS[header]) {
                    autoMapping[data[0][index]] = DAPODIK_PRESETS[header]
                    return
                }

                // Check common variations
                const variations: Record<string, string> = {
                    'nis': 'nis',
                    'no induk': 'nis',
                    'nomor induk siswa': 'nis',
                    'nisn': 'nisn',
                    'no induk nasional': 'nisn',
                    'nik': 'nik',
                    'no ktp': 'nik',
                    'nama': 'name',
                    'nama lengkap': 'name',
                    'nama siswa': 'name',
                    'jenis kelamin': 'gender',
                    'jk': 'gender',
                    'l/p': 'gender',
                    'gender': 'gender',
                    'tempat lahir': 'birthPlace',
                    'tmp lahir': 'birthPlace',
                    'tanggal lahir': 'birthDate',
                    'tgl lahir': 'birthDate',
                    'ttl': 'birthDate',
                    'agama': 'religion',
                    'alamat': 'address',
                    'alamat lengkap': 'address',
                    'alamat rumah': 'address',
                    'rt': 'rt',
                    'rw': 'rw',
                    'kelurahan': 'village',
                    'desa': 'village',
                    'kecamatan': 'district',
                    'kota': 'city',
                    'kabupaten': 'city',
                    'provinsi': 'province',
                    'kode pos': 'postalCode',
                    'no hp': 'phone',
                    'no telp': 'phone',
                    'telepon': 'phone',
                    'hp': 'phone',
                    'email': 'email',
                    'nama ayah': 'fatherName',
                    'ayah': 'fatherName',
                    'nama ibu': 'motherName',
                    'ibu': 'motherName',
                    'pekerjaan ayah': 'fatherJob',
                    'pekerjaan ibu': 'motherJob',
                    'no hp ortu': 'parentPhone',
                    'hp orang tua': 'parentPhone',
                    'tahun masuk': 'entryYear',
                    'asal sekolah': 'previousSchool',
                    'sekolah asal': 'previousSchool',
                }

                if (variations[header]) {
                    autoMapping[data[0][index]] = variations[header]
                }
            })

            setColumnMapping(autoMapping)
            setStep('mapping')
        } catch {
            setError('Gagal membaca file. Pastikan format file benar.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleMappingChange = (csvColumn: string, systemField: string) => {
        setColumnMapping(prev => ({ ...prev, [csvColumn]: systemField }))
    }

    const applyDapodikPreset = () => {
        const newMapping: Record<string, string> = {}
        headers.forEach(header => {
            const lowerHeader = header.toLowerCase().trim()
            if (DAPODIK_PRESETS[lowerHeader]) {
                newMapping[header] = DAPODIK_PRESETS[lowerHeader]
            }
        })
        setColumnMapping(newMapping)
    }

    const processData = () => {
        const students: ImportStudentData[] = []

        for (const row of rawData) {
            const student: Record<string, string> = {}

            headers.forEach((header, index) => {
                const systemField = columnMapping[header]
                if (systemField && row[index]) {
                    let value = row[index].replace(/^"|"$/g, '').trim()

                    // Convert gender
                    if (systemField === 'gender') {
                        value = value.toUpperCase()
                        if (value === 'L' || value === 'LAKI-LAKI') value = 'MALE'
                        if (value === 'P' || value === 'PEREMPUAN') value = 'FEMALE'
                    }

                    student[systemField] = value
                }
            })

            // Only add if required fields present
            if (student.nis && student.name) {
                students.push(student as unknown as ImportStudentData)
            }
        }

        setPreview(students)
        setStep('preview')
    }

    const handleImport = async () => {
        if (preview.length === 0) return

        setIsLoading(true)
        setError(null)

        try {
            const result = await importStudents(preview, updateExisting)
            console.log('Import result:', result)
            onImport()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengimpor data.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadTemplate = async () => {
        try {
            await downloadImportTemplate()
        } catch {
            setError('Gagal mengunduh template.')
        }
    }

    const resetModal = () => {
        setStep('upload')
        setFile(null)
        setRawData([])
        setHeaders([])
        setColumnMapping({})
        setPreview([])
        setError(null)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <Upload size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">Import Data Siswa</h2>
                            <p className="text-sm text-text-secondary">
                                {step === 'upload' && 'Pilih file untuk diimport'}
                                {step === 'mapping' && 'Sesuaikan kolom dengan field sistem'}
                                {step === 'preview' && 'Preview data yang akan diimport'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step === 'upload' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'}`}>1</span>
                            <span className={step === 'upload' ? 'text-primary font-medium' : 'text-emerald-500'}>Upload</span>
                            <ArrowRight size={14} className="text-text-secondary" />
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step === 'mapping' ? 'bg-primary text-white' : step === 'preview' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-gray-600 text-text-secondary'}`}>2</span>
                            <span className={step === 'mapping' ? 'text-primary font-medium' : step === 'preview' ? 'text-emerald-500' : 'text-text-secondary'}>Mapping</span>
                            <ArrowRight size={14} className="text-text-secondary" />
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step === 'preview' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-gray-600 text-text-secondary'}`}>3</span>
                            <span className={step === 'preview' ? 'text-primary font-medium' : 'text-text-secondary'}>Import</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                            <X size={20} className="text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Step 1: Upload */}
                    {step === 'upload' && (
                        <>
                            {/* Template Download */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <FileSpreadsheet size={20} className="text-primary mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-main dark:text-white">Template Import</p>
                                        <p className="text-xs text-text-secondary mb-2">Download template atau gunakan format dari sekolah Anda</p>
                                        <button
                                            onClick={handleDownloadTemplate}
                                            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                                        >
                                            <Download size={14} /> Download Template
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">💡 Fleksibilitas Import</p>
                                <p className="text-xs text-text-secondary">
                                    Sistem akan otomatis mendeteksi kolom dari file Anda. Anda juga bisa menyesuaikan mapping kolom
                                    sesuai format data sekolah atau format Dapodik. Kolom yang wajib: <strong>NIS</strong> dan <strong>Nama</strong>.
                                </p>
                            </div>

                            {/* File Upload */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border-color dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Upload size={40} className="mx-auto text-text-secondary mb-3" />
                                <p className="font-medium text-text-main dark:text-white">
                                    {file ? file.name : 'Klik atau drag file ke sini'}
                                </p>
                                <p className="text-sm text-text-secondary mt-1">
                                    Format: Excel (.xlsx, .xls) atau CSV
                                </p>
                            </div>
                        </>
                    )}

                    {/* Step 2: Column Mapping */}
                    {step === 'mapping' && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">Mapping Kolom</p>
                                    <p className="text-xs text-text-secondary">Sesuaikan kolom file dengan field sistem</p>
                                </div>
                                <button
                                    onClick={applyDapodikPreset}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium hover:bg-purple-100"
                                >
                                    <Settings size={14} />
                                    Format Dapodik
                                </button>
                            </div>

                            {/* Unmapped required warning */}
                            {unmappedRequired.length > 0 && (
                                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                                    <AlertCircle size={16} className="text-rose-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-rose-700 dark:text-rose-400">Field wajib belum dimapping:</p>
                                        <p className="text-xs text-rose-600">{unmappedRequired.map(f => f.label).join(', ')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="border border-border-color dark:border-gray-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-gray-700/50">
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">Kolom di File</th>
                                            <th className="px-4 py-2 text-center text-xs"><ArrowRight size={14} className="inline" /></th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">Field Sistem</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">Contoh Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                        {headers.map((header, index) => (
                                            <tr key={header} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                                <td className="px-4 py-2">
                                                    <span className="font-medium text-text-main dark:text-white">{header}</span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <ArrowRight size={14} className="inline text-text-secondary" />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={columnMapping[header] || ''}
                                                        onChange={(e) => handleMappingChange(header, e.target.value)}
                                                        className={`w-full px-2 py-1 text-xs border rounded-lg ${columnMapping[header] ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300' : 'bg-slate-50 dark:bg-gray-700 border-border-color dark:border-gray-600'}`}
                                                    >
                                                        <option value="">-- Abaikan --</option>
                                                        {SYSTEM_FIELDS.map(field => (
                                                            <option key={field.key} value={field.key}>
                                                                {field.label} {field.required ? '*' : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 text-xs text-text-secondary">
                                                    {rawData[0]?.[index]?.substring(0, 30) || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-xs text-text-secondary mt-3">
                                * Field wajib. Ditemukan <strong>{rawData.length}</strong> baris data.
                            </p>
                        </>
                    )}

                    {/* Step 3: Preview */}
                    {step === 'preview' && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-emerald-500" />
                                    <span className="font-medium text-text-main dark:text-white">
                                        {preview.length} data siap diimport
                                    </span>
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={updateExisting}
                                        onChange={(e) => setUpdateExisting(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-text-secondary">Update data yang sudah ada</span>
                                </label>
                            </div>

                            <div className="overflow-x-auto border border-border-color dark:border-gray-700 rounded-lg">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-gray-700/50">
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary">NIS</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary">Nama</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary">L/P</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary">TTL</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary">Alamat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                        {preview.slice(0, 10).map((student, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2">{student.nis}</td>
                                                <td className="px-3 py-2 font-medium">{student.name}</td>
                                                <td className="px-3 py-2">{student.gender === 'MALE' ? 'L' : student.gender === 'FEMALE' ? 'P' : '-'}</td>
                                                <td className="px-3 py-2">{student.birthPlace ? `${student.birthPlace}, ${student.birthDate}` : student.birthDate || '-'}</td>
                                                <td className="px-3 py-2 max-w-32 truncate">{student.address || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {preview.length > 10 && (
                                    <p className="text-xs text-text-secondary p-2 text-center bg-slate-50 dark:bg-gray-700/50">
                                        + {preview.length - 10} data lainnya
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-start gap-3">
                            <AlertCircle size={20} className="text-rose-500 mt-0.5" />
                            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-border-color dark:border-gray-700">
                    <div>
                        {step !== 'upload' && (
                            <button
                                onClick={() => setStep(step === 'preview' ? 'mapping' : 'upload')}
                                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main"
                            >
                                ← Kembali
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                        >
                            Batal
                        </button>

                        {step === 'mapping' && (
                            <button
                                onClick={processData}
                                disabled={unmappedRequired.length > 0}
                                className="px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                Lanjut ke Preview
                                <ArrowRight size={16} />
                            </button>
                        )}

                        {step === 'preview' && (
                            <button
                                onClick={handleImport}
                                disabled={preview.length === 0 || isLoading}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Import {preview.length} Data
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
