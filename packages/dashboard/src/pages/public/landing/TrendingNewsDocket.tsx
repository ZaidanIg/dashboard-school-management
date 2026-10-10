import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    X,
    ArrowRight,
    Newspaper,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useLandingData, type PublicArticle } from './useLandingData';

interface TrendingNewsDocketProps {
    articles?: PublicArticle[];
    trendingArticles?: PublicArticle[];
}

export const TrendingNewsDocket: React.FC<TrendingNewsDocketProps> = ({
    articles: propArticles,
    trendingArticles: propTrending
}) => {
    const { data } = useLandingData();

    // Use passed props or fallback to hook data
    const rawArticles = propArticles && propArticles.length > 0
        ? propArticles
        : data?.articles || [];

    const rawTrending = propTrending && propTrending.length > 0
        ? propTrending
        : data?.trendingArticles || [];

    // Prioritize trending or sort by views
    const trendingList = rawTrending.length > 0
        ? rawTrending
        : [...rawArticles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen]);

    const displayList: PublicArticle[] = activeTab === 'trending'
        ? (trendingList.length > 0 ? trendingList : rawArticles)
        : rawArticles;

    return (
        <>
            {/* ============================================================== */}
            {/* BACKDROP OVERLAY (Klik di luar berkas untuk menutup)          */}
            {/* ============================================================== */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px]"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* ============================================================== */}
            {/* STICKY NEWS DOCKET (Konsep Awal Penanda Buku / Bookmark Tab)   */}
            {/* ============================================================== */}
            <div className="fixed inset-y-0 left-0 z-50 pointer-events-none select-none">
                <motion.div
                    initial={false}
                    animate={{ x: isOpen ? '0%' : '-100%' }}
                    transition={{
                        type: 'spring',
                        damping: 26,
                        stiffness: 220,
                        mass: 0.65
                    }}
                    className="relative h-full flex pointer-events-auto"
                >
                    {/* Lembaran Berkas Fisik (Mobile & Desktop) */}
                    <aside
                        className="w-[85vw] sm:w-[380px] lg:w-[410px] max-w-[calc(100vw-50px)] h-full bg-slate-900 border-r border-slate-700/90 shadow-2xl shadow-black/80 flex flex-col relative text-slate-100"
                        aria-label="Berkas Berita Populer & Trending"
                    >
                        {/* Header Berkas */}
                        <div className="pt-5 sm:pt-6 px-5 sm:px-6 pb-4 border-b border-slate-800 bg-slate-900/95">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                                            BERKAS WARTA
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-white tracking-tight">
                                        Berita Populer & Trending
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Liputan dan kabar paling banyak dibaca
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                    title="Tutup berkas"
                                    aria-label="Tutup berkas"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Segmented Filter Pills */}
                            <div className="mt-4 flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('trending')}
                                    className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                        activeTab === 'trending'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Trending
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('recent')}
                                    className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                        activeTab === 'recent'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Terbaru
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Ranked Articles */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
                            {displayList.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 text-xs">
                                    Belum ada artikel warta yang tersedia.
                                </div>
                            ) : (
                                displayList.map((item, index) => (
                                    <Link
                                        key={item.id}
                                        to={`/berita/${item.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="group relative flex gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition duration-200"
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                                                index === 0
                                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                    : index === 1
                                                    ? 'bg-slate-700 text-slate-200'
                                                    : index === 2
                                                    ? 'bg-amber-900/40 text-amber-200 border border-amber-800/30'
                                                    : 'bg-slate-800 text-slate-400'
                                            }`}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800 relative">
                                            <img
                                                src={item.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=250&q=80'}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                                                    <span className="text-blue-400 font-medium">{item.category}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-slate-400">
                                                        <Eye size={10} />
                                                        {item.views} views
                                                    </span>
                                                </div>
                                                <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition line-clamp-2 leading-snug">
                                                    {item.title}
                                                </h4>
                                            </div>

                                            <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60">
                                                <span>
                                                    {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                                <span className="text-blue-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                                                    Baca <ChevronRight size={11} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Bottom Action */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col gap-2">
                            <Link
                                to="/berita"
                                onClick={() => setIsOpen(false)}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
                            >
                                <Newspaper size={14} />
                                Buka Seluruh Portal Berita
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </aside>

                    {/* Penanda Berkas (Bookmark Tab / Konsep Penanda Buku) */}
                    {/* Pada mobile diletakkan di bawah (bottom-20), pada desktop di tengah (md:top-1/2 md:-translate-y-1/2) */}
                    <div className="absolute left-full bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-10">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-3.5 sm:py-4 rounded-r-2xl border-y border-r shadow-2xl transition-all duration-200 focus:outline-none cursor-pointer ${
                                isOpen
                                    ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                                    : 'bg-slate-900 border-slate-700/80 text-white hover:bg-slate-800 hover:border-blue-500/60 shadow-blue-950/50'
                            }`}
                            title={isOpen ? 'Tutup berkas' : 'Buka Berkas Warta & Trending'}
                            aria-label={isOpen ? 'Tutup berkas' : 'Buka Berkas Warta & Trending'}
                        >
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-amber-500 rounded-r-full" />

                            {isOpen ? (
                                <div className="flex flex-col items-center gap-1.5 text-slate-300 group-hover:text-white">
                                    <ChevronLeft size={16} />
                                    <span className="text-[10px] font-bold tracking-wider [writing-mode:vertical-rl] rotate-180 uppercase">
                                        TUTUP
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-200 group-hover:text-white py-1">
                                    <Newspaper size={14} className="text-blue-400" />
                                    <span className="text-[10px] font-bold tracking-widest [writing-mode:vertical-rl] rotate-180 uppercase text-slate-300 group-hover:text-white">
                                        NEWSLETTER
                                    </span>
                                    <ChevronRight size={13} className="text-slate-400" />
                                </div>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};
