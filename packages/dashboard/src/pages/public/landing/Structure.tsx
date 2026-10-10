import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Section, SectionHeader } from './ui';
import { useLandingData, resolveAssetUrl } from './useLandingData';
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Shield,
    User,
    X,
} from 'lucide-react';

export const Structure: React.FC = () => {
    const { data } = useLandingData();
    const structures = data?.structures || [];
    const [activeTab, setActiveTab] = useState<'ALL' | 'LEADERSHIP' | 'DEPARTMENT' | 'COMMITTEE'>('ALL');
    const [selectedMember, setSelectedMember] = useState<(typeof structures)[number] | null>(null);

    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const filtered = structures.filter(item => {
        if (activeTab === 'ALL') return true;
        return item.category === activeTab;
    });

    const categoryLabel = (cat: string) => {
        switch (cat) {
            case 'LEADERSHIP':
                return 'Pimpinan';
            case 'DEPARTMENT':
                return 'Bidang MGMP';
            case 'COMMITTEE':
                return 'Komite';
            default:
                return cat;
        }
    };

    const checkScroll = useCallback(() => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        const card = carouselRef.current.firstElementChild as HTMLElement | null;
        if (card) {
            const cardWidth = card.offsetWidth + 20;
            const idx = Math.min(
                Math.round(scrollLeft / cardWidth),
                Math.max(0, filtered.length - 1)
            );
            setActiveIndex(Math.max(0, idx));
        }
    }, [filtered.length]);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        el.scrollTo({ left: 0, behavior: 'smooth' });
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [activeTab, checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const card = carouselRef.current.firstElementChild as HTMLElement | null;
        const amount = (card ? card.offsetWidth + 20 : 320) * (direction === 'left' ? -1 : 1);
        carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    const scrollToIndex = (index: number) => {
        if (!carouselRef.current) return;
        const items = carouselRef.current.children;
        if (items[index]) {
            (items[index] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });
        }
    };

    if (structures.length === 0) return null;

    return (
        <Section id="struktur" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Struktur Organisasi"
                    title="Pimpinan & Dewan Manajemen"
                    description="Jajaran pimpinan, wakil kepala sekolah, koordinator program kurikulum, dan komite sekolah."
                    align="center"
                    tone="dark"
                />

                {/* Simplified & Clean Category Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-8">
                    {[
                        { id: 'ALL', label: 'Semua' },
                        { id: 'LEADERSHIP', label: 'Pimpinan' },
                        { id: 'DEPARTMENT', label: 'Bidang MGMP' },
                        { id: 'COMMITTEE', label: 'Komite' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all cursor-pointer font-medium ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-900 shadow-md font-bold scale-105'
                                    : 'bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white backdrop-blur-sm border border-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Carousel Container */}
                <div className="relative group/carousel">
                    {/* Floating Side Arrow Left (Desktop) */}
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Profil sebelumnya"
                        className="hidden lg:flex items-center justify-center absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    {/* Floating Side Arrow Right (Desktop) */}
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Profil berikutnya"
                        className="hidden lg:flex items-center justify-center absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronRight size={22} />
                    </button>

                    {/* Scrollable Track */}
                    <div
                        ref={carouselRef}
                        className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {filtered.map((member) => (
                            <div
                                key={member.id}
                                className="flex-none w-[275px] sm:w-[305px] md:w-[320px] snap-start"
                            >
                                <div className="bg-white rounded-[28px] p-3.5 sm:p-4 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
                                    {/* Inset Rounded Portrait Photo - Clean without overlay badge */}
                                    <div className="relative aspect-[4/4.7] w-full rounded-[22px] overflow-hidden bg-slate-100 mb-3.5 shadow-2xs">
                                        {member.photo ? (
                                            <img
                                                src={resolveAssetUrl(member.photo)}
                                                alt={member.name}
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = '/images/landing/principal.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <GraduationCap size={48} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Information Body */}
                                    <div className="px-1 flex flex-col flex-grow">
                                        {/* Name with Emerald Verified Badge Check (Matches Mockup) */}
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <h4 className="font-heading font-bold text-base sm:text-[17px] text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                                                {member.name}
                                            </h4>
                                            <BadgeCheck
                                                size={19}
                                                className="text-white fill-[#10B981] shrink-0 drop-shadow-xs"
                                                aria-label="Terverifikasi"
                                            />
                                        </div>

                                        {/* Position & Role Description (Matches Mockup Subtitle) */}
                                        <p className="mt-1.5 text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                                            {member.greeting || `${member.position}${member.department ? ` • ${member.department}` : ''}. Berdedikasi dalam mutu tata kelola sekolah.`}
                                        </p>

                                        {/* Bottom Action / Meta Row (Matches Mockup) */}
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                                <span className="flex items-center gap-1 text-slate-600">
                                                    <User size={13} className="text-slate-400" />
                                                    <span>{categoryLabel(member.category)}</span>
                                                </span>
                                                <span className="flex items-center gap-1 text-slate-600">
                                                    <Shield size={12} className="text-slate-400" />
                                                    <span>#{member.order || 1}</span>
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedMember(member)}
                                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-semibold transition-all border border-slate-200/50 hover:border-transparent active:scale-95 shadow-2xs cursor-pointer"
                                            >
                                                Profil +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Symmetrical Carousel Navigation Controls & Dots */}
                <div className="flex items-center justify-center gap-3.5 mt-8">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Profil sebelumnya"
                        className="p-2.5 rounded-full bg-white text-slate-800 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-md transition-all active:scale-95 border border-slate-200/60 cursor-pointer"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Dots */}
                    {filtered.length > 1 && (
                        <div className="flex items-center gap-1.5">
                            {filtered.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => scrollToIndex(idx)}
                                    aria-label={`Ke profil ke-${idx + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        activeIndex === idx
                                            ? 'w-7 bg-white shadow-md'
                                            : 'w-2 bg-white/40 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Profil berikutnya"
                        className="p-2.5 rounded-full bg-white text-slate-800 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-md transition-all active:scale-95 border border-slate-200/60 cursor-pointer"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Detail Modal Popup */}
                {selectedMember && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setSelectedMember(null)}
                    >
                        <div
                            className="bg-white rounded-[32px] p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                                <div className="relative w-36 h-44 rounded-[22px] overflow-hidden bg-slate-100 shrink-0 shadow-md">
                                    <img
                                        src={resolveAssetUrl(selectedMember.photo)}
                                        alt={selectedMember.name}
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = '/images/landing/principal.jpg';
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="inline-flex items-center gap-1.5 mb-1.5">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            {categoryLabel(selectedMember.category)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                        <h3 className="font-heading font-bold text-lg text-slate-900">
                                            {selectedMember.name}
                                        </h3>
                                        <BadgeCheck size={20} className="text-white fill-[#10B981] shrink-0" />
                                    </div>
                                    <p className="text-sm font-medium text-blue-600 mt-0.5">
                                        {selectedMember.position}
                                    </p>
                                    {selectedMember.department && (
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Bidang / Divisi: {selectedMember.department}
                                        </p>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                                        <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Profil & Sambutan
                                        </h5>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {selectedMember.greeting ||
                                                `${selectedMember.name} menjabat sebagai ${selectedMember.position} dan berkomitmen untuk mewujudkan keunggulan karakter serta mutu akademik peserta didik.`}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                                        <span>Status: <strong className="text-emerald-600 font-semibold">Aktif Berdinas</strong></span>
                                        <span>No. Urut: <strong>#{selectedMember.order || 1}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};
