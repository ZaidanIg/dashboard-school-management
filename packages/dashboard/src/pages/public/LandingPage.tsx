import { Link } from 'react-router-dom'
import { useSchoolProfile } from '../../hooks/useSettings'
import {
    Users,
    BookOpen,
    MapPin,
    Phone,
    Mail,
    Globe,
    GraduationCap,
    Award,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Star,
    Trophy,
    ExternalLink,
    Menu,
    ArrowRight,
    Sparkles,
    Target,
    Heart,
    Lightbulb,
    Palette,
    Cpu,
    FlaskConical,
    Languages,
    Calculator,
    Dumbbell,
    Megaphone,
    Send,
    Quote,
    Play,
    X,
    Check
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// Animated Counter Hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(!startOnView)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (startOnView && ref.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true)
                    }
                },
                { threshold: 0.5 }
            )
            observer.observe(ref.current)
            return () => observer.disconnect()
        }
    }, [startOnView, hasStarted])

    useEffect(() => {
        if (!hasStarted) return

        let startTime: number | null = null
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [end, duration, hasStarted])

    return { count, ref }
}

// Countdown Timer Hook
function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    return timeLeft
}

export default function LandingPage() {
    const { school } = useSchoolProfile()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeTestimonial, setActiveTestimonial] = useState(0)
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [activeProgram, setActiveProgram] = useState(0)

    const [scrolled, setScrolled] = useState(false)
    const [isHoveringProgram, setIsHoveringProgram] = useState(false)
    const [ppdbConfig, setPpdbConfig] = useState<any>(null)

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Animated counters
    const studentsCounter = useCountUp(1200, 2000)
    const ptnCounter = useCountUp(95, 2000)
    const achievementsCounter = useCountUp(50, 2000)

    // Fetch PPDB Config
    useEffect(() => {
        const fetchPpdbConfig = async () => {
            try {
                const res = await fetch('http://localhost:3001/public/ppdb/config')
                const data = await res.json()
                setPpdbConfig(data)
            } catch (error) {
                console.error('Failed to fetch PPDB config', error)
            }
        }
        fetchPpdbConfig()
    }, [])

    // PPDB Countdown - use API date or fallback
    const ppdbDeadline = ppdbConfig?.endDate ? new Date(ppdbConfig.endDate) : new Date('2024-06-30T23:59:59')
    const countdown = useCountdown(ppdbDeadline)

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Auto-rotate programs
    useEffect(() => {
        if (isHoveringProgram) return
        const interval = setInterval(() => {
            setActiveProgram((prev) => (prev + 1) % programs.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [isHoveringProgram])

    // Programs data
    const programs = [
        { icon: <FlaskConical size={28} />, title: 'Sains & Teknologi', desc: 'Laboratorium modern dengan peralatan canggih. Program STEM terintegrasi dengan proyek nyata. Bimbingan olimpiade sains tingkat nasional.', highlights: ['Lab IPA Lengkap', 'Program STEM', 'Olimpiade Sains'] },
        { icon: <Languages size={28} />, title: 'Bahasa & Sastra', desc: 'Program bilingual English-Indonesia. Persiapan TOEFL dan IELTS. Klub debat dan public speaking aktif.', highlights: ['Bilingual Program', 'TOEFL Prep', 'Debate Club'] },
        { icon: <Calculator size={28} />, title: 'Matematika', desc: 'Pembinaan intensif olimpiade matematika. Metode pembelajaran inovatif. Persiapan UTBK maksimal.', highlights: ['Bimbel Olimpiade', 'Metode Modern', 'UTBK Ready'] },
        { icon: <Palette size={28} />, title: 'Seni & Kreativitas', desc: 'Studio seni lengkap dengan peralatan profesional. Pameran karya tahunan. Kolaborasi dengan seniman lokal.', highlights: ['Studio Seni', 'Pameran', 'Workshop'] },
        { icon: <Cpu size={28} />, title: 'Teknologi Informasi', desc: 'Lab komputer dengan 60+ PC modern. Ekstrakurikuler coding dan robotik. Kompetisi nasional dan internasional.', highlights: ['60+ Komputer', 'Coding Club', 'Robotik'] },
        { icon: <Dumbbell size={28} />, title: 'Olahraga', desc: 'Lapangan futsal, basket, dan voli standar nasional. Pelatih profesional bersertifikat. Tim juara liga pelajar.', highlights: ['Lapangan Standar', 'Pelatih Pro', 'Tim Juara'] },
    ]

    const testimonials = [
        { name: 'Aisyah Putri', class: 'Kelas 12 IPA', quote: 'Guru-guru di sini sangat supportif! Saya berhasil meraih juara 1 Olimpiade Biologi berkat bimbingan mereka. Fasilitas lab yang lengkap juga sangat membantu praktikum saya.', avatar: 'AP', color: 'from-pink-500 to-rose-500' },
        { name: 'Rizky Pratama', class: 'Kelas 11 IPS', quote: 'Banyak kegiatan seru yang mengembangkan soft skill. OSIS dan ekskul di sini luar biasa! Saya belajar leadership dan teamwork yang nggak didapat di kelas.', avatar: 'RP', color: 'from-blue-500 to-cyan-500' },
        { name: 'Dinda Maharani', class: 'Alumni 2023 - UI', quote: 'Sekarang saya kuliah di UI Teknik Informatika. Terima kasih atas bekal ilmu dan karakternya! Persiapan UTBK di sini benar-benar mantap.', avatar: 'DM', color: 'from-purple-500 to-violet-500' },
        { name: 'Ahmad Fauzan', class: 'Alumni 2023 - ITB', quote: 'PTN impian tercapai! ITB Teknik Elektro. Pembinaan olimpiade di sekolah ini top banget, sampai dapat emas OSN Fisika.', avatar: 'AF', color: 'from-amber-500 to-orange-500' },
    ]

    const galleryItems = [
        { id: 1, title: 'Upacara Bendera', category: 'Kegiatan', image: '/images/gallery/1.jpg' },
        { id: 2, title: 'Juara OSN Matematika', category: 'Prestasi', image: '/images/gallery/2.jpg' },
        { id: 3, title: 'Pentas Seni Akhir Tahun', category: 'Acara', image: '/images/gallery/3.jpg' },
        { id: 4, title: 'Laboratorium Komputer', category: 'Fasilitas', image: '/images/gallery/4.jpg' },
        { id: 5, title: 'Latihan Basket', category: 'Ekstrakurikuler', image: '/images/gallery/5.jpg' },
        { id: 6, title: 'Wisuda Kelas 12', category: 'Acara', image: '/images/gallery/6.jpg' },
    ]

    const faqs = [
        { q: 'Kapan pendaftaran PPDB dibuka?', a: 'Pendaftaran PPDB dibuka mulai 1 Juni hingga 30 Juni 2024. Pendaftaran dilakukan secara online melalui website resmi sekolah.' },
        { q: 'Apa saja persyaratan masuk?', a: 'Persyaratan meliputi: Ijazah/SKL SMP, Rapor semester 1-5, Foto 3x4, Kartu Keluarga, Akta Kelahiran, dan mengikuti tes seleksi.' },
        { q: 'Berapa biaya pendidikan?', a: 'Informasi biaya dapat dilihat di brosur atau menghubungi bagian administrasi. Tersedia program beasiswa untuk siswa berprestasi.' },
        { q: 'Apakah ada asrama?', a: 'Ya, kami menyediakan fasilitas asrama putra dan putri dengan pengawasan 24 jam dan fasilitas lengkap.' },
        { q: 'Bagaimana sistem pembelajaran?', a: 'Kami menerapkan Kurikulum Merdeka dengan pendekatan student-centered learning, project-based learning, dan integrasi teknologi.' },
    ]

    const achievements = [
        { title: 'Juara 1 Olimpiade Sains Nasional', level: 'Tingkat Nasional 2024', student: 'Tim Sains', medal: 'gold' },
        { title: 'Medali Emas Kompetisi Robotik', level: 'RoboFest Asia 2024', student: 'Tim Robotik', medal: 'gold' },
        { title: 'Juara Umum FLS2N', level: 'Tingkat Provinsi 2024', student: 'Tim Seni', medal: 'gold' },
    ]

    const medalColors: Record<string, string> = {
        gold: 'text-yellow-500 border-yellow-400 bg-yellow-50',
    }

    const whyChooseUs = [
        { icon: <Target size={24} />, title: 'Kurikulum Merdeka', desc: 'Pembelajaran yang fleksibel dan berpusat pada siswa' },
        { icon: <Trophy size={24} />, title: 'Prestasi Gemilang', desc: '50+ penghargaan tingkat nasional & internasional' },
        { icon: <Heart size={24} />, title: 'Karakter Unggul', desc: 'Pembentukan akhlak dan kepribadian yang kuat' },
        { icon: <Lightbulb size={24} />, title: 'Inovasi Pembelajaran', desc: 'Teknologi & metode pembelajaran terkini' },
    ]


    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
            const headerOffset = 80 // Adjust based on your fixed header height
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
        setMobileMenuOpen(false)
    }

    return (
        <div className="min-h-screen bg-sky-50/50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans overflow-x-hidden antialiased selection:bg-sky-500/30">
            {/* Video Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowVideoModal(false)}>
                    <div className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                            onClick={() => setShowVideoModal(false)}
                        >
                            <X size={24} className="text-white" />
                        </button>
                        <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center">
                                <Play size={64} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Video Profile Sekolah</p>
                                <p className="text-sm text-white/60">Video akan diputar di sini</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex min-h-screen flex-col">
                {/* Header */}
                <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled
                    ? 'border-b border-white/50 dark:border-white/5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm h-20'
                    : 'bg-transparent h-24 border-transparent'
                    }`}>
                    <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/20 animate-pulse">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <span className="text-lg font-extrabold tracking-tight block">{school?.name || 'SEKOLAH UNGGULAN'}</span>
                                <span className={`text-xs ${scrolled ? 'text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>NPSN: {school?.npsn || '12345678'}</span>
                            </div>
                        </div >
                        <nav className="hidden md:flex items-center gap-8">
                            {[
                                { label: 'Program', href: '#programs' },
                                { label: 'Keunggulan', href: '#why-us' },
                                { label: 'Galeri', href: '#gallery' },
                                { label: 'Prestasi', href: '#achievements' },
                                { label: 'FAQ', href: '#faq' },
                                { label: 'PPDB', href: '#ppdb' },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    className={`text-sm font-semibold transition-colors relative group ${scrolled ? 'text-slate-500 hover:text-sky-500' : 'text-slate-600 dark:text-slate-300 hover:text-sky-500'
                                        }`}
                                    href={item.href}
                                    onClick={(e) => handleSmoothScroll(e, item.href)}
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link to="/login" className={`hidden md:flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all hover:scale-105 ${scrolled
                                ? 'border-slate-200 hover:bg-slate-50'
                                : 'border-slate-300 bg-white/50 hover:bg-white backdrop-blur-sm'
                                }`}>
                                Masuk
                            </Link>
                            <Link
                                to="/ppdb/register"
                                className="hidden md:flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 text-sm font-bold shadow-lg shadow-sky-500/20 hover:shadow-xl transition-all hover:scale-105 animate-pulse"
                            >
                                Daftar Sekarang
                            </Link>
                            <button className="flex md:hidden items-center justify-center p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-100 bg-white dark:bg-slate-800 p-4 animate-slideDown shadow-xl">
                            <nav className="flex flex-col gap-4">
                                {['Program', 'Keunggulan', 'Galeri', 'Prestasi', 'FAQ', 'PPDB'].map((item) => (
                                    <a
                                        key={item}
                                        className="text-sm font-semibold text-slate-600 hover:text-sky-500 py-2"
                                        href={`#${item.toLowerCase()}`}
                                        onClick={(e) => handleSmoothScroll(e, `#${item.toLowerCase()}`)}
                                    >
                                        {item}
                                    </a>
                                ))}
                                <Link to="/login" className="py-2 px-4 border border-slate-200 rounded-lg text-center font-semibold">Masuk</Link>
                                <Link
                                    to="/ppdb/register"
                                    className="py-2 px-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg text-center font-bold"
                                >
                                    Daftar Sekarang
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-800">
                        <div className="absolute -top-40 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-3xl animate-pulse"></div>
                        <div className="absolute top-40 -left-20 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                                <div className="flex flex-col gap-6 text-center lg:text-left">
                                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mx-auto lg:mx-0 animate-bounce" style={{ animationDuration: '2s' }}>
                                        <Sparkles size={14} className="text-amber-500" />
                                        <span className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">PPDB 2024/2025 Dibuka!</span>
                                    </div>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                                        Raih <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-500 animate-gradient">Masa Depan Cerah</span> Bersama Kami
                                    </h1>
                                    <p className="text-lg leading-relaxed text-slate-500 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
                                        Bergabunglah dengan ribuan siswa berprestasi. Kami siap mengantarkanmu menuju perguruan tinggi impian dengan program unggulan dan fasilitas terbaik.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                                        <Link to="/ppdb/register" className="group h-14 min-w-[200px] rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 hover:gap-4">
                                            🎓 Daftar Sekarang
                                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <button onClick={() => setShowVideoModal(true)} className="group h-14 min-w-[200px] rounded-xl border-2 border-slate-200 bg-white px-8 text-lg font-bold shadow-sm transition-all hover:border-sky-500 hover:bg-sky-50 flex items-center justify-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                                <Play size={18} className="ml-0.5" />
                                            </div>
                                            Tonton Video
                                        </button>
                                    </div>

                                    {/* Animated Stats */}
                                    <div ref={studentsCounter.ref} className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-slate-100 dark:border-white/10">
                                        <div className="text-center lg:text-left group cursor-pointer">
                                            <p className="text-3xl font-extrabold text-sky-500 group-hover:scale-110 transition-transform inline-block">{studentsCounter.count}+</p>
                                            <p className="text-sm text-slate-500">Siswa Aktif</p>
                                        </div>
                                        <div ref={ptnCounter.ref} className="text-center lg:text-left group cursor-pointer">
                                            <p className="text-3xl font-extrabold text-teal-500 group-hover:scale-110 transition-transform inline-block">{ptnCounter.count}%</p>
                                            <p className="text-sm text-slate-500">Lulus PTN</p>
                                        </div>
                                        <div ref={achievementsCounter.ref} className="text-center lg:text-left group cursor-pointer">
                                            <p className="text-3xl font-extrabold text-amber-500 group-hover:scale-110 transition-transform inline-block">{achievementsCounter.count}+</p>
                                            <p className="text-sm text-slate-500">Prestasi</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Image with interactive elements */}
                                <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none group">
                                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-700 aspect-[4/3] border-4 border-white dark:border-white/5 transition-transform duration-500 group-hover:scale-[1.02]">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent z-10 pointer-events-none"></div>
                                        <img alt="Students in modern school" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src="/images/school-hero.png" />

                                        {/* Play button overlay */}
                                        <button
                                            onClick={() => setShowVideoModal(true)}
                                            className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                                <Play size={32} className="text-sky-500 ml-1" />
                                            </div>
                                        </button>

                                        {/* Floating Badge */}
                                        <div className="absolute bottom-6 left-6 z-20 bg-white/95 p-4 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl text-white shadow-lg animate-pulse">
                                                    <Star size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-bold uppercase">Akreditasi</p>
                                                    <p className="text-2xl font-extrabold">{school?.accreditation || 'A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6 z-20 bg-white/95 px-4 py-2 rounded-full shadow-lg border border-gray-100 backdrop-blur-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                                            <BookOpen size={16} className="text-teal-500" />
                                            <span className="text-sm font-bold">Kurikulum Merdeka</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="py-20 bg-gradient-to-br from-sky-500 to-teal-500 text-white" id="why-us">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Mengapa Memilih Kami?</h2>
                                <p className="text-sky-100 text-lg max-w-2xl mx-auto">Kami berkomitmen memberikan pendidikan terbaik untuk masa depanmu</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {whyChooseUs.map((item, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer group" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="w-14 h-14 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-sm text-sky-100">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Programs Section - Interactive Tabs */}
                    <section
                        className="py-20 bg-sky-50/50 dark:bg-slate-900"
                        id="programs"
                        onMouseEnter={() => setIsHoveringProgram(true)}
                        onMouseLeave={() => setIsHoveringProgram(false)}
                    >
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Program Unggulan</h2>
                                <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Klik untuk melihat detail program</p>
                            </div>

                            {/* Program Tabs */}
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                {programs.map((program, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveProgram(idx)}
                                        className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${activeProgram === idx
                                            ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg scale-105'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {program.icon}
                                        <span className="hidden sm:inline">{program.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Active Program Detail */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all">
                                <div className="grid lg:grid-cols-2 gap-8 p-8">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white">
                                                {programs[activeProgram].icon}
                                            </div>
                                            <h3 className="text-2xl font-bold">{programs[activeProgram].title}</h3>
                                        </div>
                                        <p className="text-slate-500 text-lg mb-6 leading-relaxed">{programs[activeProgram].desc}</p>
                                        <div className="space-y-3">
                                            {programs[activeProgram].highlights.map((h, i) => (
                                                <div key={i} className="flex items-center gap-3 text-slate-600">
                                                    <Check size={20} className="text-teal-500" />
                                                    <span className="font-medium">{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-teal-100 dark:from-slate-700 dark:to-slate-600 aspect-video flex items-center justify-center">
                                        <div className="text-center text-slate-400">
                                            <img src="/images/school-hero.png" alt={programs[activeProgram].title} className="w-full h-full object-cover rounded-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gallery Carousel */}
                    <section className="py-20 bg-white dark:bg-slate-800" id="gallery">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8 overflow-hidden">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Galeri Kegiatan</h2>
                                <p className="mt-4 text-lg text-slate-500">Momen-momen seru di sekolah kami</p>
                            </div>

                            <div className="relative group">
                                <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
                                    {galleryItems.map((item, idx) => (
                                        <div key={idx} className="min-w-[280px] md:min-w-[320px] snap-center rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative group/item cursor-pointer hover:shadow-xl transition-all">
                                            <div className="aspect-[4/3] bg-slate-200">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://placehold.co/600x400';
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover/item:opacity-100 transition-opacity"></div>
                                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                                <span className="inline-block px-2 py-1 bg-sky-500/80 backdrop-blur-sm text-white text-xs rounded-md mb-2">{item.category}</span>
                                                <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Gradient fade on edges */}
                                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-slate-800 to-transparent pointer-events-none lg:hidden"></div>
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pointer-events-none lg:hidden"></div>
                            </div>

                            <div className="text-center mt-6">
                                <Link to="/profile" className="inline-flex items-center gap-2 text-sky-500 font-semibold hover:gap-3 transition-all">
                                    Lihat Semua Galeri <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </section>


                    {/* Achievements */}
                    <section className="py-20 bg-white dark:bg-slate-800" id="achievements">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Prestasi Membanggakan</h2>
                                    <p className="text-lg text-slate-500 mb-8">Siswa-siswi kami terus mengukir prestasi di berbagai kompetisi.</p>
                                    <div className="space-y-4">
                                        {achievements.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-white/5 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${medalColors[item.medal]}`}>
                                                    <Trophy size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{item.title}</h4>
                                                    <p className="text-sm text-slate-500">{item.level}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                        <img src="/images/school-hero.png" alt="Achievement" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex flex-col items-center justify-center text-white p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                                        <Trophy size={48} className="mb-4 group-hover:animate-bounce" />
                                        <p className="text-4xl font-extrabold">50+</p>
                                        <p className="text-sm font-medium text-amber-100">Prestasi</p>
                                    </div>
                                    <div className="col-span-2 aspect-[2/1] rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 flex items-center justify-center text-white p-6 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
                                        <div className="text-center">
                                            <p className="text-5xl font-extrabold mb-2">95%</p>
                                            <p className="text-lg font-medium text-sky-100">Alumni Diterima di PTN Favorit</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Carousel */}
                    <section className="py-20 bg-sky-50/50 dark:bg-slate-900">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Kata Mereka</h2>
                                <p className="mt-4 text-lg text-slate-500">Pengalaman nyata dari siswa dan alumni</p>
                            </div>

                            {/* Carousel */}
                            <div className="relative max-w-4xl mx-auto">
                                <div className="overflow-hidden rounded-3xl">
                                    <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                                        {testimonials.map((item, idx) => (
                                            <div key={idx} className="w-full flex-shrink-0 p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-3xl">
                                                <Quote size={48} className="text-sky-500/20 mb-6" />
                                                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 italic leading-relaxed">"{item.quote}"</p>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                                        {item.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg">{item.name}</p>
                                                        <p className="text-slate-500">{item.class}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <button
                                        onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="flex gap-2">
                                        {testimonials.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveTestimonial(idx)}
                                                className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === idx ? 'bg-sky-500 w-8' : 'bg-slate-300 hover:bg-slate-400'}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Accordion */}
                    <section className="py-20 bg-white dark:bg-slate-800" id="faq">
                        <div className="mx-auto max-w-3xl px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan Umum</h2>
                                <p className="mt-4 text-lg text-slate-500">Temukan jawaban atas pertanyaan yang sering diajukan</p>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <span className="font-semibold text-lg pr-4">{faq.q}</span>
                                            <ChevronDown size={24} className={`text-slate-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-48' : 'max-h-0'}`}>
                                            <p className="px-6 pb-6 text-slate-500 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PPDB with Countdown */}
                    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white" id="ppdb">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2 text-amber-400 font-bold text-sm mb-4 animate-pulse">
                                    <Megaphone size={16} /> PENERIMAAN PESERTA DIDIK BARU
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                    PPDB {ppdbConfig?.isOpen ? ppdbConfig.academicYear : 'Tahun Ajaran 2024/2025'}
                                    {ppdbConfig?.isOpen && <span className="ml-2 text-amber-400">- {ppdbConfig.name}</span>}
                                </h2>
                                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                    {ppdbConfig?.isOpen
                                        ? 'Pendaftaran ditutup dalam:'
                                        : ppdbConfig?.message || 'Pendaftaran akan segera dibuka'
                                    }
                                </p>
                            </div>

                            {/* Countdown Timer */}
                            {ppdbConfig?.isOpen && (
                                <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-12">
                                    {[
                                        { value: countdown.days, label: 'Hari' },
                                        { value: countdown.hours, label: 'Jam' },
                                        { value: countdown.minutes, label: 'Menit' },
                                        { value: countdown.seconds, label: 'Detik' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                                            <p className="text-4xl lg:text-5xl font-extrabold text-amber-400">{String(item.value).padStart(2, '0')}</p>
                                            <p className="text-sm text-gray-400 mt-1">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA */}
                            <div className="text-center">
                                {ppdbConfig?.isOpen ? (
                                    <Link to="/ppdb/register" className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-10 text-lg font-bold text-slate-900 shadow-xl shadow-amber-500/20 hover:shadow-2xl transition-all gap-2 hover:scale-105 group">
                                        🎓 Daftar PPDB Online
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <div className="inline-flex h-14 items-center justify-center rounded-xl bg-slate-700 px-10 text-lg font-semibold text-slate-400 cursor-not-allowed">
                                        🔒 Pendaftaran Belum Dibuka
                                    </div>
                                )}
                                <p className="mt-4 text-gray-400 text-sm">Hubungi: <span className="text-white font-medium">{school?.phone || '(021) 555-0123'}</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="py-20 bg-sky-50/50 dark:bg-slate-900">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Kunjungi Kami</h2>
                                    <p className="text-lg text-slate-500 mb-8">Jadwalkan kunjungan untuk melihat langsung fasilitas kami!</p>
                                    <div className="space-y-4">
                                        {[
                                            { icon: <MapPin size={20} />, label: 'Alamat', value: `${school?.address || 'Jl. Pendidikan No. 123'}, ${school?.city || 'Jakarta'}`, color: 'sky' },
                                            { icon: <Phone size={20} />, label: 'Telepon', value: school?.phone || '(021) 555-0123', color: 'teal' },
                                            { icon: <Mail size={20} />, label: 'Email', value: school?.email || 'info@sekolah.sch.id', color: 'purple' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                                <div className={`p-3 rounded-lg bg-${item.color}-100 text-${item.color}-500 dark:bg-${item.color}-900/30`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{item.label}</h4>
                                                    <p className="text-sm text-slate-500">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-3xl overflow-hidden shadow-2xl h-80 lg:h-[400px] group">
                                    <img src="/images/school-hero.png" alt="School Campus" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white">
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-white">{school?.name || 'Sekolah Unggulan'}</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-6 max-w-md">{school?.vision || 'Mewujudkan generasi unggul, berkarakter, dan berprestasi.'}</p>
                                <div className="flex gap-4">
                                    {[Globe, ExternalLink, Mail].map((Icon, idx) => (
                                        <a key={idx} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-sky-500 transition-colors hover:scale-110" href="#">
                                            <Icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Menu</h4>
                                <ul className="space-y-3 text-sm">
                                    {['Program', 'Keunggulan', 'Prestasi', 'FAQ', 'PPDB'].map((item) => (
                                        <li key={item}><a className="hover:text-sky-400 transition-colors" href={`#${item.toLowerCase()}`}>{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Kontak</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-sky-400 shrink-0" /><span>{school?.address || 'Jl. Pendidikan No. 123'}</span></li>
                                    <li className="flex items-center gap-2"><Phone size={14} className="text-sky-400" /><span>{school?.phone || '(021) 555-0123'}</span></li>
                                    <li className="flex items-center gap-2"><Mail size={14} className="text-sky-400" /><span>{school?.email || 'info@sekolah.sch.id'}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
                            <p className="text-sm text-slate-500">© 2024 {school?.name || 'Sekolah Unggulan'}. Hak Cipta Dilindungi.</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Powered by</span><span className="font-bold text-sky-400">Artefact</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
