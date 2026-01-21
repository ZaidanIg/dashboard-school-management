import { Trophy, Medal, Star, Calendar, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'

const achievements = [
    { id: 1, title: 'Juara 1 OSN Matematika Tingkat Nasional', level: 'Nasional', category: 'Akademik', year: 2024, student: 'Ahmad Rizki', medal: 'gold' },
    { id: 2, title: 'Juara 2 English Debate Competition', level: 'Provinsi', category: 'Akademik', year: 2024, student: 'Siti Aminah', medal: 'silver' },
    { id: 3, title: 'Juara 1 Basket Putra POPDA', level: 'Kota', category: 'Olahraga', year: 2024, student: 'Tim Basket', medal: 'gold' },
    { id: 4, title: 'Juara 3 Lomba Paduan Suara', level: 'Nasional', category: 'Seni', year: 2023, student: 'Tim Paduan Suara', medal: 'bronze' },
    { id: 5, title: 'Juara 1 Olimpiade Fisika', level: 'Provinsi', category: 'Akademik', year: 2024, student: 'Budi Santoso', medal: 'gold' },
    { id: 6, title: 'Juara 2 Karya Tulis Ilmiah', level: 'Nasional', category: 'Akademik', year: 2023, student: 'Dewi Lestari', medal: 'silver' },
    { id: 7, title: 'Juara 1 Pramuka Tingkat Kwarda', level: 'Provinsi', category: 'Ekstrakurikuler', year: 2024, student: 'Regu Garuda', medal: 'gold' },
    { id: 8, title: 'Best Delegation MUN', level: 'Internasional', category: 'Akademik', year: 2024, student: 'Tim MUN', medal: 'gold' },
]

const medalColors = {
    gold: 'bg-amber-100 text-amber-700 border-amber-200',
    silver: 'bg-slate-100 text-slate-700 border-slate-200',
    bronze: 'bg-orange-100 text-orange-700 border-orange-200',
}

const levelColors = {
    Internasional: 'bg-purple-500',
    Nasional: 'bg-rose-500',
    Provinsi: 'bg-blue-500',
    Kota: 'bg-emerald-500',
}

export default function Achievements() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Prestasi"
                subtitle="Pencapaian dan penghargaan sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Prestasi' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={18} />
                        Tambah Prestasi
                    </button>
                }
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-5 text-white text-center">
                    <Medal size={32} className="mx-auto mb-2" />
                    <p className="text-3xl font-bold">45</p>
                    <p className="text-amber-100 text-sm">Emas</p>
                </div>
                <div className="bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl p-5 text-white text-center">
                    <Medal size={32} className="mx-auto mb-2" />
                    <p className="text-3xl font-bold">38</p>
                    <p className="text-slate-100 text-sm">Perak</p>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-5 text-white text-center">
                    <Medal size={32} className="mx-auto mb-2" />
                    <p className="text-3xl font-bold">52</p>
                    <p className="text-orange-100 text-sm">Perunggu</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white text-center">
                    <Star size={32} className="mx-auto mb-2" />
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-purple-100 text-sm">Internasional</p>
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white text-center">
                    <Trophy size={32} className="mx-auto mb-2" />
                    <p className="text-3xl font-bold">150+</p>
                    <p className="text-rose-100 text-sm">Total Prestasi</p>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Cari prestasi..."
                filters={[
                    {
                        label: 'Tingkat',
                        options: [
                            { label: 'Internasional', value: 'Internasional' },
                            { label: 'Nasional', value: 'Nasional' },
                            { label: 'Provinsi', value: 'Provinsi' },
                            { label: 'Kota', value: 'Kota' },
                        ],
                    },
                    {
                        label: 'Kategori',
                        options: [
                            { label: 'Akademik', value: 'Akademik' },
                            { label: 'Olahraga', value: 'Olahraga' },
                            { label: 'Seni', value: 'Seni' },
                            { label: 'Ekstrakurikuler', value: 'Ekstrakurikuler' },
                        ],
                    },
                    {
                        label: 'Tahun',
                        options: [
                            { label: '2024', value: '2024' },
                            { label: '2023', value: '2023' },
                            { label: '2022', value: '2022' },
                        ],
                    },
                ]}
            />

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl border-2 ${medalColors[achievement.medal as keyof typeof medalColors]} flex items-center justify-center`}>
                                <Trophy size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-text-main dark:text-white">{achievement.title}</h3>
                                    <span className={`px-2 py-1 ${levelColors[achievement.level as keyof typeof levelColors]} text-white rounded text-xs font-medium`}>
                                        {achievement.level}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary mb-2">{achievement.student}</p>
                                <div className="flex items-center gap-3 text-xs text-text-secondary">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-700 rounded">{achievement.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {achievement.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
