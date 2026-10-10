import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft,
    Calendar,
    Eye,
    User,
    Share2,
    Check,
    BookOpen,
    ChevronRight,
    ArrowRight
} from 'lucide-react'
import { API_URL } from '../../../lib/api'
import { hasViewedArticle, markArticleViewed, getCookieConsent } from '../../../lib/cookieConsent'

interface ArticleDetail {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage?: string | null
    category: string
    authorName: string
    views: number
    publishedAt: string
    createdAt: string
}

interface RelatedArticle {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage?: string | null
    category: string
    publishedAt: string
    views: number
}

export default function NewsDetail() {
    const { slug } = useParams<{ slug: string }>()
    const [article, setArticle] = useState<ArticleDetail | null>(null)
    const [related, setRelated] = useState<RelatedArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchArticle = async () => {
            if (!slug) return
            try {
                setLoading(true)

                // Unique view counting algorithm:
                // Check if user has already read this article within the 24h window
                const alreadyViewed = hasViewedArticle(slug)
                const consent = getCookieConsent()
                const shouldCount = !alreadyViewed && consent !== 'declined'

                const url = `${API_URL}/public/articles/${slug}${shouldCount ? '?countView=true' : ''}`
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error('Artikel tidak ditemukan')
                }
                const data = await res.json()
                setArticle(data.article)
                setRelated(data.related || [])

                if (shouldCount) {
                    markArticleViewed(slug)
                }
            } catch (err) {
                console.error('Failed to load article:', err)
                setArticle(null)
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [slug])

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article?.title,
                text: article?.excerpt,
                url: window.location.href,
            }).catch(() => {})
        } else {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#5575FF] border-t-transparent"></div>
                    <p className="mt-4 text-sm text-slate-500 font-medium">Memuat artikel...</p>
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Artikel Tidak Ditemukan</h2>
                    <p className="text-xs text-slate-500 mt-2">
                        Artikel yang Anda cari mungkin telah dipindahkan, diarsipkan, atau tautan tidak valid.
                    </p>
                    <div className="mt-6 flex flex-col gap-2">
                        <Link
                            to="/berita"
                            className="w-full py-2.5 rounded-xl bg-[#5575FF] text-white text-xs font-semibold hover:bg-blue-600 transition"
                        >
                            Kembali ke Portal Berita
                        </Link>
                        <Link
                            to="/home"
                            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                        >
                            Ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-[#5575FF] selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-2xs">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/berita"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#5575FF] transition py-1.5 px-3 rounded-lg hover:bg-blue-50"
                        >
                            <ArrowLeft size={16} />
                            Portal Berita
                        </Link>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                            <Link to="/home" className="hover:text-slate-600">Beranda</Link>
                            <ChevronRight size={12} />
                            <Link to="/berita" className="hover:text-slate-600">Berita</Link>
                            <ChevronRight size={12} />
                            <span className="text-slate-600 font-medium truncate max-w-[200px]">{article.category}</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                            {copied ? 'Tautan Disalin!' : 'Bagikan'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Article Container */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <article className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-12 overflow-hidden">
                    {/* Category & Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                            {article.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Eye size={13} />
                            {article.views} kali dibaca
                        </span>
                    </div>

                    {/* Article Title */}
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Author Byline */}
                    <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                <User size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">{article.authorName}</div>
                                <div className="text-[11px] text-slate-400">Penyunting / Redaksi Sekolah</div>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#5575FF] hover:bg-blue-50 transition"
                            title="Bagikan artikel ini"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>

                    {/* Excerpt Lead */}
                    {article.excerpt && (
                        <div className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-8 italic border-l-4 border-[#5575FF] pl-4 bg-blue-50/30 py-2 rounded-r-xl">
                            "{article.excerpt}"
                        </div>
                    )}

                    {/* Cover Image */}
                    {article.coverImage && (
                        <div className="rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-100 bg-slate-50">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full max-h-[500px] object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content Body */}
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-6">
                        {article.content.split('\n\n').map((paragraph, idx) => {
                            const trimmed = paragraph.trim()
                            if (!trimmed) return null

                            // Check if paragraph looks like a subheading
                            if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                                const headingText = trimmed.replace(/^#+\s*/, '')
                                return (
                                    <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3">
                                        {headingText}
                                    </h3>
                                )
                            }

                            // Regular paragraph
                            return (
                                <p key={idx} className="text-slate-700 leading-relaxed">
                                    {trimmed}
                                </p>
                            )
                        })}
                    </div>

                    {/* Article Bottom Actions */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-400">
                            Dipublikasikan pada {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-[#5575FF] hover:bg-blue-100 text-xs font-bold transition"
                            >
                                <Share2 size={14} />
                                {copied ? 'Tautan Tersalin' : 'Bagikan Artikel'}
                            </button>
                            <Link
                                to="/berita"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                            >
                                <ArrowLeft size={14} />
                                Warta Lainnya
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                {related.length > 0 && (
                    <section className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                Berita Terkait Lainnya
                            </h3>
                            <Link
                                to="/berita"
                                className="text-xs font-bold text-[#5575FF] hover:underline flex items-center gap-1"
                            >
                                Lihat Semua
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((rel) => (
                                <Link
                                    key={rel.id}
                                    to={`/berita/${rel.slug}`}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition overflow-hidden group flex flex-col"
                                >
                                    <div className="h-40 bg-slate-100 overflow-hidden relative">
                                        <img
                                            src={rel.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80'}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="px-2 py-0.5 bg-white/95 text-[11px] font-bold text-blue-700 rounded-md">
                                                {rel.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-[#5575FF] transition">
                                            {rel.title}
                                        </h4>
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                                            <span>
                                                {new Date(rel.publishedAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                            <span>{rel.views} views</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
                <p>© {new Date().getFullYear()} Portal Berita & Warta Sekolah. Hak cipta dilindungi undang-undang.</p>
            </footer>
        </div>
    )
}
