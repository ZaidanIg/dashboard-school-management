import React from 'react'

interface NumericInputProps {
    label: string
    value?: number
    onChange: (value: number | undefined) => void
    min?: number
    max?: number
    step?: number
    error?: string
    required?: boolean
    placeholder?: string
}

/**
 * Numeric input component for K13-style scoring (0-100)
 */
export const NumericInput: React.FC<NumericInputProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    error,
    required,
    placeholder
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val === '') {
            onChange(undefined)
        } else {
            const numVal = parseFloat(val)
            if (!isNaN(numVal)) {
                onChange(numVal)
            }
        }
    }

    // Calculate color based on value
    const getValueColor = () => {
        if (value === undefined) return ''
        if (value >= 90) return 'text-green-600'
        if (value >= 75) return 'text-blue-600'
        if (value >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={value ?? ''}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder || `${min} - ${max}`}
                    className={`
                        w-full px-3 py-2 border rounded-lg text-right font-medium
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                        ${getValueColor()}
                    `}
                />
                {/* Visual indicator bar */}
                {value !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                        <div
                            className={`h-full transition-all ${value >= 75 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%` }}
                        />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
