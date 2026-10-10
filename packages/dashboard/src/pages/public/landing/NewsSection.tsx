import React from 'react';
import { Link } from 'react-router-dom';
import { Section, SectionHeader, Reveal } from './ui';
import { useLandingData } from './useLandingData';
import {
    Calendar,
    Eye,
    ArrowRight,
    Newspaper,
    User,
    ChevronRight
} from 'lucide-react';

export const NewsSection: React.FC = () => {
    const { data } = useLandingData();
    const articles = data?.articles || [];

    if (articles.length === 0) return null;

    const featured = articles[0];
    const subArticles = articles.slice(1, 4);

    return (
        <Section id="berita" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Portal Berita"
                    title="Kabar & Warta Sekolah Terkini"
                    description="Liputan kegiatan OSIS & MPK, prestasi siswa di kancah nasional, warta akademik, dan informasi resmi sekolah."
                    align="center"
                    tone="dark"
                />

                <div className="mt-8 space-y-6">
                    {/* Featured Headline Article */}
                    {featured && (
                        <Reveal delay={0.05}>
                            <div className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-blue-500/10">
                                <div className="grid md:grid-cols-12">
                                    {/* Image Box */}
                                    <div className="md:col-span-7 h-64 md:h-[360px] relative overflow-hidden bg-slate-900">
                                        <img
                                            src={featured.coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'}
                                            alt={featured.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5">
                                                Sorotan Utama
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg">
                                                {featured.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Text Box */}
                                    <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2.5 text-xs text-blue-200/70 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {new Date(featured.publishedAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={13} />
                                                    {featured.views} pembaca
                                                </span>
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-blue-300 transition line-clamp-3">
                                                <Link to={`/berita/${featured.slug}`}>
                                                    {featured.title}
                                                </Link>
                                            </h3>

                                            <p className="mt-3 text-xs sm:text-sm text-blue-100/70 leading-relaxed line-clamp-3">
                                                {featured.excerpt}
                                            </p>
                                        </div>

                                        <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-xs text-slate-300 flex items-center gap-1.5 truncate max-w-[140px]">
                                                <User size={13} className="text-blue-400" />
                                                {featured.authorName}
                                            </span>

                                            <Link
                                                to={`/berita/${featured.slug}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 group-hover:gap-2.5 transition-all"
                                            >
                                                Baca Berita
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )}

                    {/* Sub Grid 3-column Cards */}
                    {subArticles.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {subArticles.map((item, idx) => (
                                <Reveal key={item.id} delay={0.1 + idx * 0.05}>
                                    <Link
                                        to={`/berita/${item.slug}`}
                                        className="group h-full bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-blue-500/10 hover:-translate-y-1"
                                    >
                                        <div>
                                            <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-900 relative mb-3.5">
                                                <img
                                                    src={item.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                                <div className="absolute top-2.5 left-2.5">
                                                    <span className="px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-[11px] text-blue-200/70 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} />
                                                    {item.views}
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition line-clamp-2 leading-snug">
                                                {item.title}
                                            </h4>

                                            <p className="text-xs text-blue-100/60 mt-2 line-clamp-2 leading-relaxed">
                                                {item.excerpt}
                                            </p>
                                        </div>

                                        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                                            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                                                {item.authorName}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                Baca
                                                <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom CTA to Full News Portal */}
                <div className="mt-10 text-center">
                    <Link
                        to="/berita"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
                    >
                        <Newspaper size={16} />
                        Buka Semua Warta & Portal Berita
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </Section>
    );
};
