import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
    label: string
    path?: string
}

interface PageHeaderProps {
    title: string
    subtitle?: string
    breadcrumb?: BreadcrumbItem[]
    actions?: React.ReactNode
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumb = [],
    actions,
}: PageHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
                <nav className="flex items-center gap-2 text-sm">
                    <Link
                        to="/"
                        className="text-text-secondary hover:text-primary transition-colors"
                    >
                        <Home size={16} />
                    </Link>
                    {breadcrumb.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight size={14} className="text-text-secondary" />
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className="text-text-secondary hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-text-main dark:text-white font-medium">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-text-secondary dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    )
}
