import { useState } from 'react'
import { X, Download, FileSpreadsheet, Check, Table } from 'lucide-react'
import { exportStudents as exportStudentsApi } from '@/services/studentApi'

interface ExportStudentModalProps {
    isOpen: boolean
    onClose: () => void
    totalStudents: number
}

type ExportFormat = 'csv' | 'json'

interface ExportField {
    key: string
    label: string
    selected: boolean
}

export default function ExportStudentModal({ isOpen, onClose, totalStudents }: ExportStudentModalProps) {
    const [format, setFormat] = useState<ExportFormat>('csv')
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedClass, setSelectedClass] = useState('all')
    const [fields, setFields] = useState<ExportField[]>([
        { key: 'nis', label: 'NIS', selected: true },
        { key: 'nisn', label: 'NISN', selected: true },
        { key: 'name', label: 'Nama Lengkap', selected: true },
        { key: 'class', label: 'Kelas', selected: true },
        { key: 'gender', label: 'Jenis Kelamin', selected: true },
        { key: 'birthPlace', label: 'Tempat Lahir', selected: true },
        { key: 'birthDate', label: 'Tanggal Lahir', selected: true },
        { key: 'address', label: 'Alamat', selected: false },
        { key: 'phone', label: 'No. HP', selected: false },
        { key: 'email', label: 'Email', selected: false },
        { key: 'status', label: 'Status', selected: false },
    ])

    if (!isOpen) return null

    const toggleField = (key: string) => {
        setFields(prev => prev.map(f =>
            f.key === key ? { ...f, selected: !f.selected } : f
        ))
    }

    const selectAll = () => setFields(prev => prev.map(f => ({ ...f, selected: true })))
    const deselectAll = () => setFields(prev => prev.map(f => ({ ...f, selected: false })))

    const handleExport = async () => {
        setIsExporting(true)
        setError(null)

        try {
            const selectedFields = fields.filter(f => f.selected).map(f => f.key)

            await exportStudentsApi({
                format,
                classFilter: selectedClass !== 'all' ? selectedClass : undefined,
                fields: selectedFields,
            })

            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Export gagal')
        } finally {
            setIsExporting(false)
        }
    }

    const formatIcons = {
        csv: <FileSpreadsheet size={20} />,
        json: <Table size={20} />,
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                            <Download size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">Export Data Siswa</h2>
                            <p className="text-sm text-text-secondary">{totalStudents} siswa tersedia</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-sm text-rose-700 dark:text-rose-400">
                            {error}
                        </div>
                    )}

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Format File</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['csv', 'json'] as ExportFormat[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`p-3 rounded-lg border-2 text-center transition-colors ${format === f
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border-color dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex justify-center mb-1">{formatIcons[f]}</div>
                                    <span className="text-sm font-medium uppercase">{f}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Filter Kelas</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                        >
                            <option value="all">Semua Kelas</option>
                            <option value="10">Kelas 10</option>
                            <option value="11">Kelas 11</option>
                            <option value="12">Kelas 12</option>
                        </select>
                    </div>

                    {/* Field Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-text-main dark:text-white">Kolom Data</label>
                            <div className="flex gap-2">
                                <button onClick={selectAll} className="text-xs text-primary hover:underline">Pilih Semua</button>
                                <span className="text-text-secondary">|</span>
                                <button onClick={deselectAll} className="text-xs text-text-secondary hover:underline">Hapus Semua</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                            {fields.map((field) => (
                                <label
                                    key={field.key}
                                    onClick={() => toggleField(field.key)}
                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${field.selected ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${field.selected
                                        ? 'bg-primary border-primary'
                                        : 'border-border-color dark:border-gray-600'
                                        }`}>
                                        {field.selected && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm text-text-main dark:text-white">{field.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border-color dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={fields.filter(f => f.selected).length === 0 || isExporting}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Mengekspor...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Export
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
