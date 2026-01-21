import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
    fullPage?: boolean
}

const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
}

export default function LoadingSpinner({ size = 'md', text, fullPage = false }: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
            {text && <p className="text-sm text-text-secondary dark:text-gray-400">{text}</p>}
        </div>
    )

    if (fullPage) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                {content}
            </div>
        )
    }

    return content
}
