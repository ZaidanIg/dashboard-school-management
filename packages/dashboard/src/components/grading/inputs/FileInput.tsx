import React, { useRef } from 'react'
import { Upload, X, File, Image } from 'lucide-react'

interface FileInputProps {
    label: string
    value?: string[]
    onChange: (value: string[]) => void
    accept?: string
    multiple?: boolean
    error?: string
    required?: boolean
}

/**
 * File upload input for evidence/portfolio
 * Note: This is a simplified version - actual implementation would need
 * to integrate with an upload API
 */
export const FileInput: React.FC<FileInputProps> = ({
    label,
    value = [],
    onChange,
    accept = 'image/*,application/pdf',
    multiple = true,
    error,
    required
}) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // In a real implementation, you would upload files here
        // and get back URLs. For now, we'll use object URLs as placeholders
        const newUrls: string[] = []
        for (let i = 0; i < files.length; i++) {
            // This would be replaced with actual upload logic
            newUrls.push(URL.createObjectURL(files[i]))
        }

        if (multiple) {
            onChange([...value, ...newUrls])
        } else {
            onChange(newUrls)
        }

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const removeFile = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    const isImage = (url: string) => {
        return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('blob:')
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* File list */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {value.map((url, index) => (
                        <div
                            key={index}
                            className="relative group border rounded-lg overflow-hidden bg-gray-50"
                        >
                            {isImage(url) ? (
                                <img
                                    src={url}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-20 object-cover"
                                />
                            ) : (
                                <div className="w-full h-20 flex items-center justify-center">
                                    <File className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload button */}
            <div
                onClick={() => inputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                    transition-colors hover:border-blue-400 hover:bg-blue-50
                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
            >
                <Upload className="w-6 h-6 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-1">
                    Click to upload {multiple ? 'files' : 'a file'}
                </p>
                <p className="text-xs text-gray-400">
                    {accept.replace(/,/g, ', ')}
                </p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
