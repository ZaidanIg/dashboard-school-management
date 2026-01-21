import { useState } from 'react'
import { X, Download, FileSpreadsheet, Table, Calendar, Check } from 'lucide-react'

interface ExportAttendanceModalProps {
    isOpen: boolean
    onClose: () => void
}

type ExportFormat = 'csv' | 'json'
type ExportPeriod = 'daily' | 'monthly' | 'semester' | 'yearly'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ExportAttendanceModal({ isOpen, onClose }: ExportAttendanceModalProps) {
    const [format, setFormat] = useState<ExportFormat>('csv')
    const [period, setPeriod] = useState<ExportPeriod>('monthly')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(new Date().getMonth() < 6 ? 1 : 2)
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleExport = async () => {
        setIsExporting(true)
        setError(null)

        try {
            let endpoint = ''
            const params = new URLSearchParams()
            params.set('format', format)

            if (period === 'daily') {
                endpoint = '/api/students/attendance/summary'
                params.set('date', selectedDate)
            } else {
                endpoint = '/api/students/attendance/recap'
                params.set('period', period)
                params.set('year', selectedYear.toString())
                if (period === 'monthly') {
                    params.set('month', selectedMonth.toString())
                }
                if (period === 'semester') {
                    params.set('semester', selectedSemester.toString())
                }
            }

            const response = await fetch(`${API_BASE}${endpoint}?${params}`)
            if (!response.ok) throw new Error('Gagal mengambil data')

            const data = await response.json()

            // Generate file content
            let content = ''
            let filename = ''

            if (period === 'daily') {
                if (format === 'csv') {
                    content = 'Kelas,Hadir,Terlambat,Sakit,Izin,Alpha,Total,Persentase\n'
                    data.byClass?.forEach((row: any) => {
                        const pct = row.total > 0 ? Math.round((row.present / row.total) * 100) : 0
                        content += `${row.className},${row.present},${row.late || 0},${row.sick},${row.permitted},${row.absent},${row.total},${pct}%\n`
                    })
                } else {
                    content = JSON.stringify(data, null, 2)
                }
                filename = `kehadiran-harian-${selectedDate}.${format}`
            } else {
                if (format === 'csv') {
                    content = 'NIS,Nama Siswa,Kelas,Hadir,Terlambat,Sakit,Izin,Alpha,Total Hari,Persentase,Status\n'
                    data.students?.forEach((s: any) => {
                        content += `${s.nis},"${s.studentName}",${s.className},${s.present},${s.late},${s.sick},${s.permitted},${s.absent},${s.totalDays},${s.percentage}%,${s.isLowAttendance ? 'Perlu Perhatian' : 'Baik'}\n`
                    })
                } else {
                    content = JSON.stringify(data, null, 2)
                }
                const periodLabel = period === 'monthly'
                    ? `bulan-${selectedMonth}-${selectedYear}`
                    : period === 'semester'
                        ? `semester-${selectedSemester}-${selectedYear}`
                        : `tahun-${selectedYear}`
                filename = `rekap-kehadiran-${periodLabel}.${format}`
            }

            // Download file
            const blob = new Blob([content], {
                type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json'
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            link.click()
            URL.revokeObjectURL(url)

            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Export gagal')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                            <Download size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                Export Data Kehadiran
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Pilih periode dan format export
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

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Period Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-3">
                            Periode Export
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['daily', 'monthly', 'semester', 'yearly'] as ExportPeriod[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-gray-700 text-text-secondary hover:bg-slate-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {p === 'daily' ? 'Harian' : p === 'monthly' ? 'Bulanan' : p === 'semester' ? 'Semester' : 'Tahunan'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Period Details */}
                    <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                            <Calendar size={16} />
                            <span className="text-sm font-medium">Detail Periode</span>
                        </div>

                        {period === 'daily' && (
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Tanggal</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                />
                            </div>
                        )}

                        {period === 'monthly' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Bulan</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(2000, i).toLocaleDateString('id-ID', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Tahun</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                    >
                                        {[2024, 2025, 2026].map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {period === 'semester' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Semester</label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(parseInt(e.target.value) as 1 | 2)}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                    >
                                        <option value={1}>Semester 1 (Jan-Jun)</option>
                                        <option value={2}>Semester 2 (Jul-Des)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Tahun</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                    >
                                        {[2024, 2025, 2026].map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {period === 'yearly' && (
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Tahun</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                >
                                    {[2024, 2025, 2026].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-3">
                            Format File
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat('csv')}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${format === 'csv'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border-color dark:border-gray-600 hover:border-primary/50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${format === 'csv' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-gray-700 text-text-secondary'
                                    }`}>
                                    <FileSpreadsheet size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-text-main dark:text-white">CSV</p>
                                    <p className="text-xs text-text-secondary">Excel, Spreadsheet</p>
                                </div>
                                {format === 'csv' && (
                                    <Check size={20} className="ml-auto text-primary" />
                                )}
                            </button>
                            <button
                                onClick={() => setFormat('json')}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${format === 'json'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border-color dark:border-gray-600 hover:border-primary/50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${format === 'json' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-gray-700 text-text-secondary'
                                    }`}>
                                    <Table size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-text-main dark:text-white">JSON</p>
                                    <p className="text-xs text-text-secondary">Data struktural</p>
                                </div>
                                {format === 'json' && (
                                    <Check size={20} className="ml-auto text-primary" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-rose-600">
                            {error}
                        </div>
                    )}
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
                        disabled={isExporting}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Mengexport...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Export {format.toUpperCase()}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
