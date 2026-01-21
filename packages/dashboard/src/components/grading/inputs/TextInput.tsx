import React from 'react'

interface TextInputProps {
    label: string
    value?: string
    onChange: (value: string) => void
    multiline?: boolean
    rows?: number
    placeholder?: string
    error?: string
    required?: boolean
    maxLength?: number
}

/**
 * Text/Textarea input for feedback and notes
 */
export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    multiline = false,
    rows = 3,
    placeholder,
    error,
    required,
    maxLength
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

    const inputClasses = `
        w-full px-3 py-2 border rounded-lg
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
    `

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {multiline ? (
                <textarea
                    value={value || ''}
                    onChange={handleChange}
                    rows={rows}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={inputClasses}
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={inputClasses}
                />
            )}

            <div className="flex justify-between">
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {maxLength && (
                    <p className="text-xs text-gray-400 ml-auto">
                        {(value || '').length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
}
