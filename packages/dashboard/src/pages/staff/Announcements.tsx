import { useState, useEffect } from 'react'
import { Plus, Search, Send, Users, GraduationCap, Bell, Edit, Trash2, Eye } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface Announcement {
    id: string
    title: string
    content: string
    target: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS'
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
    createdAt: string
    publishedAt?: string
    author: string
}

export default function StaffAnnouncements() {
    const [search, setSearch] = useState('')
    const [targetFilter, setTargetFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target: 'ALL' as Announcement['target']
    })

    useEffect(() => {
        setTimeout(() => {
            setAnnouncements([
                { id: '1', title: 'Libur Semester Genap', content: 'Sekolah akan libur semester genap mulai tanggal 1 Februari 2026...', target: 'ALL', status: 'PUBLISHED', createdAt: '2026-01-20', publishedAt: '2026-01-20', author: 'Admin TU' },
                { id: '2', title: 'Rapat Guru Bulanan', content: 'Rapat guru bulanan akan dilaksanakan pada hari Senin...', target: 'TEACHERS', status: 'PUBLISHED', createdAt: '2026-01-18', publishedAt: '2026-01-18', author: 'Kepala Sekolah' },
                { id: '3', title: 'Jadwal Ujian Semester', content: 'Berikut jadwal ujian semester genap...', target: 'STUDENTS', status: 'SCHEDULED', createdAt: '2026-01-15', author: 'Admin TU' },
                { id: '4', title: 'Pembayaran SPP Februari', content: 'Mohon untuk segera melunasi SPP bulan Februari...', target: 'PARENTS', status: 'DRAFT', createdAt: '2026-01-21', author: 'Bendahara' }
            ])
            setLoading(false)
        }, 500)
    }, [])

    const filteredAnnouncements = announcements.filter(a => {
        if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
        if (targetFilter && a.target !== targetFilter) return false
        return true
    })

    const getTargetLabel = (target: string) => {
        switch (target) {
            case 'ALL': return 'Semua'
            case 'TEACHERS': return 'Guru'
            case 'STUDENTS': return 'Siswa'
            case 'PARENTS': return 'Orang Tua'
            default: return target
        }
    }

    const getTargetIcon = (target: string) => {
        switch (target) {
            case 'ALL': return Bell
            case 'TEACHERS': return Users
            case 'STUDENTS': return GraduationCap
            case 'PARENTS': return Users
            default: return Bell
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Add new announcement (placeholder)
        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            ...formData,
            status: 'DRAFT',
            createdAt: new Date().toISOString().split('T')[0],
            author: 'Admin TU'
        }
        setAnnouncements([newAnnouncement, ...announcements])
        setShowForm(false)
        setFormData({ title: '', content: '', target: 'ALL' })
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Pengumuman"
                subtitle="Buat dan kelola pengumuman untuk guru dan siswa"
                breadcrumb={[{ label: 'Pengumuman' }]}
                actions={
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Buat Pengumuman
                    </button>
                }
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pengumuman..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Target</option>
                    <option value="ALL">Semua Penerima</option>
                    <option value="TEACHERS">Guru</option>
                    <option value="STUDENTS">Siswa</option>
                    <option value="PARENTS">Orang Tua</option>
                </select>
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => {
                        const TargetIcon = getTargetIcon(announcement.target)
                        return (
                            <div
                                key={announcement.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-text-main dark:text-white">
                                                {announcement.title}
                                            </h3>
                                            <StatusBadge
                                                status={
                                                    announcement.status === 'PUBLISHED' ? 'success' :
                                                        announcement.status === 'SCHEDULED' ? 'warning' : 'info'
                                                }
                                                label={
                                                    announcement.status === 'PUBLISHED' ? 'Terkirim' :
                                                        announcement.status === 'SCHEDULED' ? 'Terjadwal' : 'Draft'
                                                }
                                            />
                                        </div>
                                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                                            {announcement.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <TargetIcon size={14} />
                                                {getTargetLabel(announcement.target)}
                                            </span>
                                            <span>Dibuat: {formatDate(announcement.createdAt)}</span>
                                            {announcement.publishedAt && (
                                                <span>Dikirim: {formatDate(announcement.publishedAt)}</span>
                                            )}
                                            <span>Oleh: {announcement.author}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {announcement.status === 'DRAFT' && (
                                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                                                <Send size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Create Announcement Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                            Buat Pengumuman Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-900"
                                    placeholder="Judul pengumuman..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Target Penerima</label>
                                <select
                                    value={formData.target}
                                    onChange={(e) => setFormData({ ...formData, target: e.target.value as Announcement['target'] })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-900"
                                >
                                    <option value="ALL">Semua (Guru, Siswa, Orang Tua)</option>
                                    <option value="TEACHERS">Guru</option>
                                    <option value="STUDENTS">Siswa</option>
                                    <option value="PARENTS">Orang Tua</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Isi Pengumuman</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
                                    placeholder="Tulis isi pengumuman..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    Simpan Draft
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Send size={16} />
                                    Kirim Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
