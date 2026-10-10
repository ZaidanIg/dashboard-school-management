import React, { useState, useEffect } from 'react'
import {
    BookOpen,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Link as LinkIcon,
    Calendar,
    RefreshCw,
    FileText,
    Award
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useCurriculumConfig, useReportTemplates } from '@/hooks/useCurriculumConfig'
import type { CurriculumConfig, AcademicYear } from '@/types'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

const CurriculumConfigAdmin: React.FC = () => {
    const {
        configs,
        loading,
        error,
        fetchConfigs,
        setActiveConfig,
        linkToAcademicYear
    } = useCurriculumConfig()
    const { templates } = useReportTemplates()
    const { addToast } = useToast()

    const [expandedConfig, setExpandedConfig] = useState<string | null>(null)
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
    const [selectedYear, setSelectedYear] = useState<string>('')
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
    const [linkLoading, setLinkLoading] = useState(false)
    const [activating, setActivating] = useState<string | null>(null)

    // Fetch academic years
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await api.get<AcademicYear[]>('/api/academic/years')
                if (Array.isArray(response)) {
                    setAcademicYears(response)
                    const activeY = response.find(y => y.isActive)
                    if (activeY) setSelectedYear(activeY.id)
                }
            } catch (err) {
                console.error('Failed to fetch academic years:', err)
            }
        }
        fetchYears()
    }, [])

    const handleSetActive = async (id: string, name: string) => {
        setActivating(id)
        try {
            const res = await setActiveConfig(id)
            if (res) {
                addToast('success', `${name} berhasil diaktifkan sebagai kurikulum utama`)
                await fetchConfigs()
            } else {
                addToast('error', 'Gagal mengaktifkan kurikulum')
            }
        } finally {
            setActivating(null)
        }
    }

    const handleLinkToYear = async (curriculumId: string, name: string) => {
        if (!selectedYear) {
            addToast('info', 'Pilih tahun ajaran terlebih dahulu')
            return
        }

        setLinkLoading(true)
        try {
            const res = await linkToAcademicYear(curriculumId, selectedYear, selectedGrade || undefined)
            if (res) {
                addToast('success', `${name} berhasil ditautkan ke tahun ajaran`)
                setSelectedGrade(null)
                await fetchConfigs()
            } else {
                addToast('error', 'Gagal menautkan kurikulum ke tahun ajaran')
            }
        } finally {
            setLinkLoading(false)
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedConfig(expandedConfig === id ? null : id)
    }

    const renderComponentConfig = (config: CurriculumConfig) => {
        const { components } = config.config

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(components).map(([key, comp]) => (
                    <div
                        key={key}
                        className={`p-3.5 rounded-xl border transition-all ${
                            comp.enabled
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-gray-700/30 border-border-color dark:border-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm capitalize text-text-main dark:text-white">
                                {key}
                            </span>
                            {comp.enabled ? (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                                    <Check size={12} /> Aktif
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                    <X size={12} /> Nonaktif
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-text-secondary mt-1 font-medium">{comp.label}</p>
                        {comp.weight && (
                            <p className="text-xs font-bold text-primary mt-1.5">
                                Bobot Nilai: {(comp.weight * 100).toFixed(0)}%
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const renderScoringConfig = (config: CurriculumConfig) => {
        const { scoring } = config.config

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        scoring.type === 'numeric'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            : scoring.type === 'descriptive'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                        Metode: {scoring.type.toUpperCase()}
                    </span>
                    {scoring.scale && (
                        <span className="text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded text-text-secondary">
                            Skala Nilai: {scoring.scale.min} - {scoring.scale.max}
                        </span>
                    )}
                    {scoring.kkm && (
                        <span className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded font-semibold">
                            KKM: {scoring.kkm}
                        </span>
                    )}
                </div>

                {scoring.descriptiveLevels && (
                    <div className="flex gap-2 flex-wrap pt-1">
                        {scoring.descriptiveLevels.map((level) => (
                            <div
                                key={level.code}
                                className="px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs"
                                style={{ backgroundColor: level.color }}
                            >
                                {level.code} ({level.minScore}-{level.maxScore}) • {level.label}
                            </div>
                        ))}
                    </div>
                )}

                {scoring.letterGrades && (
                    <div className="flex gap-2 flex-wrap pt-1">
                        {scoring.letterGrades.map((grade) => (
                            <div
                                key={typeof grade === 'string' ? grade : grade.letter}
                                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-gray-700 text-xs border border-border-color dark:border-gray-600 text-text-main dark:text-white"
                            >
                                <span className="font-bold text-primary">
                                    {typeof grade === 'string' ? grade : grade.letter}
                                </span>
                                {typeof grade !== 'string' && (
                                    <span className="text-text-secondary ml-1.5">
                                        ({grade.minScore}-{grade.maxScore}) - {grade.predikat || ''}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const renderInputFields = (config: CurriculumConfig) => {
        const { inputFields } = config.config

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {inputFields.map((field) => (
                    <div
                        key={field.key}
                        className="p-2.5 bg-slate-50 dark:bg-gray-700/40 rounded-lg border border-border-color dark:border-gray-600 text-xs"
                    >
                        <div className="font-semibold text-text-main dark:text-white">{field.label}</div>
                        <div className="text-text-secondary mt-0.5 flex items-center justify-between">
                            <span>Tipe: {field.type}</span>
                            {field.required && <span className="text-red-500 font-bold">*Wajib</span>}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (loading && configs.length === 0) {
        return (
            <div className="p-16 text-center">
                <LoadingSpinner />
                <p className="mt-3 text-sm text-text-secondary">Memuat konfigurasi kurikulum...</p>
            </div>
        )
    }

    if (error && configs.length === 0) {
        return (
            <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900">
                <div className="text-red-500 font-semibold mb-2">{error}</div>
                <button
                    onClick={() => fetchConfigs()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                    Coba Lagi
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Konfigurasi Kurikulum"
                subtitle="Kelola kurikulum aktif, aturan pembobotan asesmen, dan template rapor"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Konfigurasi Kurikulum' },
                ]}
                actions={
                    <button
                        onClick={() => fetchConfigs()}
                        className="flex items-center gap-2 px-3 py-2 border border-border-color dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 text-text-main dark:text-white rounded-lg text-sm font-medium transition-colors"
                        title="Segarkan"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Segarkan
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-extrabold">{configs.length}</div>
                            <div className="text-blue-100 text-xs font-medium uppercase tracking-wider">Kurikulum Terdaftar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-extrabold">
                                {configs.find(c => c.isActive)?.name || 'Belum dipilih'}
                            </div>
                            <div className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Kurikulum Aktif Utama</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-5 text-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-extrabold">{templates.length}</div>
                            <div className="text-purple-100 text-xs font-medium uppercase tracking-wider">Template Rapor Sistem</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Config Cards */}
            <div className="space-y-4">
                {configs.map((config) => (
                    <div
                        key={config.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all overflow-hidden shadow-sm ${
                            config.isActive
                                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'border-border-color dark:border-gray-700'
                        }`}
                    >
                        {/* Card Header */}
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors"
                            onClick={() => toggleExpand(config.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    config.isActive
                                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600'
                                        : 'bg-slate-100 dark:bg-gray-700 text-slate-500'
                                }`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-base text-text-main dark:text-white">{config.name}</h3>
                                        {config.isActive && (
                                            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-300 dark:border-emerald-800">
                                                KURIKULUM AKTIF
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                                        <code className="bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded font-mono font-semibold">
                                            {config.code}
                                        </code>
                                        <span>•</span>
                                        <span className="capitalize font-medium">
                                            Penilaian {config.config.scoring.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {!config.isActive && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleSetActive(config.id, config.name)
                                        }}
                                        disabled={activating === config.id}
                                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-colors"
                                    >
                                        {activating === config.id ? (
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                        Jadikan Aktif
                                    </button>
                                )}
                                <div className="p-1 rounded-lg text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700">
                                    {expandedConfig === config.id ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedConfig === config.id && (
                            <div className="border-t border-border-color dark:border-gray-700 p-5 space-y-6 bg-slate-50/30 dark:bg-gray-800/50">
                                {/* Terminology */}
                                <div>
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                                        Istilah & Terminologi Kurikulum
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-border-color dark:border-gray-600">
                                        {Object.entries(config.config.terms).map(([key, value]) => (
                                            <div key={key} className="text-xs">
                                                <span className="text-text-secondary block capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                <span className="font-bold text-text-main dark:text-white text-sm">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scoring System */}
                                <div>
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                                        Aturan Sistem Skoring & Penilaian
                                    </h4>
                                    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-border-color dark:border-gray-600">
                                        {renderScoringConfig(config)}
                                    </div>
                                </div>

                                {/* Assessment Components */}
                                <div>
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                                        Komponen Asesmen & Pembobotan
                                    </h4>
                                    {renderComponentConfig(config)}
                                </div>

                                {/* Input Fields */}
                                <div>
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                                        Field Input Form Nilai Guru
                                    </h4>
                                    {renderInputFields(config)}
                                </div>

                                {/* Link to Academic Year */}
                                <div className="pt-4 border-t border-border-color dark:border-gray-700">
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <LinkIcon className="w-4 h-4 text-primary" />
                                        Tautkan ke Tahun Ajaran Tertentu
                                    </h4>
                                    <div className="flex flex-wrap items-end gap-3 bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-border-color dark:border-gray-600">
                                        <div>
                                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                                                Tahun Ajaran
                                            </label>
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                className="px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm min-w-[220px] text-text-main dark:text-white outline-none"
                                            >
                                                <option value="">Pilih Tahun Ajaran...</option>
                                                {academicYears.map((year) => (
                                                    <option key={year.id} value={year.id}>
                                                        {year.name} {year.isActive ? '(Aktif)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                                                Tingkat Kelas (Opsional)
                                            </label>
                                            <select
                                                value={selectedGrade ?? ''}
                                                onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                                                className="px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none"
                                            >
                                                <option value="">Semua Tingkat (10, 11, 12)</option>
                                                {[10, 11, 12].map((grade) => (
                                                    <option key={grade} value={grade}>Kelas {grade}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => handleLinkToYear(config.id, config.name)}
                                            disabled={!selectedYear || linkLoading}
                                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                                        >
                                            {linkLoading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Calendar className="w-4 h-4" />
                                            )}
                                            Tautkan Kurikulum
                                        </button>
                                    </div>
                                </div>

                                {/* Report Template */}
                                <div className="pt-4 border-t border-border-color dark:border-gray-700 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                                            Template Rapor yang Dihubungkan
                                        </h4>
                                        <code className="bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded text-xs font-mono font-semibold text-primary">
                                            {config.config.reportTemplate}
                                        </code>
                                    </div>
                                    {templates.find(t => t.code === config.config.reportTemplate) && (
                                        <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                            <Check className="w-3.5 h-3.5" />
                                            Template Resmi Siap Digunakan
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CurriculumConfigAdmin
