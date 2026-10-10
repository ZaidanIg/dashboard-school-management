import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Search,
    Calendar,
    Eye,
    User,
    ArrowRight,
    ArrowLeft,
    Newspaper,
    BookOpen
} from 'lucide-react'
import { API_URL } from '../../../lib/api'

interface ArticleItem {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage?: string | null
    category: string
    authorName: string
    views: number
    publishedAt: string
    createdAt: string
}

interface CategoryCount {
    name: string
    count: number
}

export default function NewsPortal() {
    const [articles, setArticles] = useState<ArticleItem[]>([])
    const [categories, setCategories] = useState<CategoryCount[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
    const [search, setSearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    const fetchArticles = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (selectedCategory !== 'ALL') params.append('category', selectedCategory)

            const res = await fetch(`${API_URL}/public/articles?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setArticles(data.data || [])
                if (data.categories) {
                    setCategories(data.categories)
                }
            }
        } catch (err) {
            console.error('Failed to load articles:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArticles()
        }, 250)
        return () => clearTimeout(timer)
    }, [search, selectedCategory])

    const featured = articles[0]
    const remaining = articles.slice(1)

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased selection:bg-[#5575FF] selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/90 py-4 backdrop-blur-md border-b border-slate-100 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/home"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#5575FF] transition py-1.5 px-3 rounded-lg hover:bg-blue-50"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Beranda
                        </Link>
                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                <Newspaper size={18} />
                            </div>
                            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                                Portal Warta & Berita
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/home#kegiatan"
                            className="text-xs font-semibold text-slate-600 hover:text-[#5575FF] transition hidden md:inline-block"
                        >
                            Home
                        </Link>
                        <Link
                            to="/login"
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#5575FF] text-white hover:bg-blue-600 transition shadow-sm"
                        >
                            Login Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Header */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/60 pt-14 pb-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-[#5575FF] text-xs font-semibold mb-4 shadow-2xs">
                            Kabar Terkini & Publikasi Resmi
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Warta & Kabar Terkini Sekolah
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                            Pusat publikasi informasi, liputan kegiatan OSIS & MPK, prestasi siswa di kancah nasional, serta inovasi akademik sekolah terpadu.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-8 relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari artikel, kegiatan, olimpiade, seni..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#5575FF]/20 focus:border-[#5575FF] transition"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter Pills */}
            <section className="py-6 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                            onClick={() => setSelectedCategory('ALL')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedCategory === 'ALL'
                                    ? 'bg-[#5575FF] text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Semua Berita
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                                    selectedCategory === cat.name
                                        ? 'bg-[#5575FF] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles List / Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="py-24 text-center">
                        <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-[#5575FF] border-t-transparent"></div>
                        <p className="mt-3 text-sm text-slate-500">Memuat artikel warta...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={30} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Tidak ada artikel ditemukan</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Coba ubah kata kunci pencarian atau pilih kategori yang lain.
                        </p>
                        <button
                            onClick={() => { setSearch(''); setSelectedCategory('ALL'); }}
                            className="mt-5 px-5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-[#5575FF] hover:bg-blue-100 transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Featured Headline Article (Only when no search is applied) */}
                        {!search && selectedCategory === 'ALL' && featured && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    <div className="lg:col-span-7 h-72 lg:h-[420px] overflow-hidden relative">
                                        <img
                                            src={featured.coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80'}
                                            alt={featured.title}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-[#5575FF] text-white text-xs font-bold rounded-xl shadow-md">
                                                Sorotan Utama
                                            </span>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                    {featured.category}
                                                </span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {new Date(featured.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>

                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug hover:text-[#5575FF] transition">
                                                <Link to={`/berita/${featured.slug}`}>
                                                    {featured.title}
                                                </Link>
                                            </h2>

                                            <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-4">
                                                {featured.excerpt}
                                            </p>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <User size={14} className="text-slate-400" />
                                                <span>{featured.authorName}</span>
                                            </div>

                                            <Link
                                                to={`/berita/${featured.slug}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5575FF] hover:gap-2.5 transition-all"
                                            >
                                                Baca Selengkapnya
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Articles Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {search ? 'Hasil Pencarian' : selectedCategory !== 'ALL' ? `Kategori: ${selectedCategory}` : 'Semua Berita & Artikel'}
                                </h3>
                                <span className="text-xs text-slate-500 font-medium">
                                    Menampilkan {(!search && selectedCategory === 'ALL' ? remaining.length : articles.length)} artikel
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {(!search && selectedCategory === 'ALL' ? remaining : articles).map((article) => (
                                    <article
                                        key={article.id}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
                                    >
                                        <div className="h-50 bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={article.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-xs font-bold text-blue-700 rounded-lg shadow-xs">
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={13} />
                                                        {new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={13} />
                                                        {article.views} views
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#5575FF] transition line-clamp-2">
                                                    <Link to={`/berita/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h4>

                                                <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                                                    {article.excerpt}
                                                </p>
                                            </div>

                                            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                                                <span className="text-slate-500 truncate max-w-[140px] flex items-center gap-1">
                                                    <User size={13} className="text-slate-400" />
                                                    {article.authorName}
                                                </span>

                                                <Link
                                                    to={`/berita/${article.slug}`}
                                                    className="font-bold text-[#5575FF] hover:underline flex items-center gap-1"
                                                >
                                                    Baca
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
                <p>© {new Date().getFullYear()} Portal Berita & Warta Sekolah. Hak cipta dilindungi undang-undang.</p>
                <div className="mt-2 flex justify-center gap-4 text-slate-400">
                    <Link to="/home" className="hover:text-slate-600 transition">Beranda Utama</Link>
                    <span>•</span>
                    <Link to="/ppdb/register" className="hover:text-slate-600 transition">PPDB Online</Link>
                    <span>•</span>
                    <Link to="/login" className="hover:text-slate-600 transition">Login Sistem</Link>
                </div>
            </footer>
        </div>
    )
}
