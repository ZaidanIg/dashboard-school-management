import { Image, Plus, Grid, List } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'

const categories = ['Semua', 'Kegiatan', 'Acara', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler']

const galleryItems = [
    { id: 1, title: 'Upacara Bendera', category: 'Kegiatan', date: '2024-01-08' },
    { id: 2, title: 'Juara OSN Matematika', category: 'Prestasi', date: '2024-01-05' },
    { id: 3, title: 'Pentas Seni Akhir Tahun', category: 'Acara', date: '2023-12-20' },
    { id: 4, title: 'Laboratorium Komputer', category: 'Fasilitas', date: '2024-01-01' },
    { id: 5, title: 'Latihan Basket', category: 'Ekstrakurikuler', date: '2024-01-10' },
    { id: 6, title: 'Wisuda Kelas 12', category: 'Acara', date: '2023-12-15' },
    { id: 7, title: 'Perpustakaan Baru', category: 'Fasilitas', date: '2024-01-03' },
    { id: 8, title: 'Pramuka Camping', category: 'Ekstrakurikuler', date: '2024-01-06' },
    { id: 9, title: 'Juara Debat Bahasa Inggris', category: 'Prestasi', date: '2024-01-12' },
    { id: 10, title: 'Study Tour Jogja', category: 'Kegiatan', date: '2023-12-10' },
    { id: 11, title: 'Rapat Guru', category: 'Kegiatan', date: '2024-01-09' },
    { id: 12, title: 'Paduan Suara', category: 'Ekstrakurikuler', date: '2024-01-11' },
]

const colorGradients = [
    'from-blue-400 to-blue-600',
    'from-emerald-400 to-emerald-600',
    'from-purple-400 to-purple-600',
    'from-rose-400 to-rose-600',
    'from-amber-400 to-amber-600',
    'from-cyan-400 to-cyan-600',
]

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const filteredItems = activeCategory === 'Semua'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Galeri Sekolah"
                subtitle="Dokumentasi kegiatan dan prestasi"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Galeri' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={18} />
                        Upload Foto
                    </button>
                }
            />

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 dark:bg-gray-700 text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-secondary'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-text-secondary'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map((item, index) => (
                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                            <div className={`absolute inset-0 bg-gradient-to-br ${colorGradients[index % colorGradients.length]}`}>
                                <div className="absolute inset-0 flex items-center justify-center text-white/30">
                                    <Image size={48} />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-medium">{item.title}</p>
                                    <p className="text-white/70 text-sm">{item.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 divide-y divide-border-color dark:divide-gray-700">
                    {filteredItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 cursor-pointer">
                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorGradients[index % colorGradients.length]} flex items-center justify-center text-white/50`}>
                                <Image size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-text-main dark:text-white">{item.title}</p>
                                <p className="text-sm text-text-secondary">{item.category} • {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">256</p>
                    <p className="text-sm text-text-secondary">Total Foto</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">12</p>
                    <p className="text-sm text-text-secondary">Album</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">45</p>
                    <p className="text-sm text-text-secondary">Video</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-text-main dark:text-white">2024</p>
                    <p className="text-sm text-text-secondary">Tahun Ini</p>
                </div>
            </div>
        </div>
    )
}
