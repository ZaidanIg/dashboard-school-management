import React, { useState, useMemo } from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { useLandingData } from './useLandingData';
import { Building2 } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
    const { data } = useLandingData();
    const facilities = data?.facilities || [];
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const categories = useMemo(() => {
        const unique = Array.from(new Set(facilities.map(f => f.category))).filter(Boolean);
        return ['ALL', ...unique];
    }, [facilities]);

    if (facilities.length === 0) return null;

    const filtered = facilities.filter(f => {
        if (selectedCategory === 'ALL') return true;
        return f.category === selectedCategory;
    });

    const formatCondition = (condition?: string) => {
        switch (condition) {
            case 'GOOD':
                return { label: 'Kondisi Prima', dot: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
            case 'FAIR':
                return { label: 'Perlu Perawatan', dot: 'bg-amber-500', text: 'text-amber-700 bg-amber-50 border-amber-200' };
            case 'POOR':
                return { label: 'Dalam Perbaikan', dot: 'bg-rose-500', text: 'text-rose-700 bg-rose-50 border-rose-200' };
            default:
                return { label: 'Terstandar', dot: 'bg-blue-500', text: 'text-blue-700 bg-blue-50 border-blue-200' };
        }
    };

    return (
        <Section id="fasilitas" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Sarana & Prasarana"
                    title="Fasilitas Kampus Sekolah"
                    description="Sarana modern dan ruang belajar berstandar tinggi demi menunjang kenyamanan serta efektivitas belajar siswa."
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
                                {cat === 'ALL' ? 'Semua Fasilitas' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Facilities Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((facility, index) => {
                        const cond = formatCondition(facility.condition);
                        return (
                            <Reveal key={facility.id || index} delay={index * 0.04}>
                                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full">
                                    <div>
                                        <div className="flex items-center justify-between mb-3.5">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                                {facility.category}
                                            </span>
                                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                                {facility.quantity} Unit
                                            </span>
                                        </div>

                                        <h4 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {facility.name}
                                        </h4>

                                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                                            {facility.description || 'Fasilitas sarana pembelajaran modern terstandar nasional.'}
                                        </p>
                                    </div>

                                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cond.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cond.dot}`} />
                                            {cond.label}
                                        </span>
                                        <Building2 size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};
