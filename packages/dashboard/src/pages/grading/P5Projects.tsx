import { Lightbulb, Users, Calendar, Plus, Eye } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import StatusBadge from '@/components/common/StatusBadge'

const projects = [
    {
        id: '1',
        title: 'Kearifan Lokal Nusantara',
        theme: 'Bhinneka Tunggal Ika',
        class: '10-A',
        mentor: 'Pak Budi',
        students: 32,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        status: 'ongoing',
        progress: 45,
    },
    {
        id: '2',
        title: 'Teknologi Ramah Lingkungan',
        theme: 'Gaya Hidup Berkelanjutan',
        class: '10-B',
        mentor: 'Bu Siti',
        students: 30,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        status: 'ongoing',
        progress: 60,
    },
    {
        id: '3',
        title: 'Wirausaha Muda',
        theme: 'Kewirausahaan',
        class: '11-A',
        mentor: 'Pak Ahmad',
        students: 31,
        startDate: '2023-09-01',
        endDate: '2023-12-15',
        status: 'completed',
        progress: 100,
    },
    {
        id: '4',
        title: 'Budaya Digital',
        theme: 'Rekayasa dan Teknologi',
        class: '11-B',
        mentor: 'Bu Dewi',
        students: 29,
        startDate: '2024-02-01',
        endDate: '2024-04-30',
        status: 'planned',
        progress: 0,
    },
]

const themeColors: Record<string, string> = {
    'Bhinneka Tunggal Ika': 'bg-rose-500',
    'Gaya Hidup Berkelanjutan': 'bg-emerald-500',
    'Kewirausahaan': 'bg-amber-500',
    'Rekayasa dan Teknologi': 'bg-blue-500',
}

export default function P5Projects() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Projek P5"
                subtitle="Projek Penguatan Profil Pelajar Pancasila"
                breadcrumb={[
                    { label: 'Penilaian', path: '/grading' },
                    { label: 'Projek P5' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={18} />
                        Buat Projek
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari projek..."
                filters={[
                    {
                        label: 'Tema',
                        options: [
                            { label: 'Bhinneka Tunggal Ika', value: 'bhinneka' },
                            { label: 'Gaya Hidup Berkelanjutan', value: 'sustainable' },
                            { label: 'Kewirausahaan', value: 'entrepreneurship' },
                            { label: 'Rekayasa dan Teknologi', value: 'technology' },
                        ],
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Berjalan', value: 'ongoing' },
                            { label: 'Selesai', value: 'completed' },
                            { label: 'Direncanakan', value: 'planned' },
                        ],
                    },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg ${themeColors[project.theme] || 'bg-primary'} flex items-center justify-center text-white`}>
                                    <Lightbulb size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-main dark:text-white">{project.title}</h3>
                                    <p className="text-sm text-text-secondary">{project.theme}</p>
                                </div>
                            </div>
                            <StatusBadge
                                status={project.status === 'ongoing' ? 'active' : project.status === 'completed' ? 'success' : 'pending'}
                                label={project.status === 'ongoing' ? 'Berjalan' : project.status === 'completed' ? 'Selesai' : 'Direncanakan'}
                            />
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Kelas</span>
                                <span className="font-medium text-text-main dark:text-white">{project.class}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Pembimbing</span>
                                <span className="font-medium text-text-main dark:text-white">{project.mentor}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary flex items-center gap-1"><Users size={14} /> Siswa</span>
                                <span className="font-medium text-text-main dark:text-white">{project.students}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary flex items-center gap-1"><Calendar size={14} /> Periode</span>
                                <span className="font-medium text-text-main dark:text-white">{project.startDate} - {project.endDate}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-text-secondary">Progress</span>
                                <span className="font-medium text-text-main dark:text-white">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                            <Eye size={16} />
                            Lihat Detail
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
