import React, { useState } from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { fallbackAchievements } from './content';
import { useLandingData, type AchievementLevel } from './useLandingData';
import { Trophy, Medal, Award, User } from 'lucide-react';

export const Achievements: React.FC = () => {
    const { data } = useLandingData();
    const dataAchievements = data?.achievements || [];
    const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

    const displayAchievements = dataAchievements.length > 0
        ? dataAchievements.map((a) => ({
            title: a.title,
            level: (a.level || 'NASIONAL') as AchievementLevel,
            year: a.year,
            category: a.category,
            description: a.description,
            studentName: a.studentName
        }))
        : fallbackAchievements.map(a => ({ ...a, description: undefined }));

    const filtered = displayAchievements.filter(a => {
        if (selectedLevel === 'ALL') return true;
        return a.level.toUpperCase() === selectedLevel.toUpperCase();
    });

    const getLevelConfig = (level: string) => {
        switch (level.toUpperCase()) {
            case 'INTERNASIONAL':
                return { label: 'Tingkat Internasional', badge: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Trophy size={13} className="text-blue-700" /> };
            case 'NASIONAL':
                return { label: 'Tingkat Nasional', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Medal size={13} className="text-blue-600" /> };
            case 'PROVINSI':
                return { label: 'Tingkat Provinsi', badge: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Award size={13} className="text-sky-600" /> };
            case 'KOTA':
                return { label: 'Tingkat Kota / Daerah', badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Award size={13} className="text-slate-600" /> };
            default:
                return { label: `Tingkat ${level}`, badge: 'bg-slate-50 text-slate-700 border-slate-200', icon: <Award size={13} className="text-slate-600" /> };
        }
    };

    return (
        <Section id="prestasi" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Prestasi Siswa"
                    title="Jejak Prestasi & Penghargaan"
                    description="Catatan penghargaan membanggakan yang diraih oleh siswa-siswi di berbagai kompetisi sains, riset, seni, dan olahraga."
                    align="center"
                    tone="dark"
                />

                {/* Level Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-10">
                    {[
                        { id: 'ALL', label: 'Semua Prestasi' },
                        { id: 'INTERNASIONAL', label: 'Internasional' },
                        { id: 'NASIONAL', label: 'Nasional' },
                        { id: 'PROVINSI', label: 'Provinsi' },
                        { id: 'KOTA', label: 'Kota / Daerah' },
                    ].map(lvl => (
                        <button
                            key={lvl.id}
                            onClick={() => setSelectedLevel(lvl.id)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${selectedLevel === lvl.id
                                    ? 'bg-white text-blue-800 shadow-md font-bold'
                                    : 'bg-blue-950/60 text-blue-200 hover:text-white hover:bg-white/10 border border-blue-800/60'
                                }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((achievement, index) => {
                        const levelConfig = getLevelConfig(achievement.level);
                        return (
                            <Reveal key={index} delay={index * 0.05}>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                                    <div className="flex items-center justify-between gap-3 mb-3.5">
                                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                                            {achievement.year}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                                            {achievement.category}
                                        </span>
                                    </div>

                                    <h4 className="font-heading text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {achievement.title}
                                    </h4>

                                    {achievement.description && (
                                        <p className="text-xs sm:text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    )}

                                    {achievement.studentName && (
                                        <p className="text-xs sm:text-sm text-slate-600 mb-4 flex items-center gap-1.5 mt-auto">
                                            <User size={14} className="text-slate-400" />
                                            <span>Oleh: <strong className="font-semibold text-slate-800">{achievement.studentName}</strong></span>
                                        </p>
                                    )}

                                    <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${levelConfig.badge}`}>
                                            {levelConfig.icon}
                                            {levelConfig.label}
                                        </span>
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
