import React, { useState, useEffect } from 'react'
import type { CurriculumConfig, GenericGradeInput, InputFieldConfig, Student } from '../../types'
import { NumericInput } from './inputs/NumericInput'
import { DescriptiveInput } from './inputs/DescriptiveInput'
import { TextInput } from './inputs/TextInput'
import { FileInput } from './inputs/FileInput'
import { Save, X, Upload, AlertCircle } from 'lucide-react'

interface DynamicGradeFormProps {
    curriculumConfig: CurriculumConfig
    student: Student
    subjectId: string
    academicYearId: string
    semester: 'GANJIL' | 'GENAP'
    assessmentType: string
    initialData?: Partial<GenericGradeInput>
    onSave: (grade: GenericGradeInput) => Promise<void>
    onCancel?: () => void
    loading?: boolean
}

/**
 * Dynamic grade input form that renders fields based on curriculum configuration
 */
export const DynamicGradeForm: React.FC<DynamicGradeFormProps> = ({
    curriculumConfig,
    student,
    subjectId,
    academicYearId,
    semester,
    assessmentType,
    initialData,
    onSave,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState<Record<string, unknown>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState(false)

    const { inputFields, scoring } = curriculumConfig.config

    // Initialize form data
    useEffect(() => {
        if (initialData) {
            const initial: Record<string, unknown> = {}
            if (initialData.scoreNumeric !== undefined) initial.scoreNumeric = initialData.scoreNumeric
            if (initialData.scoreLetter) initial.scoreLetter = initialData.scoreLetter
            if (initialData.scoreDescriptive) initial.scoreDescriptive = initialData.scoreDescriptive
            if (initialData.scoreJson) Object.assign(initial, initialData.scoreJson)
            if (initialData.feedback) initial.feedback = initialData.feedback
            if (initialData.evidenceLinks) initial.evidenceLinks = initialData.evidenceLinks
            setFormData(initial)
        }
    }, [initialData])

    const handleFieldChange = (key: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        // Clear error when field is modified
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev }
                delete next[key]
                return next
            })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        for (const field of inputFields) {
            if (field.required && !formData[field.key]) {
                newErrors[field.key] = `${field.label} is required`
            }

            if (field.type === 'number' && formData[field.key] !== undefined) {
                const val = Number(formData[field.key])
                if (field.min !== undefined && val < field.min) {
                    newErrors[field.key] = `Minimum value is ${field.min}`
                }
                if (field.max !== undefined && val > field.max) {
                    newErrors[field.key] = `Maximum value is ${field.max}`
                }
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setSaving(true)
        try {
            // Build the grade input object
            const gradeInput: GenericGradeInput = {
                id: initialData?.id,
                studentId: student.id,
                subjectId,
                academicYearId,
                semester,
                assessmentType,
                curriculumConfigId: curriculumConfig.id
            }

            // Map form data to grade fields based on scoring type
            if (scoring.type === 'numeric') {
                // Collect numeric scores into scoreJson
                const scoreJson: Record<string, number> = {}
                for (const field of inputFields) {
                    if (field.type === 'number' && formData[field.key] !== undefined) {
                        scoreJson[field.key] = Number(formData[field.key])
                    }
                }
                gradeInput.scoreJson = scoreJson

                // If there's a direct score field, use it
                if (formData.scoreNumeric !== undefined) {
                    gradeInput.scoreNumeric = Number(formData.scoreNumeric)
                }
            } else if (scoring.type === 'descriptive') {
                // Use descriptive level
                if (formData.tingkatPencapaian || formData.scoreDescriptive) {
                    gradeInput.scoreDescriptive = String(formData.tingkatPencapaian || formData.scoreDescriptive)
                }
            }

            // Add feedback
            if (formData.feedback || formData.catatan) {
                gradeInput.feedback = String(formData.feedback || formData.catatan)
            }

            // Add evidence links
            if (formData.evidenceLinks && Array.isArray(formData.evidenceLinks)) {
                gradeInput.evidenceLinks = formData.evidenceLinks as string[]
            }

            await onSave(gradeInput)
        } finally {
            setSaving(false)
        }
    }

    const renderInputField = (field: InputFieldConfig) => {
        const value = formData[field.key]
        const error = errors[field.key]

        switch (field.type) {
            case 'number':
                return (
                    <NumericInput
                        key={field.key}
                        label={field.label}
                        value={value as number | undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        min={field.min}
                        max={field.max}
                        error={error}
                        required={field.required}
                    />
                )

            case 'select':
                return (
                    <DescriptiveInput
                        key={field.key}
                        label={field.label}
                        value={value as string | undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        options={field.options || scoring.descriptiveLevels?.map(l => l.code) || []}
                        levels={scoring.descriptiveLevels}
                        error={error}
                        required={field.required}
                    />
                )

            case 'textarea':
                return (
                    <TextInput
                        key={field.key}
                        label={field.label}
                        value={value as string | undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        multiline
                        error={error}
                        required={field.required}
                    />
                )

            case 'text':
                return (
                    <TextInput
                        key={field.key}
                        label={field.label}
                        value={value as string | undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        error={error}
                        required={field.required}
                    />
                )

            case 'file':
                return (
                    <FileInput
                        key={field.key}
                        label={field.label}
                        value={value as string[] | undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        accept={field.accept}
                        multiple={field.multiple}
                        error={error}
                        required={field.required}
                    />
                )

            case 'checkbox':
                return (
                    <div key={field.key} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={field.key}
                            checked={Boolean(value)}
                            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={field.key} className="text-sm text-gray-700">
                            {field.label}
                        </label>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Info Header */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">NIS: {student.nis}</div>
            </div>

            {/* Dynamic Input Fields */}
            <div className="space-y-4">
                {inputFields.map(renderInputField)}
            </div>

            {/* Form Errors */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">
                        Please fix the errors above before saving.
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving || loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={saving || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Grade
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
