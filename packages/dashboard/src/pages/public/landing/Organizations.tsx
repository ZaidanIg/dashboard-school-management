import React from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { useLandingData } from './useLandingData';
import { Award, CheckCircle2, Compass, Target, Users } from 'lucide-react';

export const Organizations: React.FC = () => {
    const { data } = useLandingData();
    const organizations = data?.organizations || [];
    const schoolName = data?.school?.name?.trim();

    if (organizations.length === 0) return null;

    // Sort to keep OSIS first, MPK second if both exist
    const orgList = [...organizations].sort((a, b) => {
        if (a.type === 'OSIS') return -1;
        if (b.type === 'OSIS') return 1;
        return 0;
    });

    return (
        <Section id="organisasi" className="bg-transparent py-10 sm:py-16 overflow-hidden">
            <div className="w-full max-w-full">
                <SectionHeader
                    eyebrow="Organisasi Siswa"
                    title="OSIS dan MPK"
                    description="Wadah demokrasi, pengembangan integritas, bakat organisasi, dan karakter kepemimpinan generasi muda."
                    align="center"
                    tone="dark"
                />

                {/* 2-Grid Side-by-Side Layout for OSIS & MPK from School Profile */}
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mt-8 w-full max-w-full">
                    {orgList.map((org, index) => {
                        const rawPrograms = org.programs;
                        const programsList: Array<{ id?: string | number; name: string; status?: string }> = Array.isArray(rawPrograms)
                            ? rawPrograms.map((p: any) => {
                                  if (typeof p === 'string') return { name: p, status: 'upcoming' };
                                  return { id: p?.id, name: p?.name || String(p), status: p?.status || 'upcoming' };
                              })
                            : [];

                        const displayName = schoolName ? `${org.type} ${schoolName}` : (org.name || org.type);

                        return (
                            <Reveal key={org.id || index} delay={index * 0.1} className="w-full max-w-xl mx-auto lg:max-w-none">
                                <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1 w-full max-w-full overflow-hidden">
                                    {/* Card Header Info */}
                                    <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                                        <div className="flex flex-col items-center sm:items-start min-w-0">
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white tracking-wide uppercase">
                                                    {org.type}
                                                </span>
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                    Masa Bakti: {org.period}
                                                </span>
                                            </div>
                                            <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-center sm:text-left break-words">
                                                {displayName}
                                            </h3>
                                        </div>

                                        {org._count?.members ? (
                                            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold shrink-0 self-center sm:self-auto">
                                                <Users size={14} className="text-blue-600" />
                                                <span>{org._count.members} Pengurus</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Vision Box */}
                                    {org.vision && (
                                        <div className="my-5 p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-700 font-heading font-bold text-xs uppercase tracking-wider mb-1.5">
                                                <Compass size={15} />
                                                <span>Visi Organisasi</span>
                                            </div>
                                            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                                                {org.vision}
                                            </p>
                                        </div>
                                    )}

                                    {/* Mission List */}
                                    {Array.isArray(org.mission) && org.mission.length > 0 && (
                                        <div className="mb-5">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider mb-2.5">
                                                <Target size={15} className="text-blue-600" />
                                                <span>Misi Utama</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {org.mission.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
                                                        <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Flagship Work Programs */}
                                    {programsList.length > 0 && (
                                        <div className="mt-auto pt-5 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                                    <Award size={15} className="text-blue-600" />
                                                    <span>Program Kerja Unggulan</span>
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-400">
                                                    {programsList.length} Program
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {programsList.slice(0, 4).map((prog, pIdx) => {
                                                    const isCompleted = prog.status === 'completed';
                                                    return (
                                                        <div
                                                            key={prog.id || pIdx}
                                                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors flex items-center justify-between gap-2.5 sm:gap-3 text-xs w-full min-w-0"
                                                        >
                                                            <span className="font-medium text-slate-800 truncate min-w-0 flex-1">
                                                                {prog.name}
                                                            </span>
                                                            <span
                                                                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                                    isCompleted
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-slate-200/80 text-slate-700'
                                                                }`}
                                                            >
                                                                {isCompleted ? 'Terlaksana' : 'Agenda'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};
