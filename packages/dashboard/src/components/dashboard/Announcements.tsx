const announcements = [
    {
        id: 1,
        type: 'Upcoming',
        typeBg: 'bg-orange-100 dark:bg-orange-900/40',
        typeColor: 'text-orange-700 dark:text-orange-300',
        cardBg: 'bg-orange-50/50 dark:bg-orange-900/10',
        cardBorder: 'border-orange-100 dark:border-orange-900/30',
        title: 'Semester Break',
        date: 'Dec 20, 2023',
        description:
            'The semester break will begin on December 20th. All administrative offices will operate on reduced hours.',
    },
    {
        id: 2,
        type: 'Meeting',
        typeBg: 'bg-blue-100 dark:bg-blue-900/40',
        typeColor: 'text-blue-700 dark:text-blue-300',
        cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
        cardBorder: 'border-blue-100 dark:border-blue-900/30',
        title: 'Parent-Teacher Meeting',
        date: 'Nov 15, 2023',
        description:
            'Mandatory meeting for all Class 10 parents regarding the new curriculum changes next Friday.',
    },
]

export default function Announcements() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 flex flex-col shadow-sm">
            <div className="p-6 border-b border-border-color dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-base font-bold text-text-main dark:text-white">
                    Announcements
                </h3>
                <button className="bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 text-text-main dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Post New
                </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className={`flex flex-col gap-2 p-4 rounded-lg ${announcement.cardBg} border ${announcement.cardBorder}`}
                    >
                        <div className="flex justify-between items-start">
                            <span
                                className={`${announcement.typeBg} ${announcement.typeColor} text-[10px] uppercase font-bold px-2 py-0.5 rounded`}
                            >
                                {announcement.type}
                            </span>
                            <span className="text-xs text-text-secondary">
                                {announcement.date}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-text-main dark:text-white">
                            {announcement.title}
                        </h4>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            {announcement.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
