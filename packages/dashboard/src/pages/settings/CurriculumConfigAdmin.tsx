import React, { useState, useEffect } from 'react'
import {
    Settings,
    BookOpen,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Link as LinkIcon,
    Calendar,
    RefreshCw,
    FileText
} from 'lucide-react'
import { useCurriculumConfig, useReportTemplates } from '../../hooks/useCurriculumConfig'
import type { CurriculumConfig, AcademicYear } from '../../types'
import { api } from '../../lib/api'

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
                const response = await api.get<AcademicYear[]>('/api/academic')
                setAcademicYears(response || [])
            } catch (err) {
                console.error('Failed to fetch academic years:', err)
            }
        }
        fetchYears()
    }, [])

    const handleSetActive = async (id: string) => {
        setActivating(id)
        try {
            await setActiveConfig(id)
        } finally {
            setActivating(null)
        }
    }

    const handleLinkToYear = async (curriculumId: string) => {
        if (!selectedYear) return

        setLinkLoading(true)
        try {
            await linkToAcademicYear(curriculumId, selectedYear, selectedGrade || undefined)
            setSelectedYear('')
            setSelectedGrade(null)
            await fetchConfigs()
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(components).map(([key, comp]) => (
                    <div
                        key={key}
                        className={`p-3 rounded-lg border ${comp.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm capitalize">{key}</span>
                            {comp.enabled ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <X className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{comp.label}</p>
                        {comp.weight && (
                            <p className="text-xs text-blue-600 mt-1">Weight: {(comp.weight * 100).toFixed(0)}%</p>
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
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${scoring.type === 'numeric' ? 'bg-blue-100 text-blue-700' :
                        scoring.type === 'descriptive' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                        {scoring.type.toUpperCase()}
                    </span>
                    {scoring.scale && (
                        <span className="text-sm text-gray-500">
                            Scale: {scoring.scale.min} - {scoring.scale.max}
                        </span>
                    )}
                    {scoring.kkm && (
                        <span className="text-sm text-gray-500">
                            KKM: {scoring.kkm}
                        </span>
                    )}
                </div>

                {scoring.descriptiveLevels && (
                    <div className="flex gap-2 flex-wrap">
                        {scoring.descriptiveLevels.map((level) => (
                            <div
                                key={level.code}
                                className="px-3 py-1.5 rounded-lg text-white text-xs font-medium"
                                style={{ backgroundColor: level.color }}
                            >
                                {level.code} ({level.minScore}-{level.maxScore})
                            </div>
                        ))}
                    </div>
                )}

                {scoring.letterGrades && (
                    <div className="flex gap-2 flex-wrap">
                        {scoring.letterGrades.map((grade) => (
                            <div
                                key={grade.letter}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm"
                            >
                                <span className="font-bold">{grade.letter}</span>
                                <span className="text-gray-500 ml-1">
                                    {grade.minScore}-{grade.maxScore}
                                </span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {inputFields.map((field) => (
                    <div
                        key={field.key}
                        className="p-2 bg-gray-50 rounded border text-sm"
                    >
                        <div className="font-medium">{field.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            Type: {field.type}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (loading && configs.length === 0) {
        return (
            <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                <p className="mt-2 text-gray-500">Loading configurations...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-500 mb-2">{error}</div>
                <button
                    onClick={() => fetchConfigs()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-7 h-7" />
                        Curriculum Configuration
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage curriculum settings, scoring rules, and academic year assignments
                    </p>
                </div>
                <button
                    onClick={() => fetchConfigs()}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Refresh"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-bold">{configs.length}</div>
                            <div className="text-blue-100">Total Configurations</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                        <Check className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-bold">
                                {configs.filter(c => c.isActive).length}
                            </div>
                            <div className="text-green-100">Active Curriculum</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-2xl font-bold">{templates.length}</div>
                            <div className="text-purple-100">Report Templates</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Config Cards */}
            <div className="space-y-4">
                {configs.map((config) => (
                    <div
                        key={config.id}
                        className={`bg-white rounded-xl border shadow-sm overflow-hidden ${config.isActive ? 'ring-2 ring-green-500' : ''
                            }`}
                    >
                        {/* Card Header */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleExpand(config.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.isActive
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{config.name}</h3>
                                        {config.isActive && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                            {config.code}
                                        </code>
                                        <span>•</span>
                                        <span className="capitalize">
                                            {config.config.scoring.type} Scoring
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!config.isActive && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleSetActive(config.id)
                                        }}
                                        disabled={activating === config.id}
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {activating === config.id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                        Set Active
                                    </button>
                                )}
                                {expandedConfig === config.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedConfig === config.id && (
                            <div className="border-t p-4 space-y-6">
                                {/* Terms */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Terminology</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {Object.entries(config.config.terms).map(([key, value]) => (
                                            <div key={key} className="text-sm">
                                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                <span className="font-medium ml-1">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scoring */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Scoring System</h4>
                                    {renderScoringConfig(config)}
                                </div>

                                {/* Components */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Assessment Components</h4>
                                    {renderComponentConfig(config)}
                                </div>

                                {/* Input Fields */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Input Fields Configuration</h4>
                                    {renderInputFields(config)}
                                </div>

                                {/* Link to Academic Year */}
                                <div className="pt-4 border-t">
                                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        Link to Academic Year
                                    </h4>
                                    <div className="flex flex-wrap items-end gap-3">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Academic Year</label>
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                className="px-3 py-2 border rounded-lg text-sm min-w-[200px]"
                                            >
                                                <option value="">Select year...</option>
                                                {academicYears.map((year) => (
                                                    <option key={year.id} value={year.id}>
                                                        {year.name} {year.isActive && '(Active)'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Grade Level (Optional)</label>
                                            <select
                                                value={selectedGrade ?? ''}
                                                onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                                                className="px-3 py-2 border rounded-lg text-sm"
                                            >
                                                <option value="">All Grades</option>
                                                {[10, 11, 12].map((grade) => (
                                                    <option key={grade} value={grade}>Grade {grade}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => handleLinkToYear(config.id)}
                                            disabled={!selectedYear || linkLoading}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {linkLoading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Calendar className="w-4 h-4" />
                                            )}
                                            Link
                                        </button>
                                    </div>
                                </div>

                                {/* Report Template */}
                                <div className="pt-4 border-t">
                                    <h4 className="font-medium text-gray-700 mb-2">Report Template</h4>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-gray-100 px-3 py-1.5 rounded text-sm">
                                            {config.config.reportTemplate}
                                        </code>
                                        {templates.find(t => t.code === config.config.reportTemplate) && (
                                            <span className="text-green-600 text-sm flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                Template exists
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {configs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">No Configurations Found</h3>
                    <p className="text-gray-500 mt-1">
                        Run the seed script to create default curriculum configurations.
                    </p>
                    <code className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded text-sm">
                        node prisma/seed-curriculum-configs.js
                    </code>
                </div>
            )}
        </div>
    )
}

export default CurriculumConfigAdmin
