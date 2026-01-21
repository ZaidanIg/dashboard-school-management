import { MoreHorizontal } from 'lucide-react'

export default function WeeklyAttendanceChart() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-bold text-text-main dark:text-white">
                        Weekly Attendance
                    </h3>
                    <p className="text-sm text-text-secondary">
                        Student presence over the last 7 days
                    </p>
                </div>
                <button className="p-2 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-text-secondary">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <div className="h-64 w-full">
                <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                >
                    {/* Grid Lines */}
                    <line
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    <line
                        x1="0"
                        y1="50"
                        x2="400"
                        y2="50"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    <line
                        x1="0"
                        y1="100"
                        x2="400"
                        y2="100"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    <line
                        x1="0"
                        y1="150"
                        x2="400"
                        y2="150"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2463eb" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#2463eb" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <path
                        d="M0 120 C 50 100, 100 140, 150 80 S 250 40, 300 60 S 350 20, 400 30 V 200 H 0 Z"
                        fill="url(#chartGradient)"
                    />

                    {/* Line Path */}
                    <path
                        d="M0 120 C 50 100, 100 140, 150 80 S 250 40, 300 60 S 350 20, 400 30"
                        fill="none"
                        stroke="#2463eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="flex justify-between mt-4 text-xs text-text-secondary font-medium px-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>
        </div>
    )
}
