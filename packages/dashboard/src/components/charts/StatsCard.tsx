import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string
    trend: {
        value: string
        isPositive: boolean
    }
    icon: LucideIcon
    iconBgColor: string
    iconColor: string
}

export default function StatsCard({
    title,
    value,
    trend,
    icon: Icon,
    iconBgColor,
    iconColor,
}: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border-color dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${iconBgColor} rounded-lg ${iconColor}`}>
                    <Icon size={24} />
                </div>
                <span
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
                        }`}
                >
                    {trend.isPositive ? (
                        <TrendingUp size={14} className="mr-1" />
                    ) : (
                        <TrendingDown size={14} className="mr-1" />
                    )}
                    {trend.value}
                </span>
            </div>
            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">
                {title}
            </p>
            <h3 className="text-2xl font-bold text-text-main dark:text-white mt-1">
                {value}
            </h3>
        </div>
    )
}
