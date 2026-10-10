import React from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { principal } from './content';
import { useLandingData, resolveAssetUrl } from './useLandingData';
import { Compass, Target, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
    const { data } = useLandingData();
    const schoolProfile = data?.school;

    const principalStructure = data?.structures?.find(
        s => s.category === 'LEADERSHIP' && (s.position.toLowerCase().includes('kepala') || s.order === 1)
    ) || data?.structures?.[0];

    const currentPrincipal = {
        name: principalStructure?.name || principal.name,
        title: principalStructure?.position || principal.title,
        photo: principalStructure?.photo || principal.photo,
        greeting: principalStructure?.greeting ? [principalStructure.greeting] : principal.greeting
    };

    return (
        <Section id="profil" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Profil Sekolah"
                    title="Mengenal Lebih Dekat"
                    description="Sambutan pimpinan sekolah dan komitmen institusi dalam mencetak generasi unggul."
                    align="center"
                    tone="dark"
                />

                <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-200/80">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* Principal Photo Column */}
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <Reveal>
                                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/90 aspect-[4/5] max-w-sm mx-auto lg:mx-0 group">
                                    <img
                                        src={resolveAssetUrl(currentPrincipal.photo)}
                                        alt={currentPrincipal.name}
                                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/landing/principal.jpg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end">
                                        <div className="p-6 w-full text-white">
                                            <h3 className="font-heading text-xl font-bold">{currentPrincipal.name}</h3>
                                            <p className="text-blue-300 text-sm font-medium mt-0.5">{currentPrincipal.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        {/* Greeting & Vision Mission Column */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <Reveal delay={0.1}>
                                <h3 className="font-heading text-2xl sm:text-3xl text-slate-900 font-bold mb-4 text-center lg:text-left">
                                    Fokus pada Kualitas, Disiplin, dan Prestasi
                                </h3>
                            </Reveal>

                            <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base mb-8 text-center sm:text-left">
                                {currentPrincipal.greeting.map((p, i) => (
                                    <Reveal key={i} delay={0.2 + (i * 0.08)}>
                                        <p>{p}</p>
                                    </Reveal>
                                ))}
                            </div>

                            {/* Vision & Mission Cards */}
                            {(schoolProfile?.vision || schoolProfile?.mission) && (
                                <div className="grid sm:grid-cols-2 gap-5 pt-2">
                                    {schoolProfile.vision && (
                                        <Reveal delay={0.3}>
                                            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 flex flex-col h-full">
                                                <div className="flex items-center gap-2 text-blue-700 font-heading font-bold text-base mb-2.5">
                                                    <Compass size={18} />
                                                    <span>Visi Sekolah</span>
                                                </div>
                                                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                                                    {schoolProfile.vision}
                                                </p>
                                            </div>
                                        </Reveal>
                                    )}
                                    {schoolProfile.mission && (
                                        <Reveal delay={0.4}>
                                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col h-full">
                                                <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-base mb-2.5">
                                                    <Target size={18} className="text-blue-600" />
                                                    <span>Misi Sekolah</span>
                                                </div>
                                                <ul className="text-slate-600 text-xs sm:text-sm space-y-2">
                                                    {(Array.isArray(schoolProfile.mission) ? schoolProfile.mission : [schoolProfile.mission]).slice(0, 3).map((m, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                                            <span>{m}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Reveal>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
