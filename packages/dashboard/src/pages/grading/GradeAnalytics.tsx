import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'

const subjectScores = [
    { subject: 'Matematika', average: 78.5, highest: 98, lowest: 45, passRate: 85 },
    { subject: 'Fisika', average: 75.2, highest: 95, lowest: 42, passRate: 80 },
    { subject: 'Kimia', average: 80.1, highest: 100, lowest: 50, passRate: 88 },
    { subject: 'Biologi', average: 82.3, highest: 97, lowest: 55, passRate: 90 },
    { subject: 'B. Indonesia', average: 85.6, highest: 98, lowest: 60, passRate: 95 },
    { subject: 'B. Inggris', average: 79.8, highest: 96, lowest: 48, passRate: 82 },
]

const classRankings = [
    { class: '10-A', average: 82.5, rank: 1 },
    { class: '11-A', average: 81.2, rank: 2 },
    { class: '10-B', average: 79.8, rank: 3 },
    { class: '12-A', average: 78.5, rank: 4 },
    { class: '11-B', average: 77.2, rank: 5 },
]

export default function GradeAnalytics() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Analisis Nilai"
                subtitle="Analisis dan statistik nilai siswa"
                breadcrumb={[
                    { label: 'Penilaian', path: '/grading' },
                    { label: 'Analisis Nilai' },
                ]}
            />

            <FilterBar
                searchPlaceholder="Cari..."
                filters={[
                    {
                        label: 'Tahun Ajaran',
                        options: [
                            { label: '2024/2025', value: '2024' },
                            { label: '2023/2024', value: '2023' },
                        ],
                    },
                    {
                        label: 'Semester',
                        options: [
                            { label: 'Ganjil', value: 'ganjil' },
                            { label: 'Genap', value: 'genap' },
                        ],
                    },
                ]}
                onExport={() => { }}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 size={20} className="text-primary" />
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                            <TrendingUp size={12} /> +2.5%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-white">80.2</p>
                    <p className="text-sm text-text-secondary">Rata-rata Sekolah</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={20} className="text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-white">100</p>
                    <p className="text-sm text-text-secondary">Nilai Tertinggi</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingDown size={20} className="text-rose-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-white">42</p>
                    <p className="text-sm text-text-secondary">Nilai Terendah</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <PieChart size={20} className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-white">87%</p>
                    <p className="text-sm text-text-secondary">Tingkat Ketuntasan</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Analysis */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-border-color dark:border-gray-700">
                        <h3 className="font-semibold text-text-main dark:text-white">Analisis per Mata Pelajaran</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-gray-700/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Mapel</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Rata-rata</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Tertinggi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Terendah</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Ketuntasan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {subjectScores.map((item) => (
                                    <tr key={item.subject} className="hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 font-medium text-text-main dark:text-white">{item.subject}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold ${item.average >= 80 ? 'text-emerald-600' : item.average >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                {item.average}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-emerald-600">{item.highest}</td>
                                        <td className="px-4 py-3 text-center text-rose-600">{item.lowest}</td>
                                        <td className="px-4 py-3 text-center">{item.passRate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Class Rankings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-border-color dark:border-gray-700">
                        <h3 className="font-semibold text-text-main dark:text-white">Ranking Kelas</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {classRankings.map((item) => (
                            <div key={item.class} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                            item.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                                item.rank === 3 ? 'bg-amber-700/20 text-amber-800' :
                                                    'bg-slate-100 text-slate-600'
                                        }`}>
                                        {item.rank}
                                    </span>
                                    <span className="font-medium text-text-main dark:text-white">Kelas {item.class}</span>
                                </div>
                                <span className="font-bold text-text-main dark:text-white">{item.average}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
