import React from 'react';
import { Section, SectionHeader, Reveal } from './ui';
import { programs } from './content';
import { useLandingData } from './useLandingData';
import { Clock } from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
    science: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    math: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    language: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
    ),
    tech: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    arts: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    sports: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A4 4 0 002 9.11V14a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-2 2h-5.248zM15 10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v6" />
        </svg>
    ),
};

const defaultExtracurricularItems = [
    { name: 'Pramuka', category: 'Kepanduan', schedule: 'Jumat, 14.00 WIB', description: 'Pembentukan karakter mandiri, survival alam terbuka, dan ketangkasan.' },
    { name: 'Paskibra', category: 'Kepemimpinan', schedule: 'Rabu & Sabtu, 15.00 WIB', description: 'Kedisiplinan, baris-berbaris, dan pengibaran bendera upacara resmi.' },
    { name: 'PMR', category: 'Kemanusiaan', schedule: 'Selasa, 15.30 WIB', description: 'Keterampilan pertolongan pertama, kesehatan remaja, dan bakti sosial.' },
    { name: 'Basket', category: 'Olahraga', schedule: 'Selasa & Jumat, 15.30 WIB', description: 'Pengembangan fisik, strategi tim, dan kompetisi liga pelajar.' },
    { name: 'Futsal', category: 'Olahraga', schedule: 'Senin & Kamis, 16.00 WIB', description: 'Latihan taktik bola, ketangkasan, dan turnamen antar-sekolah.' },
    { name: 'Tari Tradisional', category: 'Seni & Budaya', schedule: 'Kamis, 15.30 WIB', description: 'Pelestarian kebudayaan nusantara dan festival seni pelajar.' },
    { name: 'KIR & Sains', category: 'Sains & Riset', schedule: 'Senin, 15.30 WIB', description: 'Eksperimen laboratorium, karya ilmiah remaja, dan bimbingan OSN.' },
    { name: 'Klub Coding & Robotik', category: 'Teknologi', schedule: 'Rabu, 15.30 WIB', description: 'Algoritma pemrograman, web development, dan inovasi teknologi digital.' }
];

const getExkulImage = (name: string, category?: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('basket')) return '/images/landing/basketball.jpg';
    if (lower.includes('tari') || lower.includes('seni')) return '/images/landing/arts.jpg';
    if (lower.includes('paskibra') || lower.includes('upacara') || lower.includes('bendera')) return '/images/landing/flag-ceremony.jpg';
    if (lower.includes('kir') || lower.includes('sains') || lower.includes('olimpiade') || lower.includes('riset')) return '/images/landing/science-lab.jpg';
    if (lower.includes('coding') || lower.includes('robotik') || lower.includes('komputer') || lower.includes('it')) return '/images/landing/computer-lab.jpg';
    if (lower.includes('futsal') || lower.includes('sepak') || lower.includes('bola')) return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('pramuka')) return 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('pmr') || lower.includes('palang merah') || lower.includes('kesehatan')) return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('suara') || lower.includes('musik') || lower.includes('band')) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('english') || lower.includes('bahasa') || lower.includes('debat')) return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('jurnalistik') || lower.includes('foto')) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    
    if (category?.toLowerCase().includes('olahraga')) return '/images/landing/basketball.jpg';
    if (category?.toLowerCase().includes('seni')) return '/images/landing/arts.jpg';
    if (category?.toLowerCase().includes('sains')) return '/images/landing/science-lab.jpg';
    if (category?.toLowerCase().includes('tekno')) return '/images/landing/computer-lab.jpg';
    
    return '/images/school-hero.png';
};

export const Programs: React.FC = () => {
    const { data } = useLandingData();
    const extracurriculars = data?.extracurriculars || [];
    const exkulItems = extracurriculars.length > 0 ? extracurriculars : defaultExtracurricularItems;

    return (
        <Section id="akademik" className="bg-transparent py-10 sm:py-16">
            <div className="w-full">
                <SectionHeader
                    eyebrow="Kurikulum & Akademik"
                    title="Program Akademik Unggulan"
                    description="Fokus kurikulum terarah untuk membekali kompetensi riset, sains, teknologi, dan persiapan perguruan tinggi."
                    align="center"
                    tone="dark"
                />

                {/* Academic Programs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {programs.map((program, index) => (
                        <Reveal key={index} delay={index * 0.08}>
                            <div className="bg-white border border-slate-200/80 hover:border-blue-400 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
                                <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl flex items-center justify-center mb-5 transition-colors shadow-2xs">
                                    {IconMap[program.icon]}
                                </div>
                                <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                                    {program.title}
                                </h3>
                                <p className="text-slate-600 text-xs sm:text-sm mb-5 flex-grow leading-relaxed">
                                    {program.desc}
                                </p>
                                <div className="pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
                                    {program.highlights.map((highlight, hIndex) => (
                                        <span key={hIndex} className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 text-xs font-semibold rounded-md">
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Extracurriculars Section */}
                <div className="mt-16 sm:mt-20 pt-12 border-t border-blue-900/40">
                    <Reveal>
                        <div className="text-center mb-8">
                            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                                Pengembangan Diri & Ekstrakurikuler
                            </h3>
                            <p className="text-blue-100/80 text-xs sm:text-sm max-w-xl mx-auto">
                                Beragam kegiatan ekstrakurikuler untuk mewadahi minat, kepemimpinan, seni, dan olahraga di luar jam kelas.
                            </p>
                        </div>
                    </Reveal>

                    {/* Extracurricular Cards Grid with Images */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mt-8">
                        {exkulItems.map((item, index) => {
                            const img = getExkulImage(item.name, item.category);
                            return (
                                <Reveal key={index} delay={index * 0.04}>
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
                                        {/* Extracurricular Photo */}
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={img}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = '/images/school-hero.png';
                                                }}
                                            />
                                            {item.category && (
                                                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white border border-white/20 shadow-xs">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-4 sm:p-5 flex flex-col flex-grow">
                                            <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h4>
                                            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-grow">
                                                {item.description || `Kegiatan pembinaan minat dan bakat ${item.name} untuk mengasah potensi serta prestasi peserta didik.`}
                                            </p>

                                            {/* Bottom Meta */}
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                                                    <Clock size={12} className="text-blue-600 shrink-0" />
                                                    <span>{item.schedule || 'Jadwal Mingguan'}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
};
