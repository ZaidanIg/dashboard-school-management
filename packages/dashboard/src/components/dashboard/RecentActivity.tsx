import { Calculator, CreditCard, UserPlus } from 'lucide-react'

const activities = [
    {
        id: 1,
        icon: Calculator,
        iconBg: 'bg-blue-50 dark:bg-blue-900/30',
        iconColor: 'text-primary',
        title: 'Mr. Budi entered Math Grades',
        subtitle: 'Class 10-A • Mathematics',
        time: '2 hours ago',
    },
    {
        id: 2,
        icon: CreditCard,
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600',
        title: 'Tuition payment received',
        subtitle: 'From Siti Aminah (ID: 2023001)',
        time: '4 hours ago',
    },
    {
        id: 3,
        icon: UserPlus,
        iconBg: 'bg-purple-50 dark:bg-purple-900/30',
        iconColor: 'text-purple-600',
        title: 'New student registration',
        subtitle: 'Ahmad Dhani joined Class 9-B',
        time: 'Yesterday',
    },
]

export default function RecentActivity() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 flex flex-col shadow-sm">
            <div className="p-6 border-b border-border-color dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-base font-bold text-text-main dark:text-white">
                    Recent Activity
                </h3>
                <a
                    href="#"
                    className="text-sm text-primary font-medium hover:underline"
                >
                    View All
                </a>
            </div>
            <div className="p-6 flex flex-col gap-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                        <div
                            className={`mt-1 size-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0 ${activity.iconColor}`}
                        >
                            <activity.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-text-main dark:text-white">
                                {activity.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                                {activity.subtitle}
                            </p>
                            <span className="text-xs text-text-secondary mt-1">
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
