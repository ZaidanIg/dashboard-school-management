import { type LucideIcon } from 'lucide-react'

interface StatsSummaryItem {
    label: string
    value: string | number
    icon: LucideIcon
    iconBg: string
    iconColor: string
}

interface StatsSummaryProps {
    items: StatsSummaryItem[]
}

export default function StatsSummary({ items }: StatsSummaryProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4"
                >
                    <div className={`p-3 ${item.iconBg} rounded-lg ${item.iconColor}`}>
                        <item.icon size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-main dark:text-white">
                            {item.value}
                        </p>
                        <p className="text-sm text-text-secondary">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
