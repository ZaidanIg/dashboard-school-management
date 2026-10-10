import React, { useState, useEffect } from 'react'
import {
    Newspaper,
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2,
    ExternalLink,
    Image as ImageIcon,
    Calendar,
    User,
    CheckCircle2,
    FileEdit,
    X,
    Upload,
    TrendingUp,
    BookOpen
} from 'lucide-react'
import { api, API_URL } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'
import { Link } from 'react-router-dom'

interface Article {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage?: string | null
    category: string
    authorName: string
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
    views: number
    publishedAt?: string | null
    createdAt: string
    updatedAt: string
}

interface Stats {
    total: number
    published: number
    draft: number
    archived: number
    totalViews: number
}

const CATEGORIES = [
    'Semua',
    'Berita Sekolah',
    'Kegiatan Siswa',
    'Prestasi',
    'Akademik',
    'Seni & Budaya',
    'Ekstrakurikuler',
    'Opini & Edukasi'
]

export default function NewsManagement() {
    const { addToast } = useToast()
    const [articles, setArticles] = useState<Article[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, archived: 0, totalViews: 0 })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [selectedStatus, setSelectedStatus] = useState('ALL')

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<Article | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: 'Berita Sekolah',
        authorName: 'Tim Redaksi',
        excerpt: '',
        content: '',
        coverImage: '',
        status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
    })

    const fetchStats = async () => {
        try {
            const res = await api.get<Stats>('/api/articles/stats')
            setStats(res)
        } catch {
            // fallback
        }
    }

    const fetchArticles = async () => {
        try {
            setLoading(true)
            const queryParams: Record<string, string> = {}
            if (search) queryParams.search = search
            if (selectedCategory !== 'Semua') queryParams.category = selectedCategory
            if (selectedStatus !== 'ALL') queryParams.status = selectedStatus

            const res = await api.get<{ data: Article[] }>('/api/articles', queryParams)
            setArticles(res.data || [])
        } catch (err: any) {
            addToast('error', err?.message || 'Gagal memuat artikel')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArticles()
        }, 300)
        return () => clearTimeout(timer)
    }, [search, selectedCategory, selectedStatus])

    const handleOpenModal = (article?: Article) => {
        if (article) {
            setEditingArticle(article)
            setFormData({
                title: article.title,
                category: article.category,
                authorName: article.authorName,
                excerpt: article.excerpt || '',
                content: article.content || '',
                coverImage: article.coverImage || '',
                status: article.status
            })
        } else {
            setEditingArticle(null)
            setFormData({
                title: '',
                category: selectedCategory !== 'Semua' ? selectedCategory : 'Berita Sekolah',
                authorName: 'Tim Redaksi',
                excerpt: '',
                content: '',
                coverImage: '',
                status: 'PUBLISHED'
            })
        }
        setIsModalOpen(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploadingImage(true)
            const form = new FormData()
            form.append('file', file)

            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: form
            })

            if (!res.ok) throw new Error('Gagal mengunggah gambar')
            const data = await res.json()
            setFormData(prev => ({ ...prev, coverImage: data.url }))
            addToast('success', 'Gambar berhasil diunggah')
        } catch (err: any) {
            addToast('error', err?.message || 'Gagal mengunggah gambar')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim()) {
            addToast('error', 'Judul artikel wajib diisi')
            return
        }
        if (!formData.content.trim()) {
            addToast('error', 'Konten artikel wajib diisi')
            return
        }

        try {
            setSubmitting(true)
            const payload = {
                ...formData,
                excerpt: formData.excerpt.trim() || formData.title.slice(0, 150)
            }

            if (editingArticle) {
                await api.put(`/api/articles/${editingArticle.id}`, payload)
                addToast('success', 'Artikel berhasil diperbarui')
            } else {
                await api.post('/api/articles', payload)
                addToast('success', 'Artikel baru berhasil dibuat')
            }

            setIsModalOpen(false)
            fetchArticles()
            fetchStats()
        } catch (err: any) {
            addToast('error', err?.message || 'Gagal menyimpan artikel')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return

        try {
            await api.delete(`/api/articles/${id}`)
            addToast('success', 'Artikel berhasil dihapus')
            fetchArticles()
            fetchStats()
        } catch (err: any) {
            addToast('error', err?.message || 'Gagal menghapus artikel')
        }
    }

    const handleToggleStatus = async (article: Article) => {
        const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        try {
            await api.put(`/api/articles/${article.id}`, { status: newStatus })
            addToast('success', `Status artikel diubah menjadi ${newStatus === 'PUBLISHED' ? 'Terbit' : 'Draf'}`)
            fetchArticles()
            fetchStats()
        } catch (err: any) {
            addToast('error', err?.message || 'Gagal mengubah status artikel')
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Newspaper size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portal Berita & Artikel</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Kelola portal publikasi sekolah, berita prestasi, liputan kegiatan OSIS & MPK.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/berita"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        <ExternalLink size={16} />
                        Lihat Portal Publik
                    </Link>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5575FF] hover:bg-blue-600 text-white text-sm font-semibold shadow-sm hover:shadow transition"
                    >
                        <Plus size={18} />
                        Tulis Artikel Baru
                    </button>
                </div>
            </div>

            {/* Metric Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#5575FF] flex items-center justify-center">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-xs font-medium text-gray-500">Total Artikel</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
                        <div className="text-xs font-medium text-gray-500">Diterbitkan</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <FileEdit size={22} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
                        <div className="text-xs font-medium text-gray-500">Draf / Menunggu</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalViews}</div>
                        <div className="text-xs font-medium text-gray-500">Total Pembaca</div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari judul, ringkasan, penulis..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5575FF]/20 focus:border-[#5575FF] transition"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Status select */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5575FF]/20"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PUBLISHED">Diterbitkan (Published)</option>
                        <option value="DRAFT">Draf (Draft)</option>
                        <option value="ARCHIVED">Arsip (Archived)</option>
                    </select>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                            selectedCategory === cat
                                ? 'bg-[#5575FF] text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5575FF] border-t-transparent"></div>
                    <p className="mt-3 text-sm text-gray-500">Memuat artikel portal berita...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Newspaper size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Belum ada artikel</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                        Mulai tulis warta sekolah, prestasi siswa, atau agenda organisasi sekarang.
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5575FF] text-white text-sm font-semibold hover:bg-blue-600 transition"
                    >
                        <Plus size={18} />
                        Tulis Artikel Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden group"
                        >
                            {/* Image Header */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {item.coverImage ? (
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-300">
                                        <ImageIcon size={40} />
                                        <span className="text-xs text-blue-400 mt-1">Tanpa Gambar Sampul</span>
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-blue-700 rounded-lg shadow-sm">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm ${
                                            item.status === 'PUBLISHED'
                                                ? 'bg-emerald-500 text-white'
                                                : item.status === 'DRAFT'
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-gray-600 text-white'
                                        }`}
                                    >
                                        {item.status === 'PUBLISHED' ? 'Terbit' : item.status === 'DRAFT' ? 'Draf' : 'Arsip'}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={13} />
                                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draf'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={13} />
                                            {item.views} views
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug group-hover:text-[#5575FF] transition">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                                        {item.excerpt || item.content.slice(0, 100)}
                                    </p>
                                </div>

                                {/* Card Footer & Actions */}
                                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1 truncate max-w-[120px]">
                                        <User size={13} className="text-gray-400" />
                                        {item.authorName}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        {/* Toggle status */}
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            title={item.status === 'PUBLISHED' ? 'Ubah ke Draf' : 'Terbitkan'}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                        >
                                            {item.status === 'PUBLISHED' ? <FileEdit size={15} /> : <CheckCircle2 size={15} />}
                                        </button>

                                        {/* View public link */}
                                        {item.status === 'PUBLISHED' && (
                                            <Link
                                                to={`/berita/${item.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Lihat Halaman Artikel"
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                                            >
                                                <ExternalLink size={15} />
                                            </Link>
                                        )}

                                        {/* Edit */}
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            title="Edit Artikel"
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                        >
                                            <Edit3 size={15} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(item.id, item.title)}
                                            title="Hapus Artikel"
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Lengkapi informasi berita dan konten artikel portal sekolah.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Judul Artikel *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Pelantikan Pengurus OSIS & MPK Masa Bakti 2026/2027"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20 focus:border-[#5575FF] transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20"
                                    >
                                        {CATEGORIES.filter(c => c !== 'Semua').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Penulis / Redaksi
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tim Redaksi / Humas Sekolah"
                                        value={formData.authorName}
                                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20 focus:border-[#5575FF] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Status Publikasi
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20"
                                    >
                                        <option value="PUBLISHED">Terbit Sekarang (Published)</option>
                                        <option value="DRAFT">Simpan Draf (Draft)</option>
                                        <option value="ARCHIVED">Arsipkan (Archived)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Cover Image Upload & Preview */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Foto Sampul (Cover Image)
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <div className="relative flex-1 w-full">
                                        <input
                                            type="text"
                                            placeholder="URL gambar atau unggah file di samping..."
                                            value={formData.coverImage}
                                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                            className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20"
                                        />
                                    </div>

                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition">
                                        <Upload size={14} />
                                        {uploadingImage ? 'Mengunggah...' : 'Upload File'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>

                                {formData.coverImage && (
                                    <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                        <img
                                            src={formData.coverImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, coverImage: '' })}
                                            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-md hover:bg-black/80 transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Ringkasan / Sinopsis Singkat
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Ringkasan 1-2 kalimat untuk kartu berita dan meta pratinjau..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20"
                                />
                            </div>

                            {/* Full Content */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Isi Konten Artikel *
                                </label>
                                <textarea
                                    rows={10}
                                    required
                                    placeholder="Tuliskan isi artikel lengkap di sini... (Mendukung paragraf dan format tulisan)"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5575FF]/20 leading-relaxed font-sans"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-[#5575FF] hover:bg-blue-600 text-white text-sm font-semibold shadow-sm hover:shadow transition disabled:opacity-50"
                                >
                                    {submitting ? 'Menyimpan...' : editingArticle ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
