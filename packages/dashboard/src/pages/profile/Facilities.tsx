import { Building, Monitor, BookOpen, Dumbbell, FlaskConical, Music, Leaf, Wifi } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const facilities = [
    { name: 'Ruang Kelas', count: 36, icon: Building, description: 'Dilengkapi AC, LCD Proyektor, dan Smart TV', status: 'excellent' },
    { name: 'Laboratorium Komputer', count: 3, icon: Monitor, description: '120 unit komputer terbaru dengan internet fiber', status: 'excellent' },
    { name: 'Laboratorium IPA', count: 4, icon: FlaskConical, description: 'Lab Fisika, Kimia, Biologi, dan Multimedia', status: 'good' },
    { name: 'Perpustakaan', count: 1, icon: BookOpen, description: '15.000+ koleksi buku, e-library, ruang baca nyaman', status: 'excellent' },
    { name: 'Lapangan Olahraga', count: 3, icon: Dumbbell, description: 'Lapangan basket, voli, dan futsal indoor', status: 'good' },
    { name: 'Ruang Musik & Seni', count: 2, icon: Music, description: 'Studio musik dan ruang seni lukis', status: 'good' },
    { name: 'Taman Sekolah', count: 4, icon: Leaf, description: 'Area hijau untuk pembelajaran outdoor', status: 'excellent' },
    { name: 'Hotspot Area', count: 10, icon: Wifi, description: 'WiFi coverage seluruh area sekolah', status: 'excellent' },
]

const statusColors = {
    excellent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    good: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    fair: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const statusLabels = {
    excellent: 'Sangat Baik',
    good: 'Baik',
    fair: 'Cukup',
}

export default function Facilities() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Fasilitas Sekolah"
                subtitle="Sarana dan prasarana yang tersedia"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Fasilitas' },
                ]}
            />

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-3xl font-bold text-primary">36</p>
                    <p className="text-sm text-text-secondary">Ruang Kelas</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-3xl font-bold text-emerald-600">7</p>
                    <p className="text-sm text-text-secondary">Laboratorium</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-3xl font-bold text-purple-600">15</p>
                    <p className="text-sm text-text-secondary">Fasilitas Umum</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-3xl font-bold text-amber-600">100%</p>
                    <p className="text-sm text-text-secondary">WiFi Coverage</p>
                </div>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {facilities.map((facility, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <facility.icon size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[facility.status as keyof typeof statusColors]}`}>
                                {statusLabels[facility.status as keyof typeof statusLabels]}
                            </span>
                        </div>
                        <h3 className="font-semibold text-text-main dark:text-white mb-1">{facility.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-2">{facility.count}</p>
                        <p className="text-sm text-text-secondary">{facility.description}</p>
                    </div>
                ))}
            </div>

            {/* Additional Facilities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="font-semibold text-text-main dark:text-white mb-4">Fasilitas Pendukung</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Kantin', 'Masjid', 'UKS', 'Parkir', 'Aula', 'Ruang Guru', 'Ruang OSIS', 'Koperasi'].map((item) => (
                        <div key={item} className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg text-center">
                            <p className="font-medium text-text-main dark:text-white">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
