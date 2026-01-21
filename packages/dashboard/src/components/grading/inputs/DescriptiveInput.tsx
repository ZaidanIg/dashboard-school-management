import React from 'react'

interface DescriptiveLevel {
    code: string
    label: string
    minScore: number
    maxScore: number
    color: string
}

interface DescriptiveInputProps {
    label: string
    value?: string
    onChange: (value: string) => void
    options: string[]
    levels?: DescriptiveLevel[]
    error?: string
    required?: boolean
}

/**
 * Descriptive level input for Merdeka-style grading (BB, MB, BSH, BSB)
 */
export const DescriptiveInput: React.FC<DescriptiveInputProps> = ({
    label,
    value,
    onChange,
    options,
    levels,
    error,
    required
}) => {
    // Create a lookup for level info
    const levelInfo = levels?.reduce((acc, l) => {
        acc[l.code] = l
        return acc
    }, {} as Record<string, DescriptiveLevel>) || {}

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Button group style for descriptive levels */}
            <div className="flex gap-2 flex-wrap">
                {options.map((option) => {
                    const level = levelInfo[option]
                    const isSelected = value === option

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm transition-all
                                border-2
                                ${isSelected
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                            style={{
                                backgroundColor: isSelected && level?.color
                                    ? level.color + '20'
                                    : undefined,
                                borderColor: isSelected && level?.color
                                    ? level.color
                                    : undefined
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span
                                    className="font-bold"
                                    style={{ color: level?.color }}
                                >
                                    {option}
                                </span>
                                {level && (
                                    <span className="text-xs text-gray-500 mt-0.5">
                                        {level.label}
                                    </span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Show score range info for selected level */}
            {value && levelInfo[value] && (
                <p className="text-xs text-gray-500 mt-1">
                    Score range: {levelInfo[value].minScore} - {levelInfo[value].maxScore}
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
