import React, { useState, useMemo } from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { fallbackGallery } from './content';
import { useLandingData, resolveAssetUrl } from './useLandingData';
import { X, ZoomIn } from 'lucide-react';

export const Gallery: React.FC = () => {
    const { data } = useLandingData();
    const dataGallery = data?.gallery || [];
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [previewItem, setPreviewItem] = useState<{ title: string; category: string; imageUrl: string } | null>(null);

    const displayGallery = dataGallery.length > 0
        ? dataGallery.map((g) => ({
            title: g.title,
            category: g.category || 'Galeri',
            imageUrl: g.imageUrl
        }))
        : fallbackGallery;

    const categories = useMemo(() => {
        const unique = Array.from(new Set(displayGallery.map(g => g.category))).filter(Boolean);
        return ['ALL', ...unique];
    }, [displayGallery]);

    const filtered = displayGallery.filter(item => {
        if (selectedCategory === 'ALL') return true;
        return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    return (
        <Section id="galeri" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Dokumentasi Kampus"
                    title="Galeri Kegiatan & Fasilitas"
                    description="Potret kebersamaan, sarana belajar, dan rekaman kegiatan warga sekolah."
                    align="center"
                    tone="dark"
                />

                {/* Categories Filter Tabs */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${selectedCategory === cat
                                        ? 'bg-white text-blue-800 shadow-md font-bold'
                                        : 'bg-blue-950/60 text-blue-200 hover:text-white hover:bg-white/10 border border-blue-800/60'
                                    }`}
                            >
                                {cat === 'ALL' ? 'Semua Galeri' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item, index) => {
                        const resolvedUrl = resolveAssetUrl(item.imageUrl);
                        return (
                            <Reveal key={index} delay={index * 0.04}>
                                <div
                                    onClick={() => setPreviewItem(item)}
                                    className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-square cursor-pointer shadow-xs hover:shadow-xl transition-all border border-slate-200/80"
                                >
                                    <img
                                        src={resolvedUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/school-hero.png';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                                                {item.category}
                                            </span>
                                            <ZoomIn size={15} className="text-white opacity-80" />
                                        </div>
                                        <h4 className="text-white font-heading font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                                            {item.title}
                                        </h4>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Modal */}
            {previewItem && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setPreviewItem(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <div className="max-h-[72vh] overflow-hidden flex items-center justify-center bg-black">
                            <img
                                src={resolveAssetUrl(previewItem.imageUrl)}
                                alt={previewItem.title}
                                className="max-h-[72vh] w-auto object-contain"
                            />
                        </div>
                        <div className="p-5 bg-slate-900 flex items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                    {previewItem.category}
                                </span>
                                <h3 className="font-heading text-base sm:text-lg font-bold text-white mt-0.5">
                                    {previewItem.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
};
