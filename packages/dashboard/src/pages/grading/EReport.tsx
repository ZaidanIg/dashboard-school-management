import { FileText, Download, Eye, Printer } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'

interface Report {
    id: string
    studentName: string
    nis: string
    class: string
    semester: string
    average: number
    rank: number
    status: 'published' | 'draft' | 'pending'
}

const mockReports: Report[] = [
    { id: '1', studentName: 'Ahmad Rizki', nis: '12345001', class: '10-A', semester: 'Ganjil 2024', average: 85.5, rank: 5, status: 'published' },
    { id: '2', studentName: 'Siti Aminah', nis: '12345002', class: '10-A', semester: 'Ganjil 2024', average: 90.2, rank: 1, status: 'published' },
    { id: '3', studentName: 'Budi Santoso', nis: '12345003', class: '10-A', semester: 'Ganjil 2024', average: 78.8, rank: 15, status: 'draft' },
    { id: '4', studentName: 'Dewi Lestari', nis: '12345004', class: '10-A', semester: 'Ganjil 2024', average: 88.3, rank: 3, status: 'pending' },
    { id: '5', studentName: 'Eko Prasetyo', nis: '12345005', class: '10-A', semester: 'Ganjil 2024', average: 82.1, rank: 8, status: 'draft' },
]

export default function EReport() {
    const columns: Column<Report>[] = [
        { key: 'nis', header: 'NIS' },
        { key: 'studentName', header: 'Nama Siswa', render: (r) => <span className="font-medium">{r.studentName}</span> },
        { key: 'class', header: 'Kelas' },
        { key: 'semester', header: 'Semester' },
        {
            key: 'average',
            header: 'Rata-rata',
            render: (r) => (
                <span className={`font-bold ${r.average >= 85 ? 'text-emerald-600' : r.average >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {r.average}
                </span>
            ),
        },
        { key: 'rank', header: 'Ranking', render: (r) => `#${r.rank}` },
        {
            key: 'status',
            header: 'Status',
            render: (r) => (
                <StatusBadge
                    status={r.status === 'published' ? 'success' : r.status === 'draft' ? 'warning' : 'pending'}
                    label={r.status === 'published' ? 'Dipublikasi' : r.status === 'draft' ? 'Draft' : 'Menunggu'}
                />
            ),
        },
        {
            key: 'actions',
            header: '',
            render: () => (
                <div className="flex items-center gap-1">
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <Eye size={16} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <Download size={16} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <Printer size={16} />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="E-Raport"
                subtitle="Kelola dan cetak raport siswa"
                breadcrumb={[
                    { label: 'Penilaian', path: '/grading' },
                    { label: 'E-Raport' },
                ]}
                actions={
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                            <FileText size={18} />
                            Template
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Download size={18} />
                            Export Semua
                        </button>
                    </div>
                }
            />

            <FilterBar
                searchPlaceholder="Cari siswa..."
                filters={[
                    {
                        label: 'Semua Kelas',
                        options: [
                            { label: '10-A', value: '10-A' },
                            { label: '10-B', value: '10-B' },
                            { label: '11-A', value: '11-A' },
                        ],
                    },
                    {
                        label: 'Semester',
                        options: [
                            { label: 'Ganjil 2024', value: 'ganjil-2024' },
                            { label: 'Genap 2024', value: 'genap-2024' },
                        ],
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Dipublikasi', value: 'published' },
                            { label: 'Draft', value: 'draft' },
                            { label: 'Menunggu', value: 'pending' },
                        ],
                    },
                ]}
            />

            <DataTable
                columns={columns}
                data={mockReports}
                currentPage={1}
                totalPages={5}
                totalItems={150}
            />
        </div>
    )
}
