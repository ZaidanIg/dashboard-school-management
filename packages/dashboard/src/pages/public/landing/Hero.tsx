import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, BookOpenCheck, CalendarDays, MapPin, UserRound } from 'lucide-react'
import { Container, Reveal } from './ui'
import type { PpdbConfig, PublicSchool } from './useLandingData'

interface HeroProps {
    school: PublicSchool | null
    schoolName: string
    ppdb: PpdbConfig | null
    onNavigate: (href: string) => void
}

const heroImages = [
    '/images/school-hero.png',
    '/images/landing/flag-ceremony.jpg',
    '/images/landing/science-lab.jpg',
    '/images/landing/arts.jpg',
    '/images/landing/computer-lab.jpg',
    '/images/landing/basketball.jpg'
]

export function Hero({ school, schoolName, ppdb, onNavigate }: HeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const facts = [
        { label: 'Akreditasi', value: school?.accreditation || '—' },
        { label: 'Tahun Berdiri', value: school?.foundedYear ? String(school.foundedYear) : '—' },
        { label: 'Kurikulum', value: (school?.curriculum || 'Merdeka').replace(/^Kurikulum\s+/i, '') },
    ]

    return (
        <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
            {/* Subtle atmospheric glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(255,255,255,0.15),transparent_70%)]" aria-hidden="true" />

            <Container className="relative grid items-center gap-10 pt-12 pb-24 sm:pt-16 sm:pb-28 lg:grid-cols-12 lg:gap-12 lg:pt-20 lg:pb-32 text-center lg:text-left">
                <Reveal className="lg:col-span-6">

                    <h1 className="font-heading text-3xl leading-[1.12] sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        {schoolName}
                    </h1>

                    <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg leading-relaxed text-blue-100/90">
                        {school?.vision || 'Pusat keunggulan pendidikan, pembinaan karakter berakhlak mulia, dan inovasi pembelajaran digital.'}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">
                        {ppdb?.isOpen ? (
                            <Link
                                to="/ppdb/register"
                                className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm sm:text-base font-bold text-blue-800 shadow-md hover:bg-blue-50 transition-all"
                            >
                                Daftar PPDB Online <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <a
                                href="#ppdb"
                                onClick={(e) => { e.preventDefault(); onNavigate('#ppdb') }}
                                className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm sm:text-base font-bold text-blue-800 shadow-md hover:bg-blue-50 transition-all"
                            >
                                Informasi PPDB <ArrowRight size={18} />
                            </a>
                        )}
                        <a
                            href="#profil"
                            onClick={(e) => { e.preventDefault(); onNavigate('#profil') }}
                            className="inline-flex h-11 sm:h-12 items-center justify-center rounded-lg px-6 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all"
                        >
                            Profil Sekolah
                        </a>
                    </div>

                    <dl className="mt-10 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6 text-center">
                        {facts.map((f) => (
                            <div key={f.label} className="px-2 sm:px-3 first:pl-0">
                                <dt className="text-[11px] sm:text-xs uppercase tracking-wider text-blue-200/80 font-medium">{f.label}</dt>
                                <dd className="mt-1 font-heading text-lg sm:text-2xl font-bold text-white truncate">{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>

                <Reveal delay={0.1} className="lg:col-span-6">
                    <figure className="relative mx-auto max-w-xl lg:max-w-none">
                        <div className="relative aspect-[4/3] w-full rounded-2xl shadow-2xl shadow-blue-950/40 overflow-hidden ring-4 ring-white/20">
                            <div
                                className="flex h-full w-full transition-transform duration-1000 ease-in-out"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {heroImages.map((src, idx) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt={`Lingkungan ${schoolName} ${idx + 1}`}
                                        className="h-full w-full object-cover flex-shrink-0"
                                        fetchPriority={idx === 0 ? "high" : "auto"}
                                        onError={(e) => {
                                             (e.target as HTMLImageElement).src = '/images/school-hero.png';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {school?.accreditation && (
                            <figcaption className="absolute -bottom-5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-6 flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-800 shadow-xl border border-slate-100 max-w-[calc(100%-2rem)] sm:max-w-none">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                    <Award size={22} />
                                </span>
                                <div className="text-left min-w-0">
                                    <span className="block text-sm font-bold text-slate-900 leading-tight truncate">Terakreditasi {school.accreditation}</span>
                                    <span className="block text-xs text-slate-500 truncate">
                                        {school.accreditationYear ? `BAN-S/M ${school.accreditationYear}` : 'Standar Nasional BAN-S/M'}
                                    </span>
                                </div>
                            </figcaption>
                        )}
                    </figure>
                </Reveal>
            </Container>
        </section>
    )
}

interface QuickLinksProps {
    onNavigate: (href: string) => void
    stats: { value: string; label: string }[]
}

export function QuickLinks({ onNavigate, stats }: QuickLinksProps) {
    const links = [
        { icon: <CalendarDays size={20} />, title: 'Info PPDB', desc: 'Jadwal, alur & syarat pendaftaran', href: '#ppdb' },
        { icon: <UserRound size={20} />, title: 'Portal Akademik', desc: 'Akses siswa, guru & tenaga pendidik', to: '/login' },
        { icon: <BookOpenCheck size={20} />, title: 'Fasilitas & Program', desc: 'Sarana belajar & program unggulan', href: '#fasilitas' },
        { icon: <MapPin size={20} />, title: 'Kontak & Lokasi', desc: 'Alamat kampus dan jam operasional', href: '#kontak' },
    ]

    const cardClass =
        'group flex h-full flex-col gap-3 rounded-2xl bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl border transition-all duration-300 hover:-translate-y-1'

    const inner = (l: (typeof links)[number]) => (
        <>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {l.icon}
            </div>
            <div>
                <span className="flex items-center gap-1.5 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {l.title}
                    <ArrowRight size={14} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </span>
                <span className="mt-1 block text-xs sm:text-sm text-slate-500 leading-snug">{l.desc}</span>
            </div>
        </>
    )

    return (
        <section aria-label="Akses cepat" className="bg-transparent pb-8 sm:pb-12">
            <Container>
                {/* 4 Feature Cards overlapping hero */}
                <div className="relative z-10 -mt-12 lg:-mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {links.map((l) =>
                        l.to ? (
                            <Link key={l.title} to={l.to} className={cardClass}>{inner(l)}</Link>
                        ) : (
                            <a key={l.title} href={l.href} onClick={(e) => { e.preventDefault(); onNavigate(l.href!) }} className={cardClass}>
                                {inner(l)}
                            </a>
                        )
                    )}
                </div>

                {/* Real-time statistics bar */}
                {stats.length > 0 && (
                    <Reveal>
                        <div className="mt-10 sm:mt-12 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                            <dl className="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-8 lg:grid-cols-4 sm:divide-x divide-slate-100">
                                {stats.map((s) => (
                                    <div key={s.label} className="flex flex-col items-center justify-center text-center px-2 sm:px-4 py-1 sm:py-0">
                                        <dd className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 tabular-nums tracking-tight">
                                            {s.value}
                                        </dd>
                                        <dt className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                            {s.label}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </Reveal>
                )}
            </Container>
        </section>
    )
}
