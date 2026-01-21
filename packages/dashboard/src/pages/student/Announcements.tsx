import { useState } from 'react'
import { Megaphone, Calendar } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import { useAnnouncements } from '@/hooks/useCommunication'

const typeColors: Record<string, string> = {
    INFO: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MEETING: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    EXAM: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    URGENT: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function StudentAnnouncements() {
    const [search, setSearch] = useState('')
    const { announcements, loading } = useAnnouncements({ search, status: 'PUBLISHED' })

    return (
        <div className="space-y-6 px-4 md:px-0">
            <PageHeader
                title="Pengumuman"
                subtitle="Informasi terbaru dari sekolah"
                breadcrumb={[{ label: 'Pengumuman' }]}
            />

            <FilterBar
                searchPlaceholder="Cari pengumuman..."
                onSearch={setSearch}
            />

            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-10">Memuat pengumuman...</p>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                        <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada pengumuman</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Megaphone size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-text-main dark:text-white">
                                            {announcement.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColors[announcement.type] || 'bg-gray-100 text-gray-700'}`}>
                                            {announcement.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-3">{announcement.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                                        </span>
                                        {announcement.author?.name && <span>Oleh: {announcement.author.name}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
