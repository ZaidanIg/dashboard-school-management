import { Star, TrendingUp, Award, FileText } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatsSummary from '@/components/common/StatsSummary'

interface Performance {
    id: string
    name: string
    subject: string
    attendance: number
    teaching: number
    admin: number
    total: number
    grade: string
}

const mockPerformance: Performance[] = [
    { id: '1', name: 'Budi Santoso, S.Pd', subject: 'Matematika', attendance: 95, teaching: 88, admin: 90, total: 91, grade: 'A' },
    { id: '2', name: 'Siti Aminah, M.Pd', subject: 'B. Indonesia', attendance: 98, teaching: 92, admin: 85, total: 92, grade: 'A' },
    { id: '3', name: 'Ahmad Rizki, S.Pd', subject: 'Fisika', attendance: 90, teaching: 85, admin: 80, total: 85, grade: 'B' },
    { id: '4', name: 'Dewi Lestari, M.Si', subject: 'Kimia', attendance: 92, teaching: 90, admin: 88, total: 90, grade: 'A' },
    { id: '5', name: 'Eko Prasetyo, S.Pd', subject: 'Biologi', attendance: 85, teaching: 78, admin: 75, total: 79, grade: 'B' },
    { id: '6', name: 'Fitri Handayani, S.Pd', subject: 'B. Inggris', attendance: 96, teaching: 94, admin: 92, total: 94, grade: 'A' },
]

const stats = [
    { label: 'Rata-rata Kinerja', value: '88.5', icon: TrendingUp, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-primary' },
    { label: 'Grade A', value: '52', icon: Star, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
    { label: 'Grade B', value: '28', icon: Award, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
    { label: 'Perlu Pembinaan', value: '6', icon: FileText, iconBg: 'bg-rose-50 dark:bg-rose-900/30', iconColor: 'text-rose-600' },
]

const gradeColors: Record<string, string> = {
    'A': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'B': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'C': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'D': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

export default function PerformanceEvaluation() {
    const columns: Column<Performance>[] = [
        {
            key: 'name',
            header: 'Nama Guru',
            render: (p) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium">{p.name}</span>
                </div>
            ),
        },
        { key: 'subject', header: 'Mata Pelajaran' },
        { key: 'attendance', header: 'Kehadiran', render: (p) => `${p.attendance}%` },
        { key: 'teaching', header: 'Pengajaran', render: (p) => `${p.teaching}%` },
        { key: 'admin', header: 'Administrasi', render: (p) => `${p.admin}%` },
        {
            key: 'total',
            header: 'Total',
            render: (p) => <span className="font-bold">{p.total}%</span>,
        },
        {
            key: 'grade',
            header: 'Grade',
            render: (p) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[p.grade]}`}>
                    {p.grade}
                </span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Evaluasi Kinerja"
                subtitle="Evaluasi kinerja guru dan staff"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: 'Evaluasi Kinerja' },
                ]}
                actions={
                    <button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        + Input Penilaian
                    </button>
                }
            />

            <StatsSummary items={stats} />

            <FilterBar
                searchPlaceholder="Cari nama guru..."
                filters={[
                    {
                        label: 'Semester',
                        options: [
                            { label: 'Ganjil 2024', value: 'ganjil-2024' },
                            { label: 'Genap 2024', value: 'genap-2024' },
                        ],
                    },
                    {
                        label: 'Grade',
                        options: [
                            { label: 'A', value: 'A' },
                            { label: 'B', value: 'B' },
                            { label: 'C', value: 'C' },
                        ],
                    },
                ]}
                onExport={() => { }}
            />

            <DataTable
                columns={columns}
                data={mockPerformance}
                onView={() => { }}
                currentPage={1}
                totalPages={5}
                totalItems={86}
            />
        </div>
    )
}
