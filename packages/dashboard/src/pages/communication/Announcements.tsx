import { useState } from 'react'
import { Megaphone, Plus, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useAnnouncements } from '@/hooks/useCommunication'

const typeColors: Record<string, string> = {
    INFO: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MEETING: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    EXAM: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    URGENT: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Announcements() {
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState<string>('')
    const [filterStatus, setFilterStatus] = useState<string>('')

    // Convert filters to record for hook
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (filterType) params.type = filterType
    if (filterStatus) params.status = filterStatus

    const { announcements, loading, error, refetch } = useAnnouncements(params)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pengumuman"
                subtitle="Kelola pengumuman sekolah"
                breadcrumb={[
                    { label: 'Komunikasi', path: '/communication' },
                    { label: 'Pengumuman' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Plus size={18} />
                            Buat Pengumuman
                        </button>
                    </div>
                }
            />

            <FilterBar
                searchPlaceholder="Cari pengumuman..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Tipe',
                        options: [
                            { label: 'Info', value: 'INFO' },
                            { label: 'Meeting', value: 'MEETING' },
                            { label: 'Exam', value: 'EXAM' },
                            { label: 'Urgent', value: 'URGENT' },
                        ],
                        onChange: (val) => setFilterType(val)
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Published', value: 'PUBLISHED' },
                            { label: 'Draft', value: 'DRAFT' },
                            { label: 'Archived', value: 'ARCHIVED' },
                        ],
                        onChange: (val) => setFilterStatus(val)
                    },
                ]}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada pengumuman</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-text-main dark:text-white">
                                                {announcement.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColors[announcement.type] || 'bg-gray-100 text-gray-700'}`}>
                                                {announcement.type}
                                            </span>
                                            {announcement.status === 'DRAFT' && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-secondary mb-2">{announcement.content}</p>
                                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                            <span>Target: {announcement.target}</span>
                                            {announcement.author?.name && <span>Oleh: {announcement.author.name}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Eye size={16} />
                                    </button>
                                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
