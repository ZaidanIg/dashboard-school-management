const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const data = [
    { income: 60, expense: 48 },
    { income: 75, expense: 45 },
    { income: 50, expense: 35 },
    { income: 85, expense: 42 },
    { income: 90, expense: 36 },
    { income: 65, expense: 36 },
]

export default function MonthlyCashFlowChart() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-bold text-text-main dark:text-white">
                        Monthly Cash Flow
                    </h3>
                    <p className="text-sm text-text-secondary">
                        Income vs Expenses (in Millions)
                    </p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center text-xs font-medium text-text-secondary">
                        <span className="size-2 rounded-full bg-primary mr-2"></span>In
                    </span>
                    <span className="flex items-center text-xs font-medium text-text-secondary">
                        <span className="size-2 rounded-full bg-slate-300 mr-2"></span>Out
                    </span>
                </div>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
                {data.map((item, index) => (
                    <div
                        key={months[index]}
                        className="flex flex-col items-center gap-2 flex-1 h-full justify-end"
                    >
                        <div
                            className="w-full flex gap-1 items-end justify-center"
                            style={{ height: `${item.income}%` }}
                        >
                            <div
                                className="w-3 bg-primary rounded-t-sm"
                                style={{ height: '100%' }}
                            ></div>
                            <div
                                className="w-3 bg-slate-200 dark:bg-slate-600 rounded-t-sm"
                                style={{ height: `${(item.expense / item.income) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-text-secondary">{months[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
